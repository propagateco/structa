import {
	type ChatModel,
	chatMessage,
	chatRun,
	chatRunEvent,
} from "@structa/core/conversation";
import { db } from "@structa/core/drizzle";
import { chat } from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";
import { and, asc, eq } from "drizzle-orm";

export type ClerkRunInput = ChatModel.RunInputType & {
	userId: string;
	projectId: string | null;
};

export interface ClerkRuntime {
	startRun(input: ClerkRunInput): Promise<void>;
}

export class ClerkRunConflictError extends Error {
	constructor() {
		super("This conversation already has an active run");
		this.name = "ClerkRunConflictError";
	}
}

export class ClerkRuntimeUnavailableError extends Error {
	constructor() {
		super("Clerk runtime is not configured for this environment");
		this.name = "ClerkRuntimeUnavailableError";
	}
}

export const clerkRuntime: ClerkRuntime = {
	async startRun(input) {
		if (!process.env.OPENROUTER_API_KEY) {
			throw new ClerkRuntimeUnavailableError();
		}

		const [activeRun] = await db
			.select({ id: chatRun.id })
			.from(chatRun)
			.where(
				and(
					eq(chatRun.sessionId, input.conversationId),
					eq(chatRun.userId, input.userId),
					eq(chatRun.status, "running"),
				),
			)
			.limit(1);
		if (activeRun) throw new ClerkRunConflictError();

		const history = await db
			.select({ role: chatMessage.role, content: chatMessage.content })
			.from(chatMessage)
			.where(
				and(
					eq(chatMessage.sessionId, input.conversationId),
					eq(chatMessage.userId, input.userId),
				),
			)
			.orderBy(asc(chatMessage.createdAt));

		await db.insert(chatMessage).values({
			id: input.messageId,
			sessionId: input.conversationId,
			userId: input.userId,
			runId: input.runId,
			role: "user",
			content: input.content,
		});
		await db.insert(chatRun).values({
			id: input.runId,
			sessionId: input.conversationId,
			userId: input.userId,
			status: "running",
		});

		let sequence = 0;
		let responseText = "";
		const appendEvent = async (
			type: string,
			payload: Record<string, unknown>,
		) => {
			sequence += 1;
			await db.insert(chatRunEvent).values({
				runId: input.runId,
				sessionId: input.conversationId,
				userId: input.userId,
				seq: sequence,
				type,
				payload,
			});
		};

		// Batch content tokens to reduce DB writes and Electric sync overhead.
		// Electric's long-polling has multi-second replication latency; writing
		// one event per token would flood the WAL and starve the client of
		// updates. Accumulating for 500ms gives the user visible progress
		// while keeping the write count manageable.
		let batchBuffer = "";
		let batchTimer: ReturnType<typeof setTimeout> | null = null;
		const flushBatch = async () => {
			if (batchTimer) {
				clearTimeout(batchTimer);
				batchTimer = null;
			}
			if (batchBuffer) {
				const chunk = batchBuffer;
				batchBuffer = "";
				await appendEvent("content", { text: chunk });
			}
		};
		const scheduleFlush = () => {
			if (!batchTimer) batchTimer = setTimeout(() => void flushBatch(), 500);
		};

		try {
			const stream = chat({
				adapter: openRouterText(
					(process.env.OPENROUTER_MODEL ??
						"deepseek/deepseek-v4-flash-0731") as Parameters<
						typeof openRouterText
					>[0],
				),
				messages: [
					...history.map((message) => ({
						role: message.role,
						content: message.content,
					})),
					{ role: "user" as const, content: input.content },
				],
			});

			for await (const chunk of stream) {
				if (chunk.type === "TEXT_MESSAGE_CONTENT") {
					responseText += chunk.delta;
					batchBuffer += chunk.delta;
					scheduleFlush();
				} else if (
					chunk.type === "TOOL_CALL_START" ||
					chunk.type === "TOOL_CALL_END"
				) {
					await flushBatch();
					await appendEvent(
						"tool_call",
						chunk as unknown as Record<string, unknown>,
					);
				} else if (chunk.type === "TOOL_CALL_RESULT") {
					await flushBatch();
					await appendEvent(
						"tool_result",
						chunk as unknown as Record<string, unknown>,
					);
				}
			}

			await flushBatch();
			await appendEvent("done", {});
			if (responseText) {
				await db.insert(chatMessage).values({
					id: `${input.runId}:assistant`,
					sessionId: input.conversationId,
					userId: input.userId,
					runId: input.runId,
					role: "assistant",
					content: responseText,
				});
			}
			await db
				.update(chatRun)
				.set({ status: "complete", updatedAt: new Date() })
				.where(eq(chatRun.id, input.runId));
		} catch (error) {
			await flushBatch();
			const message =
				error instanceof Error ? error.message : "Clerk run failed";
			await appendEvent("error", { message });
			await db
				.update(chatRun)
				.set({ status: "error", errorMessage: message, updatedAt: new Date() })
				.where(eq(chatRun.id, input.runId));
			throw error;
		}
	},
};
