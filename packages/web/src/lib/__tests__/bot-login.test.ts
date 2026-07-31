/**
 * Unit tests for the bot-login helper (`packages/web/src/lib/bot-login.ts`).
 *
 * The plugin itself is thin wiring around better-auth's runtime; the
 * framework-agnostic core (`loginBotUser`) is what carries the security
 * rules, so it gets the tests.
 */
import { describe, expect, it, vi } from "vitest";
import {
	BOT_EMAIL,
	BotLoginError,
	loginBotUser,
} from "../bot-login";

const BOT_USER = {
	id: "user-bot-123",
	email: BOT_EMAIL,
	name: "Agent Bot",
	image: null,
};

function makeDeps(overrides: Partial<Parameters<typeof loginBotUser>[0]> = {}) {
	return {
		email: BOT_EMAIL,
		findUser: vi.fn(async (email: string) =>
			email === BOT_EMAIL ? BOT_USER : null,
		),
		createSession: vi.fn(async (userId: string) => ({
			token: `session-token-${userId}`,
		})),
		...overrides,
	};
}

describe("loginBotUser", () => {
	it("creates a session for the configured bot email", async () => {
		const deps = makeDeps();
		const result = await loginBotUser(deps);

		expect(result.user).toEqual(BOT_USER);
		expect(deps.findUser).toHaveBeenCalledWith(BOT_EMAIL);
		expect(deps.createSession).toHaveBeenCalledWith(BOT_USER.id);
		expect(result.session.token).toBe(`session-token-${BOT_USER.id}`);
	});

	it("is case-insensitive for the bot email", async () => {
		const deps = makeDeps({ email: "AGENT@STRUCTA.DEV" });
		const result = await loginBotUser(deps);

		expect(deps.findUser).toHaveBeenCalledWith(BOT_EMAIL);
		expect(result.user.email).toBe(BOT_EMAIL);
	});

	it("rejects any other email with 403", async () => {
		const deps = makeDeps({ email: "someone@else.com" });

		await expect(loginBotUser(deps)).rejects.toBeInstanceOf(BotLoginError);
		await expect(loginBotUser(deps)).rejects.toMatchObject({
			status: 403,
		});
		expect(deps.findUser).not.toHaveBeenCalled();
		expect(deps.createSession).not.toHaveBeenCalled();
	});

	it("rejects when the bot user does not exist with 404", async () => {
		const deps = makeDeps({
			findUser: vi.fn(async () => null),
		});

		await expect(loginBotUser(deps)).rejects.toBeInstanceOf(BotLoginError);
		await expect(loginBotUser(deps)).rejects.toMatchObject({
			status: 404,
			message: expect.stringContaining(BOT_EMAIL) as unknown as string,
		});
		expect(deps.createSession).not.toHaveBeenCalled();
	});

	it("propagates adapter errors (e.g. DB down)", async () => {
		const deps = makeDeps({
			createSession: vi.fn(async () => {
				throw new Error("connection refused");
			}),
		});

		await expect(loginBotUser(deps)).rejects.toThrow("connection refused");
	});
});
