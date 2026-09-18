import { createHmac } from "node:crypto";

/**
 * Server-side minting of conversation capability tickets (web server only).
 *
 * Wire-compatible with `packages/functions/src/cloudflare/capability.ts`:
 * the same HMAC-SHA-256 over `base64url(JSON{c,u,exp})`, signed with the
 * shared `DATA_SERVICE_TOKEN`. Node's `base64url` encoding matches the
 * Worker's WebCrypto implementation byte-for-byte.
 */

export const TICKET_TTL_MS = 5 * 60 * 1000;

export function mintConversationTicket(
	secret: string,
	input: { conversationId: string; userId: string },
): string {
	const payload = Buffer.from(
		JSON.stringify({
			c: input.conversationId,
			u: input.userId,
			exp: Date.now() + TICKET_TTL_MS,
		}),
	).toString("base64url");
	const signature = createHmac("sha256", secret)
		.update(payload)
		.digest("base64url");
	return `${payload}.${signature}`;
}
