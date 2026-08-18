import { zValidator } from "@hono/zod-validator";
import { ChatModel, ConversationService } from "@structa/core/conversation";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	clerkRuntime,
	ClerkRunConflictError,
} from "../../chat/clerk-runtime";
import { authenticatedMiddleware } from "../middleware";

/**
 * Browser requests contain only the new turn. The runtime loads history from
 * the conversation store, keeping the authoritative transcript server-side.
 */
export const ChatRoute = new Hono()
	.use(authenticatedMiddleware)
	.post("/run", zValidator("json", ChatModel.RunInput), async (c) => {
		const input = c.req.valid("json");
		const conversation = await ConversationService.findForUser(
			c.var.user.id,
			input.conversationId,
		);
		if (!conversation) {
			throw new HTTPException(404, { message: "Conversation not found" });
		}

		try {
			await clerkRuntime.startRun({
				...input,
				projectId: conversation.projectId,
				userId: c.var.user.id,
			});
		} catch (error) {
			if (error instanceof ClerkRunConflictError) {
				throw new HTTPException(409, { message: error.message });
			}
			throw error;
		}

		return c.json({ runId: input.runId, status: "accepted" as const }, 202);
	});
