/**
 * Bot-login plugin for better-auth.
 *
 * Adds a dev-only `POST /api/auth/bot-login` endpoint that creates a session
 * for the configured bot user (`agent@structa.dev`) WITHOUT the email-OTP
 * flow. This lets automated testing agents authenticate against PR preview
 * environments (and local dev) with a single curl call — no email delivery,
 * no OTP lookup, no local dev server required.
 *
 * Security model:
 *  - The plugin is only registered on non-production stages (see
 *    `packages/web/src/lib/auth.ts`), so the endpoint does not exist in
 *    production at all (better-auth returns 404 for unknown paths).
 *  - Only the fixed bot email is accepted; any other email gets 403.
 *  - The bot user must already exist in the database (created manually in the
 *    dev database; Neon branching copies it into every preview branch).
 */
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";

/** The email the bot-login endpoint will authenticate. */
export const BOT_EMAIL = "agent@structa.dev";

/** Error thrown by {@link loginBotUser} with a stable HTTP status code. */
export class BotLoginError extends Error {
	constructor(
		public status: 403 | 404,
		message: string,
	) {
		super(message);
		this.name = "BotLoginError";
	}
}

/** Minimal structural view of the better-auth user row used by the bot flow. */
export interface BotUser {
	id: string;
	email: string;
	name?: string | null;
	image?: string | null;
}

/**
 * Core bot-login logic, framework-agnostic so it can be unit tested without
 * a database or the better-auth runtime.
 *
 * Generic over the user/session shapes so the caller can pass better-auth's
 * full types (no casts) or lightweight mocks in tests.
 *
 * Throws {@link BotLoginError} with the HTTP status to surface:
 *  - 403 when the email is not the configured bot email
 *  - 404 when the bot user does not exist yet
 */
export async function loginBotUser<
	TUser extends BotUser,
	TSession extends { token: string },
>({
	email,
	findUser,
	createSession,
}: {
	email: string;
	findUser: (email: string) => Promise<TUser | null>;
	createSession: (userId: string) => Promise<TSession>;
}): Promise<{ session: TSession; user: TUser }> {
	const normalized = email.toLowerCase();

	if (normalized !== BOT_EMAIL) {
		throw new BotLoginError(
			403,
			"Bot login is restricted to the configured bot email",
		);
	}

	const user = await findUser(normalized);
	if (!user) {
		throw new BotLoginError(
			404,
			`Bot user "${BOT_EMAIL}" not found — create it in the dev database first`,
		);
	}

	const session = await createSession(user.id);
	return { session, user };
}

/**
 * Creates the better-auth plugin that exposes the `/bot-login` endpoint.
 *
 * The endpoint:
 *  1. Validates the request body (email must be a well-formed email).
 *  2. Runs {@link loginBotUser} against the better-auth internal adapter.
 *  3. Sets the session cookie (same mechanism as the email-OTP flow).
 *  4. Returns `{ success: true }`.
 */
export function botLoginPlugin(): BetterAuthPlugin {
	return {
		id: "bot-login",
		endpoints: {
			botLogin: createAuthEndpoint(
				"/bot-login",
				{
					method: "POST",
					body: z.object({
						email: z.string().email(),
					}),
				},
				async (ctx) => {
					try {
						const result = await loginBotUser({
							email: ctx.body.email,
							findUser: async (email) => {
								const found =
									await ctx.context.internalAdapter.findUserByEmail(
										email,
									);
								return found ? found.user : null;
							},
							createSession: (userId) =>
								ctx.context.internalAdapter.createSession(userId),
						});

						await setSessionCookie(ctx, {
							session: result.session,
							user: result.user,
						});
						return ctx.json({ success: true });
					} catch (error) {
						if (error instanceof BotLoginError) {
							throw APIError.fromStatus(error.status, {
								message: error.message,
							});
						}
						throw error;
					}
				},
			),
		},
	};
}
