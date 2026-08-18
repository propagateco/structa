import type {
	MessageStatus,
	ThreadMessageLike,
	ToolCallMessagePart,
} from "@assistant-ui/react";
import type { ChatMessage, ChatRun, ChatRunEvent } from "@/lib/collections";

export type ProductionMessage =
	| { kind: "user"; row: ChatMessage }
	| { kind: "assistant"; run: ChatRun; events: ChatRunEvent[] };

const text = (payload: Record<string, unknown>): string =>
	typeof payload.content === "string"
		? payload.content
		: typeof payload.text === "string"
			? payload.text
			: "";

export function foldProductionMessages(
	messages: ChatMessage[],
	runs: ChatRun[],
	events: ChatRunEvent[],
): ProductionMessage[] {
	const runEvents = new Map<string, ChatRunEvent[]>();
	for (const event of events) {
		const current = runEvents.get(event.runId) ?? [];
		current.push(event);
		runEvents.set(event.runId, current);
	}
	return [
		...messages.filter((message) => message.role === "user").map((row) => ({ kind: "user" as const, row })),
		...runs.map((run) => ({
			kind: "assistant" as const,
			run,
			events: (runEvents.get(run.id) ?? []).sort((a, b) => a.seq - b.seq),
		})),
	].sort((a, b) => {
		const aDate = a.kind === "user" ? a.row.createdAt : a.run.createdAt;
		const bDate = b.kind === "user" ? b.row.createdAt : b.run.createdAt;
		return aDate.getTime() - bDate.getTime();
	});
}

export function convertProductionMessage(
	message: ProductionMessage,
): ThreadMessageLike {
	if (message.kind === "user") {
		return {
			role: "user",
			id: message.row.id,
			content: [{ type: "text", text: message.row.content }],
			createdAt: message.row.createdAt,
		};
	}

	const parts: Array<
		| { type: "text"; text: string }
		| {
				type: "tool-call";
				toolCallId?: string;
				toolName: string;
				args?: ToolCallMessagePart["args"];
				result?: unknown;
				isError?: boolean;
			}
	> = [];
	for (const event of message.events) {
		if (event.type === "content") {
			const value = text(event.payload);
			const last = parts.at(-1);
			if (last?.type === "text") last.text += value;
			else if (value) parts.push({ type: "text", text: value });
		} else if (event.type === "tool_call") {
			parts.push({
				type: "tool-call",
				toolCallId: typeof event.payload.toolCallId === "string" ? event.payload.toolCallId : undefined,
				toolName: typeof event.payload.name === "string" ? event.payload.name : "Tool",
				args: event.payload.input as ToolCallMessagePart["args"],
			});
		} else if (event.type === "tool_result") {
			const id = event.payload.toolCallId;
			const call = parts.find((part) => part.type === "tool-call" && part.toolCallId === id);
			if (call?.type === "tool-call") {
				call.result = event.payload.output;
				if (typeof event.payload.error === "string") call.isError = true;
			}
		}
	}

	let status: MessageStatus = { type: "running" };
	if (message.run.status === "complete") status = { type: "complete", reason: "stop" };
	if (message.run.status === "error") {
		status = {
			type: "incomplete",
			reason: "error",
			error: { message: message.run.errorMessage ?? "The run failed." },
		};
	}
	return {
		role: "assistant",
		id: message.run.id,
		content: parts,
		status,
		createdAt: message.run.createdAt,
	};
}
