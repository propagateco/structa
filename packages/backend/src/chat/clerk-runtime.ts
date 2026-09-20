import {
	type ChatModel,
	chatMessage,
	chatRun,
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
	constructor(message?: string) {
		super(message ?? "This conversation already has an active run");
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

		let responseText = "";

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
				}
			}

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
			const message =
				error instanceof Error ? error.message : "Clerk run failed";
			await db
				.update(chatRun)
				.set({ status: "error", errorMessage: message, updatedAt: new Date() })
				.where(eq(chatRun.id, input.runId));
			throw error;
		}
	},
};
