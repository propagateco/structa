export * as ConversationModel from "./conversation.model";

import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { conversation } from "./conversation.sql";

export const Schema = createSelectSchema(conversation);
export const CreateInput = z.object({
	projectId: z.string().nullable().optional(),
	context: z.enum(["project", "editor", "mcp", "api"]).default("project"),
	documentId: z.string().nullable().optional(),
	title: z.string().trim().min(1).max(200).default("New Chat"),
});
export const RenameInput = z.object({
	title: z.string().trim().min(1).max(200),
});
export const ListInput = z.object({
	cursor: z.string().optional(),
	projectId: z.string().min(1).optional(),
	limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ConversationType = z.infer<typeof Schema>;
export type CreateInputType = z.infer<typeof CreateInput>;
export type RenameInputType = z.infer<typeof RenameInput>;
export type ListInputType = z.infer<typeof ListInput>;
