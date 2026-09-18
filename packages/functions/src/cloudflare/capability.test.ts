import { describe, expect, it } from "vitest";
import {
	signConversationTicket,
	TICKET_TTL_MS,
	verifyConversationTicket,
} from "./capability";

describe("conversation capability tickets", () => {
	it("round-trips a signed ticket", async () => {
		const ticket = await signConversationTicket("secret", {
			conversationId: "conv-1",
			userId: "user-1",
		});

		const claims = await verifyConversationTicket("secret", ticket);
		expect(claims).toMatchObject({
			conversationId: "conv-1",
			userId: "user-1",
		});
		expect(claims?.exp).toBeGreaterThan(Date.now());
		expect(claims?.exp).toBeLessThanOrEqual(Date.now() + TICKET_TTL_MS);
	});

	it("rejects a ticket signed with a different secret", async () => {
		const ticket = await signConversationTicket("secret-a", {
			conversationId: "conv-1",
			userId: "user-1",
		});

		expect(await verifyConversationTicket("secret-b", ticket)).toBeNull();
	});

	it("rejects a tampered payload", async () => {
		const ticket = await signConversationTicket("secret", {
			conversationId: "conv-1",
			userId: "user-1",
		});
		const tampered = `AAAA.${ticket.slice(ticket.indexOf(".") + 1)}`;

		expect(await verifyConversationTicket("secret", tampered)).toBeNull();
	});

	it("rejects expired tickets", async () => {
		const ticket = await signConversationTicket("secret", {
			conversationId: "conv-1",
			userId: "user-1",
			exp: Date.now() - 1,
		});

		expect(await verifyConversationTicket("secret", ticket)).toBeNull();
	});

	it("rejects malformed tickets", async () => {
		expect(await verifyConversationTicket("secret", "")).toBeNull();
		expect(await verifyConversationTicket("secret", "no-signature")).toBeNull();
		expect(
			await verifyConversationTicket("secret", "not-valid-base64!!.sig"),
		).toBeNull();
		expect(await verifyConversationTicket("secret", ".sig")).toBeNull();
	});

	it("produces url-safe tokens without padding", async () => {
		const ticket = await signConversationTicket("secret", {
			conversationId: "conv-1",
			userId: "user-1",
		});
		expect(ticket).not.toMatch(/[+/=]/);
	});
});
