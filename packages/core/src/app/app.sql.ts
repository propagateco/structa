import { foreignKey, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/auth.sql";

export const app = pgTable("app", {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    // Published fields
    publishedName: text("published_name"),
    publishedDescription: text("published_description"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    deletedAt: timestamp("deleted_at"),
});

export const appToUser = foreignKey({
    columns: [app.userId],
    foreignColumns: [user.id],
});

export const appToWorkspace = foreignKey({
    columns: [app.id],
    foreignColumns: [user.workspaceId],
});
