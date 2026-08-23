"use client";

import { useExternalStoreRuntime } from "@assistant-ui/react";
import { useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import { useProjectSwitcher } from "@/hooks/use-project-switcher";
import {
	chatMessagesCollection,
	chatRunsCollection,
	chatSessionsCollection,
	createChatRunEventsCollection,
} from "@/lib/collections";
import { buildProductionAdapter, postChatRun } from "./adapter";

export function useProductionChat(
	sessionId: string | null,
	onSessionChange: (sessionId: string) => void,
) {
	const { activeProject } = useProjectSwitcher();
	const sessionsQuery = useLiveQuery((q) =>
		q.from({ session: chatSessionsCollection }),
	);
	// Global collections: all user's messages, runs, and sessions sync once
	// and stay in memory. Switching conversations is instant because the
	// data is already loaded — no new Electric shape subscriptions needed.
	const messagesQuery = useLiveQuery((q) =>
		q.from({ message: chatMessagesCollection }),
	);
	const runsQuery = useLiveQuery((q) => q.from({ run: chatRunsCollection }));
	// Events remain session-scoped: they're only needed for the active
	// conversation's in-progress runs. Completed runs have persisted
	// assistant message rows that the fold uses as a fallback.
	const eventsCollection = useMemo(
		() => (sessionId ? createChatRunEventsCollection(sessionId) : null),
		[sessionId],
	);
	const eventsQuery = useLiveQuery(
		(q) => (eventsCollection ? q.from({ event: eventsCollection }) : null),
		[eventsCollection],
	);

	const sessions = useMemo(
		() =>
			(sessionsQuery.data ?? [])
				.filter(
					(session) => !activeProject || session.projectId === activeProject.id,
				)
				.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
		[activeProject, sessionsQuery.data],
	);
	const messages = useMemo(
		() =>
			sessionId
				? (messagesQuery.data ?? [])
						.filter((message) => message.sessionId === sessionId)
						.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
				: [],
		[messagesQuery.data, sessionId],
	);
	const runs = useMemo(
		() =>
			sessionId
				? (runsQuery.data ?? []).filter((run) => run.sessionId === sessionId)
				: [],
		[runsQuery.data, sessionId],
	);
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
					onSessionChange: (nextSessionId) => {
						if (nextSessionId) onSessionChange(nextSessionId);
					},
					projectId: activeProject?.id ?? null,
				},
				postChatRun,
			),
		[
			activeProject?.id,
			onSessionChange,
			sessionId,
			sessions,
			messages,
			runs,
			events,
		],
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
