import { zValidator } from "@hono/zod-validator";
import {
	ConversationModel,
	ConversationService,
} from "@structa/core/conversation";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { authenticatedMiddleware } from "../middleware";

const conversationId = z.object({ id: z.string().min(1) });

export const ConversationsRoute = new Hono()
	.use(authenticatedMiddleware)
	.get("/", zValidator("query", ConversationModel.ListInput), async (c) => {
		const result = await ConversationService.listForUser(
			c.var.user.id,
			c.req.valid("query"),
		);
		return c.json(result);
	})
	.post("/", zValidator("json", ConversationModel.CreateInput), async (c) => {
		const conversation = await ConversationService.createForUser(
			c.var.user.id,
			c.req.valid("json"),
		);
		return c.json(conversation, 201);
	})
	.get("/:id", zValidator("param", conversationId), async (c) => {
		const found = await ConversationService.findForUser(
			c.var.user.id,
			c.req.valid("param").id,
		);
		if (!found)
			throw new HTTPException(404, { message: "Conversation not found" });
		return c.json(found);
	})
	.patch(
		"/:id",
		zValidator("param", conversationId),
		zValidator("json", ConversationModel.RenameInput),
		async (c) => {
			const updated = await ConversationService.renameForUser(
				c.var.user.id,
				c.req.valid("param").id,
				c.req.valid("json"),
			);
			if (!updated)
				throw new HTTPException(404, { message: "Conversation not found" });
			return c.json(updated);
		},
	)
	.delete("/:id", zValidator("param", conversationId), async (c) => {
		const deleted = await ConversationService.deleteForUser(
			c.var.user.id,
			c.req.valid("param").id,
		);
		if (!deleted)
			throw new HTTPException(404, { message: "Conversation not found" });
		return c.body(null, 204);
	});
