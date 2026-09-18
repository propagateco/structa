export * as ChatModel from "./chat.model";

import { z } from "zod";

export const RunInput = z
	.object({
		conversationId: z.string().min(1),
		projectId: z.string().min(1).nullable().optional(),
		messageId: z.string().min(1),
		runId: z.string().min(1),
		content: z.string().trim().min(1).max(20_000),
	})
	.strict();

export const RunAcknowledgement = z.object({
	runId: z.string().min(1),
	status: z.literal("accepted"),
});

export type RunInputType = z.infer<typeof RunInput>;
export type RunAcknowledgementType = z.infer<typeof RunAcknowledgement>;

export type ClerkEvent =
	| { type: "content"; content: string }
	| { type: "tool_call"; toolCallId: string; name: string; input: unknown }
	| { type: "tool_result"; toolCallId: string; output: unknown; error?: string }
	| { type: "done" }
	| { type: "error"; message: string };
