/**
 * Pure fold logic: session → external-store messages, and mock messages →
 * assistant-ui `ThreadMessageLike`.
 *
 * Kept free of React and of assistant-ui *value* imports so it is directly
 * unit-testable (see `lib/__tests__/chat-mock.test.ts`). Only type imports
 * from `@assistant-ui/react` are allowed here.
 */
import type {
	AppendMessage,
	MessageStatus,
	TextMessagePart,
	ThreadMessageLike,
	ToolCallMessagePart,
} from "@assistant-ui/react";
import type { MockMessage, MockSession } from "./types";

/**
 * One user message per `userMessageId`; a retried run (same
 * `userMessageId`, new `runId`) reuses the user bubble and appends a new
 * assistant bubble below (iss-017 retry semantics).
 */
export function deriveMessages(session: MockSession): MockMessage[] {
	const messages: MockMessage[] = [];
	let lastUserMessageId: string | undefined;

	for (const run of session.runs) {
		if (run.userMessageId !== lastUserMessageId) {
			messages.push({
				role: "user",
				id: run.userMessageId,
				text: run.prompt,
				at: run.startedAt,
			});
			lastUserMessageId = run.userMessageId;
		}
		messages.push({ role: "assistant", id: run.runId, run });
	}

	return messages;
}

/** Folds a run's events into assistant-ui parts (iss-017 single-bubble render). */
export function convertMessage(message: MockMessage): ThreadMessageLike {
	if (message.role === "user") {
		return {
			role: "user",
			id: message.id,
			content: [{ type: "text", text: message.text }],
			createdAt: new Date(message.at),
		};
	}

	const { run } = message;

	// Mutable local copies — the shipped part types are `readonly`.
	type MutableTextPart = { type: "text"; text: string };
	type MutableToolPart = {
		type: "tool-call";
		toolCallId?: string;
		toolName: string;
		args?: ToolCallMessagePart["args"];
		argsText?: string;
		result?: unknown;
		isError?: boolean;
	};
	const parts: Array<MutableTextPart | MutableToolPart> = [];
	const events = [...run.events].sort((a, b) => a.seq - b.seq);

	for (const event of events) {
		if (event.type === "content") {
			const last = parts.at(-1);
			if (last?.type === "text") {
				last.text += event.text;
			} else {
				parts.push({ type: "text", text: event.text });
			}
		} else if (event.type === "tool_call") {
			parts.push({
				type: "tool-call",
				toolCallId: event.toolCallId,
				toolName: event.toolName,
				args: event.args as unknown as ToolCallMessagePart["args"],
				argsText: event.argsText,
			});
		} else if (event.type === "tool_result") {
			const toolPart = parts.find(
				(part): part is MutableToolPart =>
					part.type === "tool-call" && part.toolCallId === event.toolCallId,
			);
			if (toolPart) {
				toolPart.result = event.result;
				if (event.isError) toolPart.isError = true;
			}
		}
	}

	let status: MessageStatus;
	if (run.status === "complete") {
		status = { type: "complete", reason: "stop" };
	} else if (run.status === "error") {
		status = {
			type: "incomplete",
			reason: "error",
			error: { message: run.errorMessage ?? "The run failed." },
		};
	} else {
		status = { type: "running" };
	}

	return {
		role: "assistant",
		id: run.runId,
		content: parts,
		status,
		createdAt: new Date(run.startedAt),
	};
}

/** Text content from an `AppendMessage` (string or text parts). */
export function extractText(content: AppendMessage["content"]): string {
	if (typeof content === "string") return content;
	return content
		.filter((part): part is TextMessagePart => part.type === "text")
		.map((part) => part.text)
		.join("\n");
}
