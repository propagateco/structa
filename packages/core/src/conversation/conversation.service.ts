export * as ConversationService from "./conversation.service";

import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, lt, or, sql } from "drizzle-orm";
import { db } from "../drizzle";
import type {
	CreateInputType,
	ListInputType,
	RenameInputType,
} from "./conversation.model";
import { conversation } from "./conversation.sql";

type Cursor = { activityAt: string; id: string };

const encodeCursor = (cursor: Cursor) =>
	Buffer.from(JSON.stringify(cursor)).toString("base64url");

const decodeCursor = (value: string): Cursor => {
	const cursor = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
	if (
		typeof cursor !== "object" ||
		!cursor ||
		typeof cursor.activityAt !== "string" ||
		typeof cursor.id !== "string"
	) {
		throw new Error("Invalid conversation cursor");
	}
	return cursor;
};

export async function listForUser(userId: string, input: ListInputType) {
	const decodedCursor = input.cursor ? decodeCursor(input.cursor) : undefined;
	const cursorDate = decodedCursor
		? new Date(decodedCursor.activityAt)
		: undefined;
	const activityAt = sql<Date>`coalesce(${conversation.lastMessageAt}, ${conversation.createdAt})`;
	const rows = await db
		.select()
		.from(conversation)
		.where(
			and(
				eq(conversation.userId, userId),
				input.projectId
					? eq(conversation.projectId, input.projectId)
					: undefined,
				cursorDate
					? or(
							lt(activityAt, cursorDate),
							and(
								eq(activityAt, cursorDate),
								lt(conversation.id, decodedCursor?.id ?? ""),
							),
						)
					: undefined,
			),
		)
		.orderBy(desc(activityAt), desc(conversation.id))
		.limit(input.limit + 1);

	const hasMore = rows.length > input.limit;
	const items = rows.slice(0, input.limit);
	const last = items[items.length - 1];
	return {
		items,
		 nextCursor:
			hasMore && last
				? encodeCursor({
						activityAt: (last.lastMessageAt ?? last.createdAt).toISOString(),
						id: last.id,
					})
				: null,
	};
}

export async function createForUser(userId: string, input: CreateInputType) {
	const [created] = await db
		.insert(conversation)
		.values({ ...input, id: createId(), userId })
		.returning();
	return created;
}

export async function findForUser(userId: string, id: string) {
	const [found] = await db
		.select()
		.from(conversation)
		.where(and(eq(conversation.id, id), eq(conversation.userId, userId)));
	return found ?? null;
}

export async function renameForUser(
	userId: string,
	id: string,
	input: RenameInputType,
) {
	const [updated] = await db
		.update(conversation)
		.set({ title: input.title, updatedAt: new Date() })
		.where(and(eq(conversation.id, id), eq(conversation.userId, userId)))
		.returning();
	return updated ?? null;
}

export async function deleteForUser(userId: string, id: string) {
	const [deleted] = await db
		.delete(conversation)
		.where(and(eq(conversation.id, id), eq(conversation.userId, userId)))
		.returning({ id: conversation.id });
	return deleted ?? null;
}
