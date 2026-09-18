CREATE TYPE "public"."ai_chat_context" AS ENUM('project', 'editor', 'mcp', 'api');--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"project_id" text,
	"context" "ai_chat_context" DEFAULT 'project' NOT NULL,
	"document_id" text,
	"title" text DEFAULT 'New Chat' NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "chat_sessions_user_updated_idx" ON "chat_sessions" USING btree ("user_id", "updated_at");
--> statement-breakpoint
CREATE INDEX "chat_sessions_user_project_updated_idx" ON "chat_sessions" USING btree ("user_id", "project_id", "updated_at");
