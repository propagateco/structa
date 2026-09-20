"use client";

import { useExternalStoreRuntime } from "@assistant-ui/react";
import { useLiveQuery } from "@tanstack/react-db";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useProjectSwitcher } from "@/hooks/use-project-switcher";
import { useUser } from "@/hooks/use-user";
import {
	chatMessagesCollection,
	chatRunsCollection,
	chatSessionsCollection,
} from "@/lib/collections";
import type { ChatMessage } from "@/lib/collections";
import { buildProductionAdapter, postChatRun } from "./adapter";
import { useConversationStream } from "./use-conversation-stream";

/** Merge Neon rows with live DO-stream rows, deduplicating by id. */
function mergeById<T extends { id: string }>(
	neon: readonly T[],
	live: readonly T[],
): T[] {
	const byId = new Map(neon.map((item) => [item.id, item]));
	for (const item of live) byId.set(item.id, item);
	return [...byId.values()];
}

export function useProductionChat(
	sessionId: string | null,
	onSessionChange: (sessionId: string) => void,
) {
	const { activeProject } = useProjectSwitcher();
	const { user } = useUser();
	const queryClient = useQueryClient();
	const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);

	const sessionsQuery = useLiveQuery((q) =>
		q.from({ session: chatSessionsCollection }),
	);
	const messagesQuery = useLiveQuery((q) =>
		q.from({ message: chatMessagesCollection }),
	);
	const runsQuery = useLiveQuery((q) => q.from({ run: chatRunsCollection }));

	const stream = useConversationStream(sessionId);
	const send = useCallback(
		async (input: Parameters<typeof postChatRun>[0]) => {
			await postChatRun(input);
			await queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
		},
		[queryClient],
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

	const neonMessages = useMemo(
		() =>
			sessionId
				? (messagesQuery.data ?? [])
						.filter((message) => message.sessionId === sessionId)
						.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
				: [],
		[messagesQuery.data, sessionId],
	);

	const neonRuns = useMemo(
		() =>
			sessionId
				? (runsQuery.data ?? []).filter((run) => run.sessionId === sessionId)
				: [],
		[runsQuery.data, sessionId],
	);

	// Merge live DO-stream rows with persisted Neon rows. The live state
	// covers in-progress assistant turns that the Neon query may not have
	// materialised yet; for completed runs, Neon is authoritative and will
	// be used by the merge when the same id appears in both.
	const messages = useMemo(
		() => mergeById(mergeById(optimisticMessages, neonMessages), stream.messages),
		[neonMessages, optimisticMessages, stream.messages],
	);
	const runs = useMemo(
		() => mergeById(neonRuns, stream.runs),
		[neonRuns, stream.runs],
	);

	const adapter = useMemo(
		() =>
			buildProductionAdapter(
				{
					sessionId,
					sessions,
					messages,
					runs,
					events: stream.events,
					userId: user?.id,
					onOptimisticMessage: (message) =>
						setOptimisticMessages((current) => mergeById(current, [message])),
					onSessionChange: (nextSessionId) => {
						if (nextSessionId) onSessionChange(nextSessionId);
					},
					projectId: activeProject?.id ?? null,
				},
				send,
			),
		[
			activeProject?.id,
			onSessionChange,
			sessionId,
			sessions,
			messages,
			user?.id,
			optimisticMessages,
			runs,
			stream.events,
			send,
		],
	);

	return {
		runtime: useExternalStoreRuntime(adapter),
		sessions,
		isLoading:
			sessionsQuery.isLoading || messagesQuery.isLoading || runsQuery.isLoading,
	};
}
