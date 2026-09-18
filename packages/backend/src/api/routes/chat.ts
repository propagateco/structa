import { zValidator } from "@hono/zod-validator";
import {
	ChatModel,
	ConversationService,
	chatMessage,
	chatRun,
} from "@structa/core/conversation";
import { conversation } from "@structa/core/conversation/conversation.sql";
import { db } from "@structa/core/drizzle";
import { and, asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createChatTitle } from "../../chat/chat-title";
import {
	ClerkRunConflictError,
	ClerkRuntimeUnavailableError,
	clerkRuntime,
} from "../../chat/clerk-runtime";
import {
	DataServiceUnavailableError,
	dataServiceClient,
} from "../../chat/data-service";
import { authenticatedMiddleware } from "../middleware";

/**
 * Browser requests contain only the new turn. The runtime loads history from
 * the conversation store, keeping the authoritative transcript server-side.
 */
export const ChatRoute = new Hono()
	.use(authenticatedMiddleware)
	.get("/messages", async (c) => {
		const conversationId = c.req.query("conversationId");
		const rows = await db
			.select()
			.from(chatMessage)
			.where(
				and(
					eq(chatMessage.userId, c.var.user.id),
					conversationId
						? eq(chatMessage.sessionId, conversationId)
						: undefined,
				),
			)
			.orderBy(asc(chatMessage.createdAt));
		return c.json(rows);
	})
	.get("/runs", async (c) => {
		const conversationId = c.req.query("conversationId");
		const rows = await db
			.select()
			.from(chatRun)
			.where(
				and(
					eq(chatRun.userId, c.var.user.id),
					conversationId ? eq(chatRun.sessionId, conversationId) : undefined,
				),
			)
			.orderBy(asc(chatRun.createdAt));
		return c.json(rows);
	})
	.post("/run", zValidator("json", ChatModel.RunInput), async (c) => {
		const input = c.req.valid("json");
		let conversation = await ConversationService.findForUser(
			c.var.user.id,
			input.conversationId,
		);
		if (!conversation) {
			conversation = await ConversationService.createForUserWithId(
				c.var.user.id,
				input.conversationId,
				{
					projectId: input.projectId ?? null,
					context: input.projectId ? "project" : "api",
					title: "New Chat",
				},
			);
		}
		if (conversation.title === "New Chat") {
			conversation =
				(await ConversationService.renameForUser(
					c.var.user.id,
					conversation.id,
					{ title: createChatTitle(input.content) },
				)) ?? conversation;
		}

		try {
			try {
				// DataService path: persist the user turn + running run in Neon
				// (Query Collections source), then relay to the Durable Object
				// which executes the model, streams events, and materializes the
				// assistant message + run completion.
				await persistRunStart(input, conversation.projectId, c.var.user.id);
				await dataServiceClient.startRun({
					...input,
					projectId: conversation.projectId,
					userId: c.var.user.id,
				});
			} catch (error) {
				if (error instanceof DataServiceUnavailableError) {
					// Local dev / stage without the DataService secret: fall back
					// to the in-Lambda clerk runtime, which persists + executes
					// (and owns its own conflict check + history read).
					await clerkRuntime.startRun({
						...input,
						projectId: conversation.projectId,
						userId: c.var.user.id,
					});
					return;
				}
				throw error;
			}
		} catch (error) {
			if (error instanceof ClerkRunConflictError) {
				throw new HTTPException(409, { message: error.message });
			}
			if (error instanceof ClerkRuntimeUnavailableError) {
				throw new HTTPException(503, { message: error.message });
			}
			throw error;
		}

		return c.json({ runId: input.runId, status: "accepted" as const }, 202);
	});

/**
 * Persist the user turn + running run so Neon Query Collections reflect the
 * message immediately; the Durable Object materializes the assistant reply on
 * completion. Reuses the same row ids as the Durable Object's own SQLite
 * transcript, keeping the two stores consistent.
 */
async function persistRunStart(
	input: ChatModel.RunInputType,
	projectId: string | null,
	userId: string,
) {
	const now = new Date();
	await db.insert(chatMessage).values({
		id: input.messageId,
		sessionId: input.conversationId,
		userId,
		runId: input.runId,
		role: "user",
		content: input.content,
		createdAt: now,
	});
	await db.insert(chatRun).values({
		id: input.runId,
		sessionId: input.conversationId,
		userId,
		status: "running",
		createdAt: now,
		updatedAt: now,
	});
	await db
		.update(conversation)
		.set({ lastMessageAt: now, updatedAt: now })
		.where(eq(conversation.id, input.conversationId));
	// projectId is intentionally unused for now — reserved for the DO context
	// assembly step (STR-005).
	void projectId;
}
