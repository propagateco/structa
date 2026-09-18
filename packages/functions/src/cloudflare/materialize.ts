import { neon } from "@neondatabase/serverless";
import { chatMessage, chatRun } from "@structa/core/conversation/chat.sql";
import { conversation } from "@structa/core/conversation/conversation.sql";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

/**
 * Materialize the outcome of a Durable Object run into Neon (the global
 * business authority). The Durable Object holds the live SQLite transcript;
 * this writes the durable assistant message, final run status, and bumps the
 * conversation timestamp so web Query Collections stay correct.
 *
 * Uses the database URL from the worker env via `getDatabaseUrl` (the SST
 * `Database` link secret binding) — NOT `@structa/core/drizzle`, which imports
 * `sst` Resource at module load and cannot run in the worker.
 */

export type MaterializeRunResult = {
	runId: string;
	sessionId: string;
	userId: string;
	assistantMessageId: string;
	/** Final assistant text; omitted when the run errored with no output. */
	content?: string;
	error?: { message: string; code?: string };
};

export async function materializeRunResult(
	databaseUrl: string | undefined,
	result: MaterializeRunResult,
): Promise<void> {
	if (!databaseUrl) {
		// No Neon configured (local/feature stage) — the Durable Object SQLite
		// transcript remains the source of truth for the session.
		return;
	}
	const db = drizzle(neon(databaseUrl));
	const now = new Date();

	// The backend creates the `chat_sessions` (+ `chat_runs`) rows before it
	// relays a run. If the session is missing here (e.g. a direct Worker
	// request, or a stale conversation), inserting would violate the
	// `chat_messages.session_id → chat_sessions.id` foreign key — so skip the
	// write entirely rather than fail (and possibly flip) the run.
	const existing = await db
		.select({ id: conversation.id })
		.from(conversation)
		.where(eq(conversation.id, result.sessionId))
		.limit(1);
	if (existing.length === 0) {
		console.warn("Materialize skipped: chat_sessions row missing", {
			sessionId: result.sessionId,
			runId: result.runId,
		});
		return;
	}

	if (result.error) {
		await db
			.update(chatRun)
			.set({
				status: "error",
				errorMessage: result.error.message,
				errorCode: result.error.code ?? null,
				updatedAt: now,
			})
			.where(eq(chatRun.id, result.runId));
	} else {
		if (result.content && result.content.length > 0) {
			await db.insert(chatMessage).values({
				id: result.assistantMessageId,
				sessionId: result.sessionId,
				userId: result.userId,
				runId: result.runId,
				role: "assistant",
				content: result.content,
				createdAt: now,
			});
		}
		await db
			.update(chatRun)
			.set({ status: "complete", updatedAt: now })
			.where(eq(chatRun.id, result.runId));
	}

	await db
		.update(conversation)
		.set({ lastMessageAt: now, updatedAt: now })
		.where(eq(conversation.id, result.sessionId));
}
