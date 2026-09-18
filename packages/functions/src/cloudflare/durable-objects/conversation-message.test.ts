import { describe, expect, it } from "vitest";
import { parseConversationMessage } from "./conversation-message";

describe("parseConversationMessage", () => {
	it("accepts valid messages and supplies a timestamp when absent", () => {
		const message = parseConversationMessage({
			id: "message-1",
			role: "user",
			content: "Hello",
		});

		expect(message).toMatchObject({
			id: "message-1",
			role: "user",
			content: "Hello",
		});
		expect(message?.createdAt).toEqual(expect.any(Number));
	});

	it("rejects malformed messages and unsupported roles", () => {
		expect(parseConversationMessage(null)).toBeNull();
		expect(
			parseConversationMessage({ id: "", role: "user", content: "x" }),
		).toBeNull();
		expect(
			parseConversationMessage({ id: "1", role: "system", content: "x" }),
		).toBeNull();
	});
});
