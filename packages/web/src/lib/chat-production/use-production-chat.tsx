"use client";

import { useExternalStoreRuntime } from "@assistant-ui/react";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import {
	chatMessagesCollection,
	chatRunsCollection,
	chatSessionsCollection,
	createChatRunEventsCollection,
} from "@/lib/collections";
import { buildProductionAdapter, postChatRun } from "./adapter";

export function useProductionChat(sessionId: string | null) {
	const sessionsQuery = useLiveQuery((q) =>
		q.from({ session: chatSessionsCollection }).orderBy(
			({ session }) => session.updatedAt,
			"desc",
		),
	);
	const messagesQuery = useLiveQuery((q) =>
		sessionId
			? q
					.from({ message: chatMessagesCollection })
					.where(({ message }) => eq(message.sessionId, sessionId))
					.orderBy(({ message }) => message.createdAt, "asc")
			: null,
		[sessionId],
	);
	const runsQuery = useLiveQuery((q) =>
		sessionId
			? q
					.from({ run: chatRunsCollection })
					.where(({ run }) => eq(run.sessionId, sessionId))
					.orderBy(({ run }) => run.createdAt, "asc")
			: null,
		[sessionId],
	);
	const eventsCollection = useMemo(
		() => (sessionId ? createChatRunEventsCollection(sessionId) : null),
		[sessionId],
	);
	const eventsQuery = useLiveQuery(
		(q) => (eventsCollection ? q.from({ event: eventsCollection }) : null),
		[eventsCollection],
	);

	const sessions = sessionsQuery.data ?? [];
	const messages = messagesQuery.data ?? [];
	const runs = runsQuery.data ?? [];
	const events = eventsQuery.data ?? [];
	const adapter = useMemo(
		() =>
			buildProductionAdapter(
				{
					sessionId,
					sessions,
					messages,
					runs,
					events,
					onSessionChange: () => undefined,
				},
				postChatRun,
			),
		[sessionId, sessions, messages, runs, events],
	);

	return {
		runtime: useExternalStoreRuntime(adapter),
		sessions,
		isLoading:
			sessionsQuery.isLoading ||
			messagesQuery.isLoading ||
			runsQuery.isLoading ||
			eventsQuery.isLoading,
	};
}
