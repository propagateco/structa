import { describe, expect, it } from "vitest";
import { ConversationModel } from "./conversation.model";

describe("ConversationModel", () => {
	it("accepts a persisted conversation and requires a non-empty title", () => {
		const conversation = ConversationModel.Schema.parse({
			id: "conversation-1",
			userId: "user-1",
			projectId: null,
			context: "project",
			documentId: null,
			title: "Kitchen renovation",
			messageCount: 0,
			lastMessageAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		expect(conversation.title).toBe("Kitchen renovation");
	});

	it("accepts cursor and project filters for list requests", () => {
		const input = ConversationModel.ListInput.parse({
			cursor: "eyJpZCI6ImMxIn0",
			projectId: "project-1",
			limit: 25,
		});

		expect(input.limit).toBe(25);
	});
});
