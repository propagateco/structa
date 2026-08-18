import type { AppendMessage, ExternalStoreAdapter, ThreadSuggestion } from "@assistant-ui/react";
import type { ChatMessage, ChatRun, ChatRunEvent } from "@/lib/collections";
import { convertProductionMessage, foldProductionMessages, type ProductionMessage } from "./fold";

export type ProductionAdapterInput = {
	sessionId: string | null;
	sessions: readonly { id: string; title: string }[];
	messages: ChatMessage[];
	runs: ChatRun[];
	events: ChatRunEvent[];
	onSessionChange: (sessionId: string | null) => void;
};

export type SendChatRun = (input: {
	sessionId: string;
	messageId: string;
	runId: string;
	content: string;
}) => Promise<void>;

export async function postChatRun(input: {
	sessionId: string;
	messageId: string;
	runId: string;
	content: string;
}): Promise<void> {
	const response = await fetch("/api/chat/run", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			conversationId: input.sessionId,
			messageId: input.messageId,
			runId: input.runId,
			content: input.content,
		}),
	});
	if (response.ok) return;
	let detail = `HTTP ${response.status}`;
	try {
		const body = (await response.json()) as { message?: unknown };
		if (typeof body.message === "string") detail = body.message;
	} catch {
		// Preserve the useful HTTP status when an unavailable API returned no JSON.
	}
	throw new Error(`Chat run unavailable: ${detail}`);
}

const extractText = (content: AppendMessage["content"]): string =>
	typeof content === "string"
		? content
		: content
				.filter((part) => part.type === "text")
				.map((part) => part.text)
				.join("\n");

export function buildProductionAdapter(
	input: ProductionAdapterInput,
	send: SendChatRun,
): ExternalStoreAdapter<ProductionMessage> {
	const messages = foldProductionMessages(input.messages, input.runs, input.events);
	const running = input.runs.some((run) => run.status === "running");
	const post = async (content: string, parentId?: string) => {
		if (!input.sessionId) throw new Error("Cannot send chat: no conversation is selected.");
		if (!content.trim()) return;
		const messageId = parentId ?? crypto.randomUUID();
		await send({
			sessionId: input.sessionId,
			messageId,
			runId: crypto.randomUUID(),
			content,
		});
	};

	return {
		messages,
		convertMessage: (message) => convertProductionMessage(message),
		isRunning: running,
		isSendDisabled: running,
		onNew: async (message) => post(extractText(message.content)),
		onReload: async (parentId) => {
			const original = input.messages.find((message) => message.id === parentId);
			if (!original) throw new Error(`Cannot retry chat: message '${parentId}' was not found.`);
			await post(original.content, original.id);
		},
		onRefetchThread: async () => undefined,
		adapters: {
			threadList: {
				threadId: input.sessionId ?? undefined,
				isLoading: false,
				threads: input.sessions.map((session) => ({ ...session, status: "regular" as const })),
				onSwitchToThread: (id) => input.onSessionChange(id),
				onSwitchToNewThread: () => input.onSessionChange(null),
			},
		},
		suggestions: [] as ThreadSuggestion[],
	};
}
