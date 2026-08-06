/**
 * Builds the `ExternalStoreRuntime` adapter for the mock chat: the runtime
 * owns rendering, we own the state (per the locked iss-017 decision).
 *
 * Thread-list contract (verified against @assistant-ui/core): `onSwitchToThread`
 * / `onSwitchToNewThread` only notify us — we must return an adapter whose
 * `threadId` points at the new session so the runtime's `__internal_setAdapter`
 * recreates the main thread.
 */

import {
	CompositeAttachmentAdapter,
	type ExternalStoreAdapter,
	SimpleImageAttachmentAdapter,
	SimpleTextAttachmentAdapter,
	type ThreadSuggestion,
} from "@assistant-ui/react";
import type { MockEngine } from "./engine";
import { convertMessage, deriveMessages, extractText } from "./fold";
import type { MockMessage, MockState } from "./types";

export const SUGGESTIONS: ThreadSuggestion[] = [
	{ prompt: "Measure the kitchen for new countertops" },
	{ prompt: "Is the kitchen wall load-bearing?" },
	{ prompt: "Compare the two renovation quotes" },
	{ prompt: "What patio material fits a $3.5k budget?" },
];

const attachmentAdapter = new CompositeAttachmentAdapter([
	new SimpleImageAttachmentAdapter(),
	new SimpleTextAttachmentAdapter(),
]);

export function buildAdapter(
	state: MockState,
	engine: MockEngine,
): ExternalStoreAdapter<MockMessage> {
	const activeSession =
		state.sessions.find((session) => session.id === state.activeSessionId) ??
		null;
	const messages = activeSession ? deriveMessages(activeSession) : [];
	const activeRun = activeSession?.runs.at(-1);
	const isRunning = activeRun?.status === "running";

	return {
		messages,
		isRunning,
		// Q7: no stop button — block sending while a run is in-flight.
		isSendDisabled: isRunning,

		convertMessage,

		onNew: async (message) => {
			const text = extractText(message.content);
			if (text) engine.sendMessage(text);
		},

		// Q6: retry appends a new run; the failed bubble stays (never removed).
		onReload: async (parentId) => {
			engine.retryRun(parentId);
		},

		// Q3: returning to a session reconstructs it from state (no-op here —
		// the mock store never loses state).
		onRefetchThread: async () => {
			engine.refresh();
		},

		suggestions: SUGGESTIONS,

		adapters: {
			attachments: attachmentAdapter,
			threadList: {
				threadId: state.activeSessionId,
				isLoading: false,
				threads: state.sessions
					.filter((session) => !session.archived)
					.map((session) => ({
						id: session.id,
						status: "regular" as const,
						title: session.title,
					})),
				archivedThreads: state.sessions
					.filter((session) => session.archived)
					.map((session) => ({
						id: session.id,
						status: "archived" as const,
						title: session.title,
					})),
				onSwitchToThread: (threadId) => engine.switchSession(threadId),
				onSwitchToNewThread: () => {
					engine.createSession();
				},
				onRename: (threadId, newTitle) =>
					engine.renameSession(threadId, newTitle),
				onArchive: (threadId) => engine.archiveSession(threadId),
				onDelete: (threadId) => engine.deleteSession(threadId),
			},
		},
	};
}
