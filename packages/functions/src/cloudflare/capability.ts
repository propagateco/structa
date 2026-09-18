/**
 * Short-lived signed tickets for browser access to the conversation service.
 *
 * The browser cannot hold the internal service token, so Structa's web app
 * mints a ticket that binds a conversation to the authenticated user. The
 * worker verifies the HMAC signature and expiry at the edge and never trusts
 * a browser-supplied conversation id or user id.
 */

export type ConversationTicket = {
	conversationId: string;
	userId: string;
	exp: number;
};

/** How long a minted ticket stays valid. The web app includes this in its TTL. */
export const TICKET_TTL_MS = 5 * 60 * 1000;

const ALPHABET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/** URL-safe base64 (no padding) that runs in Workers, browsers, and Node. */
function toBase64Url(bytes: Uint8Array): string {
	let out = "";
	for (let i = 0; i < bytes.length; i += 3) {
		const b0 = bytes[i];
		const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
		const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
		out += ALPHABET[b0 >> 2];
		out += ALPHABET[((b0 & 3) << 4) | (b1 >> 4)];
		if (i + 1 < bytes.length) out += ALPHABET[((b1 & 15) << 2) | (b2 >> 6)];
		if (i + 2 < bytes.length) out += ALPHABET[b2 & 63];
	}
	return out;
}

function fromBase64Url(input: string): Uint8Array | null {
	if (!input || input.length % 4 === 1) return null;
	const alphabet = new Map<string, number>();
	for (let index = 0; index < ALPHABET.length; index += 1) {
		alphabet.set(ALPHABET[index], index);
	}
	const bytes: number[] = [];
	let buffer = 0;
	let bits = 0;
	for (const char of input) {
		const value = alphabet.get(char);
		if (value === undefined) return null;
		buffer = (buffer << 6) | value;
		bits += 6;
		if (bits >= 8) {
			bits -= 8;
			bytes.push((buffer >> bits) & 0xff);
		}
	}
	return new Uint8Array(bytes);
}

const encoder = new TextEncoder();

async function hmacSha256(secret: string, message: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign(
		"HMAC",
		key,
		encoder.encode(message),
	);
	return toBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i += 1) {
		diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return diff === 0;
}

export type SignTicketInput = {
	conversationId: string;
	userId: string;
	/** Epoch ms. Defaults to now + TICKET_TTL_MS. */
	exp?: number;
};

/**
 * Sign a ticket: `base64url(payload).base64url(hmac)`. Only the payload and
 * signature travel — the secret never leaves the server.
 */
export async function signConversationTicket(
	secret: string,
	input: SignTicketInput,
): Promise<string> {
	const payload = toBase64Url(
		encoder.encode(
			JSON.stringify({
				c: input.conversationId,
				u: input.userId,
				exp: input.exp ?? Date.now() + TICKET_TTL_MS,
			}),
		),
	);
	const signature = await hmacSha256(secret, payload);
	return `${payload}.${signature}`;
}

/**
 * Verify a ticket and return its claims, or null when the signature is
 * invalid, the payload is malformed, or the ticket has expired.
 */
export async function verifyConversationTicket(
	secret: string,
	ticket: string,
	now = Date.now(),
): Promise<ConversationTicket | null> {
	const separator = ticket.lastIndexOf(".");
	if (separator <= 0) return null;
	const payload = ticket.slice(0, separator);
	const signature = ticket.slice(separator + 1);
	const expected = await hmacSha256(secret, payload);
	if (!constantTimeEqual(signature, expected)) return null;
	const decoded = fromBase64Url(payload);
	if (!decoded) return null;
	let claims: { c?: unknown; u?: unknown; exp?: unknown };
	try {
		claims = JSON.parse(new TextDecoder().decode(decoded)) as typeof claims;
	} catch {
		return null;
	}
	const { c: conversationId, u: userId, exp } = claims;
	if (
		typeof conversationId !== "string" ||
		conversationId.length === 0 ||
		typeof userId !== "string" ||
		userId.length === 0 ||
		typeof exp !== "number" ||
		exp <= now
	) {
		return null;
	}
	return { conversationId, userId, exp };
}
