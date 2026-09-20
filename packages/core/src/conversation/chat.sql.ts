import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { conversation } from "./conversation.sql";

export const chatRunStatus = pgEnum("chat_run_status", [
	"running",
	"complete",
	"error",
]);

export const chatMessageRole = pgEnum("chat_message_role", [
	"user",
	"assistant",
]);

export const chatMessage = pgTable(
	"chat_messages",
	{
		id: text("id").primaryKey(),
		sessionId: text("session_id")
			.notNull()
			.references(() => conversation.id, { onDelete: "cascade" }),
		userId: text("user_id").notNull(),
		runId: text("run_id"),
		role: chatMessageRole("role").notNull(),
		content: text("content").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("chat_messages_session_created_idx").on(
			table.sessionId,
			table.createdAt,
		),
		index("chat_messages_user_idx").on(table.userId),
	],
);

export const chatRun = pgTable(
	"chat_runs",
	{
		id: text("id").primaryKey(),
		sessionId: text("session_id")
			.notNull()
			.references(() => conversation.id, { onDelete: "cascade" }),
		userId: text("user_id").notNull(),
		status: chatRunStatus("status").default("running").notNull(),
		errorCode: text("error_code"),
		errorMessage: text("error_message"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("chat_runs_session_status_idx").on(table.sessionId, table.status),
	],
);
