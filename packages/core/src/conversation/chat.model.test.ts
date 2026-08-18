import { describe, expect, it } from "vitest";
import { ChatModel } from "./chat.model";

describe("chat run contract", () => {
	it("accepts a run without client-supplied history", () => {
		expect(
			ChatModel.RunInput.parse({
				conversationId: "conversation-1",
				messageId: "message-1",
				runId: "run-1",
				content: "Can I remove this wall?",
			}),
		).toEqual({
			conversationId: "conversation-1",
			messageId: "message-1",
			runId: "run-1",
			content: "Can I remove this wall?",
		});
	});

	it("rejects client-passed history", () => {
		expect(() =>
			ChatModel.RunInput.parse({
				conversationId: "conversation-1",
				messageId: "message-1",
				runId: "run-1",
				content: "hello",
				history: [],
			}),
		).toThrow();
	});
});
