import { DurableObject } from "cloudflare:workers";
import { chat } from "@tanstack/ai";
import { createOpenRouterText } from "@tanstack/ai-openrouter";
import type { DataServiceEnv } from "../env";
import { getDatabaseUrl, getModel, getOpenRouterApiKey } from "../env";
import type { MaterializeRunResult } from "../materialize";
import { materializeRunResult } from "../materialize";
import {
	foldRunStream,
	type RouteRunEvent,
	type RunStreamChunk,
} from "../run-stream";
import { parseConversationMessage } from "./conversation-message";

/**
 * Conversation-scoped transcript + run executor.
 *
 * SQLite schema v2:
 *   messages — durable transcript (user + assistant rows)
 *   runs     — run lifecycle (running → complete | error)
 *   events   — streamed model events, sequential per run (live + replay)
 *
 * A run is accepted synchronously (202) and executed in the background via
 * `ctx.waitUntil`, streaming model events to SQLite + WebSocket subscribers,
 * then materializing the assistant message, run status, and conversation
 * timestamp into Neon.
 */

export type ConversationActor = {
	conversationId: string;
	userId: string;
};

export type ConversationMessage = {
	id: string;
	role: "user" | "assistant" | "tool";
	content: string;
	createdAt: number;
};

export type ConversationRun = {
	id: string;
	sessionId: string;
	userId: string;
	status: "running" | "complete" | "error";
	errorMessage: string | null;
	createdAt: number;
	updatedAt: number;
};

export type ConversationEvent = {
	runId: string;
	sessionId: string;
	userId: string | null;
	seq: number;
	type: RouteRunEvent["type"];
	payload: Record<string, unknown>;
	createdAt: number;
};

export type RunRequest = {
	messageId: string;
	runId: string;
	userId: string;
	content: string;
	projectId?: string | null;
};

export class RunConflictError extends Error {
	constructor() {
		super("A run is already in progress for this conversation");
		this.name = "RunConflictError";
	}
}

function parseRunRequest(body: unknown): RunRequest | null {
	if (!body || typeof body !== "object") return null;
	const value = body as Record<string, unknown>;
	const { messageId, runId, userId, content } = value;
	if (
		typeof messageId !== "string" ||
		messageId.length === 0 ||
		typeof runId !== "string" ||
		runId.length === 0 ||
		typeof userId !== "string" ||
		userId.length === 0 ||
		typeof content !== "string" ||
		content.length === 0
	) {
		return null;
	}
	if (content.length > 20000) return null;
	return {
		messageId,
		runId,
		userId,
		content,
		projectId: typeof value.projectId === "string" ? value.projectId : null,
	};
}

export class ConversationObject extends DurableObject<DataServiceEnv> {
	private readonly sockets = new Set<WebSocket>();

	constructor(ctx: DurableObjectState, env: DataServiceEnv) {
		super(ctx, env);
		ctx.blockConcurrencyWhile(async () => {
			this.ctx.storage.sql.exec(`
				CREATE TABLE IF NOT EXISTS messages (
					id TEXT PRIMARY KEY,
					role TEXT NOT NULL,
					content TEXT NOT NULL,
					created_at INTEGER NOT NULL
				);
				CREATE INDEX IF NOT EXISTS messages_created_at_idx
					ON messages(created_at);

				CREATE TABLE IF NOT EXISTS runs (
					id TEXT PRIMARY KEY,
					session_id TEXT NOT NULL,
					user_id TEXT NOT NULL,
					status TEXT NOT NULL,
					error_message TEXT,
					created_at INTEGER NOT NULL,
					updated_at INTEGER NOT NULL
				);
				CREATE INDEX IF NOT EXISTS runs_session_status_idx
					ON runs(session_id, status);

				CREATE TABLE IF NOT EXISTS events (
					run_id TEXT NOT NULL,
					session_id TEXT NOT NULL,
					user_id TEXT,
					seq INTEGER NOT NULL,
					type TEXT NOT NULL,
					payload TEXT NOT NULL,
					created_at INTEGER NOT NULL,
					PRIMARY KEY (run_id, seq)
				);
				CREATE INDEX IF NOT EXISTS events_session_seq_idx
					ON events(session_id, seq);
			`);
		});
	}

	// ------------------------------------------------------------------ data

	async appendMessage(message: ConversationMessage): Promise<void> {
		this.ctx.storage.sql.exec(
			"INSERT OR IGNORE INTO messages (id, role, content, created_at) VALUES (?, ?, ?, ?)",
			message.id,
			message.role,
			message.content,
			message.createdAt,
		);
		this.broadcast({ type: "message", message });
	}

	async listMessages(limit = 200): Promise<ConversationMessage[]> {
		return this.ctx.storage.sql
			.exec<{
				id: string;
				role: ConversationMessage["role"];
				content: string;
				created_at: number;
			}>(
				"SELECT id, role, content, created_at FROM messages ORDER BY created_at ASC LIMIT ?",
				limit,
			)
			.toArray()
			.map((row) => ({
				id: row.id,
				role: row.role,
				content: row.content,
				createdAt: row.created_at,
			}));
	}

	listEvents(afterSeq = 0): ConversationEvent[] {
		return this.ctx.storage.sql
			.exec<{
				run_id: string;
				session_id: string;
				user_id: string | null;
				seq: number;
				type: string;
				payload: string;
				created_at: number;
			}>(
				"SELECT run_id, session_id, user_id, seq, type, payload, created_at FROM events WHERE seq > ? ORDER BY seq ASC",
				afterSeq,
			)
			.toArray()
			.map((row) => ({
				runId: row.run_id,
				sessionId: row.session_id,
				userId: row.user_id,
				seq: row.seq,
				type: row.type as ConversationEvent["type"],
				payload: JSON.parse(row.payload) as Record<string, unknown>,
				createdAt: row.created_at,
			}));
	}

	getRun(runId: string): ConversationRun | null {
		const rows = this.ctx.storage.sql
			.exec<{
				id: string;
				session_id: string;
				user_id: string;
				status: string;
				error_message: string | null;
				created_at: number;
				updated_at: number;
			}>(
				"SELECT id, session_id, user_id, status, error_message, created_at, updated_at FROM runs WHERE id = ?",
				runId,
			)
			.toArray();
		const row = rows[0];
		if (!row) return null;
		return {
			id: row.id,
			sessionId: row.session_id,
			userId: row.user_id,
			status: row.status as ConversationRun["status"],
			errorMessage: row.error_message,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		};
	}

	/** First run's user owns the conversation; no runs yet → unowned. */
	private get owner(): string | null {
		const rows = this.ctx.storage.sql
			.exec<{ user_id: string }>(
				"SELECT user_id FROM runs ORDER BY created_at ASC LIMIT 1",
			)
			.toArray();
		return rows[0]?.user_id ?? null;
	}

	private authorize(actor: ConversationActor): boolean {
		const owner = this.owner;
		if (!owner) return true;
		return actor.userId === owner;
	}

	// ------------------------------------------------------------------ runs

	private async beginRun(
		run: RunRequest,
		conversationId: string,
	): Promise<void> {
		const active = this.ctx.storage.sql
			.exec<{ id: string }>(
				"SELECT id FROM runs WHERE status = 'running' LIMIT 1",
			)
			.toArray();
		if (active.length > 0) throw new RunConflictError();

		const now = Date.now();
		this.ctx.storage.sql.exec(
			"INSERT OR IGNORE INTO messages (id, role, content, created_at) VALUES (?, ?, ?, ?)",
			run.messageId,
			"user",
			run.content,
			now,
		);
		this.ctx.storage.sql.exec(
			"INSERT INTO runs (id, session_id, user_id, status, error_message, created_at, updated_at) VALUES (?, ?, ?, 'running', NULL, ?, ?)",
			run.runId,
			conversationId,
			run.userId,
			now,
			now,
		);
		this.broadcast({
			type: "message",
			message: {
				id: run.messageId,
				role: "user",
				content: run.content,
				createdAt: now,
			},
		});
		this.broadcast({
			type: "run",
			run: {
				id: run.runId,
				sessionId: conversationId,
				userId: run.userId,
				status: "running",
				errorMessage: null,
				createdAt: now,
				updatedAt: now,
			},
		});
		this.ctx.waitUntil(this.executeRun(run, conversationId));
	}

	private async executeRun(
		run: RunRequest,
		conversationId: string,
	): Promise<void> {
		let seq = 0;
		let text = "";
		const appendEvent = async (event: RouteRunEvent) => {
			seq += 1;
			const createdAt = Date.now();
			this.ctx.storage.sql.exec(
				"INSERT INTO events (run_id, session_id, user_id, seq, type, payload, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
				run.runId,
				conversationId,
				run.userId,
				seq,
				event.type,
				JSON.stringify(event.payload),
				createdAt,
			);
			this.broadcast({
				type: "event",
				event: {
					runId: run.runId,
					sessionId: conversationId,
					userId: run.userId,
					seq,
					type: event.type,
					payload: event.payload,
					createdAt,
				},
			});
		};
		// Materialization outcome. The run's live transcript lives in SQLite
		// inside the DO; this mirrors the terminal state into Neon as a
		// fire-and-forget side effect — it must never flip the run's status
		// (the authoritative status is broadcast before materialization runs).
		let outcome: MaterializeRunResult | undefined;

		try {
			const history = await this.listMessages();
			const stream = this.createModelStream(history, run.content);
			for await (const folded of foldRunStream(
				stream as AsyncIterable<RunStreamChunk>,
			)) {
				if (folded.type === "content") text += folded.payload.text;
				await appendEvent(folded);
			}

			const assistantMessageId = `${run.runId}:assistant`;
			if (text.length > 0) {
				const now = Date.now();
				this.ctx.storage.sql.exec(
					"INSERT OR IGNORE INTO messages (id, role, content, created_at) VALUES (?, ?, ?, ?)",
					assistantMessageId,
					"assistant",
					text,
					now,
				);
				this.broadcast({
					type: "message",
					message: {
						id: assistantMessageId,
						role: "assistant",
						content: text,
						createdAt: now,
					},
				});
			}

			const completedAt = Date.now();
			this.ctx.storage.sql.exec(
				"UPDATE runs SET status = 'complete', updated_at = ? WHERE id = ?",
				completedAt,
				run.runId,
			);
			const completed = this.getRun(run.runId);
			if (completed) this.broadcast({ type: "run", run: completed });

			outcome = {
				runId: run.runId,
				sessionId: conversationId,
				userId: run.userId,
				assistantMessageId,
				content: text.length > 0 ? text : undefined,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Clerk run failed";
			await appendEvent({ type: "error", payload: { message } });
			this.ctx.storage.sql.exec(
				"UPDATE runs SET status = 'error', error_message = ?, updated_at = ? WHERE id = ?",
				message,
				Date.now(),
				run.runId,
			);
			const failed = this.getRun(run.runId);
			if (failed) this.broadcast({ type: "run", run: failed });
			console.error("Conversation run failed", {
				runId: run.runId,
				error: message,
			});
			outcome = {
				runId: run.runId,
				sessionId: conversationId,
				userId: run.userId,
				assistantMessageId: `${run.runId}:assistant`,
				error: { message },
			};
		}

		if (outcome) {
			try {
				await materializeRunResult(getDatabaseUrl(this.env), outcome);
			} catch (error) {
				console.error("Neon materialize failed", {
					runId: run.runId,
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}
	}

	private createModelStream(
		history: ConversationMessage[],
		content: string,
	): AsyncIterable<unknown> {
		const model = getModel(this.env);
		const adapter = createOpenRouterText(
			model as Parameters<typeof createOpenRouterText>[0],
			getOpenRouterApiKey(this.env) ?? "",
		);
		const messages = history
			.filter((entry) => entry.role === "user" || entry.role === "assistant")
			.map((entry) => ({ role: entry.role, content: entry.content }));
		messages.push({ role: "user", content });
		return chat({ adapter, messages });
	}

	// ------------------------------------------------------------------ fetch

	async fetch(request: Request): Promise<Response> {
		if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
			return this.handleWebSocket(request);
		}

		const actor = parseActor(request);
		if (!actor) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}
		if (!this.authorize(actor)) {
			return Response.json({ message: "Forbidden" }, { status: 403 });
		}

		const url = new URL(request.url);
		const subpath = url.pathname.replace(/^\/conversations\/[^/]+/, "");

		try {
			if (
				request.method === "GET" &&
				(subpath === "" || subpath === "/messages")
			) {
				return Response.json({ messages: await this.listMessages() });
			}

			if (request.method === "GET" && subpath === "/events") {
				const raw = Number(url.searchParams.get("afterSeq") ?? "0");
				return Response.json({
					events: this.listEvents(Number.isFinite(raw) ? raw : 0),
				});
			}

			if (request.method === "POST" && subpath === "/run") {
				const body = (await request.json().catch(() => null)) as unknown;
				const run = parseRunRequest(body);
				if (!run) {
					return Response.json(
						{ message: "Invalid run request" },
						{ status: 400 },
					);
				}
				if (
					!this.authorize({
						conversationId: actor.conversationId,
						userId: run.userId,
					})
				) {
					return Response.json({ message: "Forbidden" }, { status: 403 });
				}
				try {
					await this.beginRun(run, actor.conversationId);
				} catch (error) {
					if (error instanceof RunConflictError) {
						return Response.json({ message: error.message }, { status: 409 });
					}
					throw error;
				}
				return Response.json(
					{ runId: run.runId, status: "accepted" },
					{ status: 202 },
				);
			}

			if (
				request.method === "POST" &&
				(subpath === "" || subpath === "/messages")
			) {
				const message = parseConversationMessage(await request.json());
				if (!message) {
					return Response.json(
						{ message: "Invalid conversation message" },
						{ status: 400 },
					);
				}
				await this.appendMessage(message);
				return new Response(null, { status: 204 });
			}

			return new Response("Method not allowed", {
				status: 405,
				headers: { Allow: "GET, POST" },
			});
		} catch (error) {
			console.error("Conversation object request failed", {
				error: error instanceof Error ? error.message : String(error),
			});
			return Response.json(
				{ message: "Conversation request failed" },
				{ status: 500 },
			);
		}
	}

	// ------------------------------------------------------------------ ws

	private handleWebSocket(_request: Request): Response {
		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);
		this.ctx.acceptWebSocket(server);
		server.serializeAttachment({ connectedAt: Date.now() });
		this.sockets.add(server);
		return new Response(null, { status: 101, webSocket: client });
	}

	webSocketMessage(_socket: WebSocket, _message: string | ArrayBuffer) {
		// Inbound WS writes are ignored; runs are started via POST /run.
	}

	webSocketClose(socket: WebSocket) {
		this.sockets.delete(socket);
	}

	private broadcast(
		event:
			| { type: "message"; message: ConversationMessage }
			| { type: "event"; event: ConversationEvent }
			| { type: "run"; run: ConversationRun },
	) {
		const payload = JSON.stringify(event);
		for (const socket of this.ctx.getWebSockets()) {
			try {
				socket.send(payload);
			} catch {
				this.sockets.delete(socket);
			}
		}
	}
}

function parseActor(request: Request): ConversationActor | null {
	const raw = request.headers.get("x-structa-actor");
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as Partial<ConversationActor>;
		if (
			typeof parsed.conversationId === "string" &&
			parsed.conversationId.length > 0 &&
			typeof parsed.userId === "string" &&
			parsed.userId.length > 0
		) {
			return { conversationId: parsed.conversationId, userId: parsed.userId };
		}
	} catch {
		// fall through
	}
	return null;
}
