import { describe, expect, it } from "vitest";
import { createChatTitle } from "./chat-title";

describe("createChatTitle", () => {
	it("normalizes whitespace and truncates long first messages", () => {
		expect(createChatTitle("  How   much will this cost?  ")).toBe(
			"How much will this cost?",
		);
		expect(createChatTitle("x".repeat(100))).toHaveLength(80);
	});
});
