/**
 * Materialize happy-path E2E: prepares a real session/run/user-message in
 * Neon, starts a Worker run through the service auth path, streams it via
 * WebSocket (ticket), then verifies Neon got the assistant message + run
 * status + timestamp bump.
 *
 * Usage: DATA_SERVICE_TOKEN=<token> DATABASE_URL=<neon url> node e2e-materialize.mjs [base-url]
 */
import { createHmac } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import WebSocket from "ws";

const BASE = process.argv[2] ?? "https://structa-hking-dataservicescript.structa.workers.dev";
const TOKEN = process.env.DATA_SERVICE_TOKEN;
const DBURL = process.env.DATABASE_URL;
if (!TOKEN || !DBURL) {
	console.error("Missing DATA_SERVICE_TOKEN / DATABASE_URL");
	process.exit(1);
}
const USER = process.env.E2E_USER ?? "1ca56a50-7ed3-44f2-9519-66977d3dbcea"; // bot user

let failures = 0;
const check = (name, ok, detail = "") => {
	console.log(`${ok ? "  ✓" : "  ✗"} ${name} ${detail}`);
	if (!ok) failures += 1;
};

const mintTicket = (conversationId, userId) => {
	const payload = Buffer.from(JSON.stringify({ c: conversationId, u: userId, exp: Date.now() + 5 * 60 * 1000 })).toString("base64url");
	const signature = createHmac("sha256", TOKEN).update(payload).digest("base64url");
	return `${payload}.${signature}`;
};

const sql = neon(DBURL);
const runId = `run-pv-${Date.now()}`;
const messageId = `msg-pv-${Date.now()}`;
const sessionId = `conv-pv-${Date.now()}`;
console.log(`\n== ${sessionId} (user ${USER}) ==`);

// 1. Prepare the session + running run + user message in Neon (as the backend would).
await sql`
	INSERT INTO chat_sessions (id, user_id, title, message_count, last_message_at, created_at, updated_at)
	VALUES (${sessionId}, ${USER}, 'E2E materialize', 1, now() - interval '1 hour', now() - interval '1 hour', now() - interval '1 hour')
`;
await sql`
	INSERT INTO chat_runs (id, session_id, user_id, status, created_at, updated_at)
	VALUES (${runId}, ${sessionId}, ${USER}, 'running', now() - interval '1 hour', now() - interval '1 hour')
`;
await sql`
	INSERT INTO chat_messages (id, session_id, user_id, run_id, role, content, created_at)
	VALUES (${messageId}, ${sessionId}, ${USER}, ${runId}, 'user', 'Say exactly: hello from materialize e2e', now() - interval '1 hour')
`;
console.log("  · session prepared in Neon");

// 2. Start the run through the service auth path.
const started = await fetch(`${BASE}/conversations/${sessionId}/run`, {
	method: "POST",
	headers: { Authorization: `Bearer ${TOKEN}`, "x-structa-user-id": USER, "content-type": "application/json" },
	body: JSON.stringify({ messageId, runId, userId: USER, content: "Say exactly: hello from materialize e2e" }),
});
check("POST run -> 202", started.status === 202, `${started.status} ${await started.text()}`);

// 3. Stream it over the WS (browser ticket for the same user).
const ticket = mintTicket(sessionId, USER);
let done = false;
const events = [];
await new Promise((resolve) => {
	const socket = new WebSocket(`${BASE.replace(/^http/, "ws")}/conversations/${sessionId}/socket?ticket=${encodeURIComponent(ticket)}`);
	const timer = setTimeout(() => { socket.close(); resolve(); }, 150_000);
	socket.on("message", (data) => {
		const envelope = JSON.parse(String(data));
		events.push(envelope);
		if (envelope.type === "run" && envelope.run.status !== "running") {
			done = true;
			clearTimeout(timer);
			socket.close();
			resolve();
		}
	});
	socket.on("error", () => { clearTimeout(timer); resolve(); });
});
check("WS run completed", done);
check(
	"WS: content + done events",
	events.some((e) => e.type === "event" && e.event.type === "content") &&
		events.some((e) => e.type === "event" && e.event.type === "done"),
	`(${events.filter((e) => e.type === "event").map((e) => e.event.type).join(",")})`,
);
check(
	"WS: no error event",
	!events.some((e) => e.type === "event" && e.event.type === "error"),
);

// 4. Verify Neon materialization.
// NOTE: `timestamp` (without time zone) values read back through the neon HTTP
// client are shifted by the reader process's timezone, so we compare RELATIVE
// to the pre-run baseline instead of an absolute clock window.
// Materialize runs on a waitUntil after the run-complete broadcast; poll until
// every materialized artifact is visible (assistant msg, run complete, bump).
const baselineRows = await sql`SELECT last_message_at FROM chat_sessions WHERE id = ${sessionId}`;
const baseline = baselineRows[0]?.last_message_at;
let messages = [];
let runs = [];
let sessions = [];
let bumped = false;
let assistantTied = false;
let runComplete = false;
for (let i = 0; i < 20 && !(bumped && assistantTied && runComplete); i++) {
	messages = await sql`SELECT id, role, content, run_id FROM chat_messages WHERE session_id = ${sessionId} ORDER BY created_at`;
	runs = await sql`SELECT id, status FROM chat_runs WHERE id = ${runId}`;
	sessions = await sql`SELECT last_message_at FROM chat_sessions WHERE id = ${sessionId}`;
	bumped = sessions.length === 1 && sessions[0].last_message_at != null && new Date(sessions[0].last_message_at) > new Date(baseline);
	assistantTied = messages.some((m) => m.role === "assistant" && m.run_id === runId);
	runComplete = runs.length === 1 && runs[0].status === "complete";
	if (!(bumped && assistantTied && runComplete)) await new Promise((r) => setTimeout(r, 500));
}
const roles = messages.map((m) => m.role);
check("Neon: user + assistant messages", roles.includes("user") && roles.includes("assistant"), `(${roles.join(",")})`);
check("Neon: assistant tied to runId", assistantTied, `(${JSON.stringify(messages.map((m) => ({ role: m.role, runId: m.run_id })))})`);
check("Neon: run complete", runComplete, `${JSON.stringify(runs)}`);
check("Neon: lastMessageAt bumped", bumped, `baseline=${baseline} now=${JSON.stringify(sessions[0]?.last_message_at ?? null)}`);

console.log(failures === 0 ? "\nMATERIALIZE E2E PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);