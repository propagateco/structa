import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "../auth/auth.sql";

export const aiChatContext = pgEnum("ai_chat_context", [
	"project",
	"editor",
	"mcp",
	"api",
]);

export const conversation = pgTable(
	"chat_sessions",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		projectId: text("project_id"),
		context: aiChatContext("context").default("project").notNull(),
		documentId: text("document_id"),
		title: text("title").default("New Chat").notNull(),
		messageCount: integer("message_count").default(0).notNull(),
		lastMessageAt: timestamp("last_message_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index("conversation_user_updated_idx").on(table.userId, table.updatedAt),
		index("conversation_user_project_updated_idx").on(
			table.userId,
			table.projectId,
			table.updatedAt,
		),
	],
);
