/**
 * E2E verification for the deployed hking DataService Worker.
 * Usage: DATA_SERVICE_TOKEN=<token> node e2e-data-service.mjs [base-url]
 * Mirrors the browser flow: WS opened BEFORE the run, ticket userId === run owner.
 */
import { createHmac } from "node:crypto";
import WebSocket from "ws";

const BASE = process.argv[2] ?? "https://structa-hking-dataservicescript.structa.workers.dev";
const TOKEN = process.env.DATA_SERVICE_TOKEN;
if (!TOKEN) {
	console.error("Missing DATA_SERVICE_TOKEN");
	process.exit(1);
}

const TICKET_TTL_MS = 5 * 60 * 1000;
function mintTicket(conversationId, userId) {
	const payload = Buffer.from(
		JSON.stringify({ c: conversationId, u: userId, exp: Date.now() + TICKET_TTL_MS }),
	).toString("base64url");
	const signature = createHmac("sha256", TOKEN).update(payload).digest("base64url");
	return `${payload}.${signature}`;
}

let failures = 0;
function check(name, condition, detail = "") {
	if (condition) console.log(`  ✓ ${name}`);
	else {
		failures += 1;
		console.log(`  ✗ ${name} ${detail}`);
	}
}

async function request(path, { method = "GET", headers = {}, body } = {}) {
	const response = await fetch(`${BASE}${path}`, {
		method,
		headers: { ...headers },
		body,
	});
	const text = await response.text();
	let json = null;
	try {
		json = text ? JSON.parse(text) : null;
	} catch {
		/* non-JSON */
	}
	return { status: response.status, json, text };
}

const USER = "test-user";
const serviceHeaders = () => ({
	Authorization: `Bearer ${TOKEN}`,
	"x-structa-user-id": USER,
});

const runId = `run-e2e-${Date.now()}`;
const messageId = `msg-e2e-${Date.now()}`;
const conversationId = `conv-e2e-${Date.now()}`;
const ticket = mintTicket(conversationId, USER);
console.log(`\n== ${conversationId} (user ${USER}) ==`);

// 1. Health (open)
const health = await request("/health");
check("health 200", health.status === 200, `${health.status} ${health.text}`);

// 2. Unauthenticated access rejected
const unauth = await request(`/conversations/${conversationId}/messages`);
check("unauth GET -> 401", unauth.status === 401, `${unauth.status}`);

// 3. Invalid ticket rejected
const badTicket = await request(
	`/conversations/${conversationId}/events?ticket=AAAA.garbage`,
);
check("bad ticket GET -> 403", badTicket.status === 403, `${badTicket.status}`);

// 4. Valid ticket: read (owner check applies once a run exists)
const eventsEmpty = await request(
	`/conversations/${conversationId}/events?afterSeq=0&ticket=${encodeURIComponent(ticket)}`,
);
check("ticket GET events -> 200 []", eventsEmpty.status === 200 && Array.isArray(eventsEmpty.json?.events), `${eventsEmpty.status} ${eventsEmpty.text}`);

// 5. Service GET messages before run
const before = await request(`/conversations/${conversationId}/messages`, {
	headers: serviceHeaders(),
});
check(
	"service GET messages -> 200 []",
	before.status === 200 && Array.isArray(before.json?.messages) && before.json.messages.length === 0,
	`${before.status} ${before.text}`,
);

// 6. Invalid run body -> 400
const invalidRun = await request(`/conversations/${conversationId}/run`, {
	method: "POST",
	headers: { ...serviceHeaders(), "content-type": "application/json" },
	body: JSON.stringify({ messageId, runId, userId: USER, content: "" }),
});
check("invalid run -> 400", invalidRun.status === 400, `${invalidRun.status} ${invalidRun.text}`);

// 7. Open WS BEFORE the run (as the browser does) — ONE message listener
console.log("  · opening WS (ticket) before run …");
const wsEvents = [];
let resolveCompletion, rejectCompletion;
const completionPromise = new Promise((resolve, reject) => {
	resolveCompletion = resolve;
	rejectCompletion = reject;
});
let completionTimeout;
const wsOpen = await new Promise((resolve) => {
	const socket = new WebSocket(
		`${BASE.replace(/^http/, "ws")}/conversations/${conversationId}/socket?ticket=${encodeURIComponent(ticket)}`,
	);
	const openTimer = setTimeout(() => {
		socket.close();
		resolve({ ok: false, reason: "open timeout (15s)" });
	}, 15_000);
	socket.on("open", () => {
		clearTimeout(openTimer);
		completionTimeout = setTimeout(() => rejectCompletion(new Error("completion timeout (180s)")), 180_000);
		resolve({ ok: true, socket });
	});
	socket.on("message", (data) => {
		const envelope = JSON.parse(String(data));
		wsEvents.push(envelope);
		if (envelope.type === "run" && envelope.run.status !== "running") {
			socket.close();
			resolveCompletion({ ok: true });
		}
	});
	socket.on("error", (error) => {
		clearTimeout(openTimer);
		clearTimeout(completionTimeout);
		resolve({ ok: false, reason: String(error) });
		rejectCompletion({ ok: false, reason: String(error) });
	});
});
check("WS opened", wsOpen.ok, wsOpen.reason);

// 8. Start a real run (OpenRouter via the Durable Object)
const started = await request(`/conversations/${conversationId}/run`, {
	method: "POST",
	headers: { ...serviceHeaders(), "content-type": "application/json" },
	body: JSON.stringify({ messageId, runId, userId: USER, content: "Say exactly: hello from e2e" }),
});
check("POST run -> 202 accepted", started.status === 202, `${started.status} ${started.text}`);

// 9. Conflict while running
const started2 = await request(`/conversations/${conversationId}/run`, {
	method: "POST",
	headers: { ...serviceHeaders(), "content-type": "application/json" },
	body: JSON.stringify({ messageId: `msg-e2e-2-${Date.now()}`, runId: `run-e2e-2-${Date.now()}`, userId: USER, content: "second" }),
});
check("conflicting run -> 409", started2.status === 409, `${started2.status} ${started2.text}`);

// 10. Await WS completion (single listener already driving wsEvents)
const completion = wsOpen.ok && wsOpen.socket ? await completionPromise : { ok: false, reason: "socket never opened" };
check("WS streamed run to completion", completion.ok, completion.reason);

const contentEvents = wsEvents.filter((e) => e.type === "event" && e.event.type === "content");
const doneEvents = wsEvents.filter((e) => e.type === "event" && e.event.type === "done");
const wsMessages = wsEvents.filter((e) => e.type === "message");
const runEnvelopes = wsEvents.filter((e) => e.type === "run");
check("WS delivered content events", contentEvents.length > 0, `(${contentEvents.length})`);
check("WS delivered done event", doneEvents.length === 1, `(${doneEvents.length})`);
check(
	"WS delivered user + assistant messages",
	wsMessages.some((m) => m.message.role === "user") &&
		wsMessages.some((m) => m.message.role === "assistant"),
	`(${wsMessages.map((m) => m.message.role).join(",")})`,
);
check(
	"WS delivered run complete envelope",
	runEnvelopes.some((r) => r.run?.status === "complete"),
	`(${runEnvelopes.map((r) => r.run?.status).join(",")})`,
);

// 11. Persisted transcript in the DO SQLite
const after = await request(`/conversations/${conversationId}/messages`, {
	headers: serviceHeaders(),
});
const roles = (after.json?.messages ?? []).map((m) => m.role);
check(
	"DO messages: user + assistant persisted",
	roles.includes("user") && roles.includes("assistant"),
	`(${roles.join(",")})`,
);

// 12. Events persisted + replayable by seq (as the browser relay would)
const replayed = await request(
	`/conversations/${conversationId}/events?afterSeq=0&ticket=${encodeURIComponent(ticket)}`,
);
const types = (replayed.json?.events ?? []).map((e) => e.type);
check(
	"events replay includes content/done",
	replayed.status === 200 && types.includes("content") && types.includes("done"),
	`(${replayed.status}: ${types.join(",")})`,
);

// 13. Boundary: DELETE not allowed
const del = await request(`/conversations/${conversationId}`, { method: "DELETE", headers: serviceHeaders() });
check("DELETE -> 405", del.status === 405, `${del.status}`);

console.log(failures === 0 ? "\nALL E2E CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);