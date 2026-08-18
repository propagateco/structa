import { describe, expect, it, vi } from "vitest";
import { buildProductionAdapter } from "../chat-production/adapter";
import { convertProductionMessage, foldProductionMessages } from "../chat-production/fold";
import type { ChatMessage, ChatRun, ChatRunEvent } from "../collections";

const date = new Date("2026-08-18T10:00:00.000Z");
const message: ChatMessage = {
	id: "message-1",
	sessionId: "session-1",
	userId: "user-1",
	runId: null,
	role: "user",
	content: "Can I remove this wall?",
	createdAt: date,
};
const run: ChatRun = {
	id: "run-1",
	sessionId: "session-1",
	userId: "user-1",
	status: "complete",
	errorCode: null,
	errorMessage: null,
	createdAt: new Date(date.getTime() + 1),
	updatedAt: date,
};
const event = (type: ChatRunEvent["type"], seq: number, payload: Record<string, unknown>): ChatRunEvent => ({
	runId: run.id,
	sessionId: run.sessionId,
	seq,
	type,
	payload,
	createdAt: date,
});

describe("production chat fold", () => {
	it("reconstructs a user turn and assistant content/tool parts", () => {
		const folded = foldProductionMessages(
			[message],
			[run],
			[
				event("content", 1, { content: "The wall may be structural. " }),
				event("tool_call", 2, { toolCallId: "tool-1", name: "inspect_plan", input: { wall: "A" } }),
				event("tool_result", 3, { toolCallId: "tool-1", output: "Found a beam." }),
			],
		);
		const assistant = convertProductionMessage(folded[1]);
		expect(folded).toHaveLength(2);
		expect(assistant.content).toEqual([
			{ type: "text", text: "The wall may be structural. " },
			{
				type: "tool-call",
				toolCallId: "tool-1",
				toolName: "inspect_plan",
				args: { wall: "A" },
				result: "Found a beam.",
			},
		]);
		expect(assistant.status).toEqual({ type: "complete", reason: "stop" });
	});
});

describe("production chat adapter", () => {
	it("fails clearly without a selected conversation", async () => {
		const adapter = buildProductionAdapter(
			{ sessionId: null, sessions: [], messages: [], runs: [], events: [], onSessionChange: vi.fn() },
			vi.fn(),
		);
		await expect(adapter.onNew({ content: "hello" } as never)).rejects.toThrow(
			"no conversation is selected",
		);
	});
});
