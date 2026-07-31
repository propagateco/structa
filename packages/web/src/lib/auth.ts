import { sendVerificationOTP } from "@backend/auth/email";
import { AuthSchema } from "@core/auth";
import { db } from "@core/drizzle";
import { createContactInLoops, MAILING_LISTS } from "@core/marketing";
import { extractIPAddress, getLocationFromIP } from "@core/utils/geolocation";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, openAPI } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Resource } from "sst";
import { botLoginPlugin } from "./bot-login";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: AuthSchema,
	}),
	// baseURL: `${Resource.Domain.web}`,
	secret: Resource.BetterAuthSecret.value,
	socialProviders: {
		google: {
			clientId: Resource.GoogleOAuthClientId.value,
			clientSecret: Resource.GoogleOAuthClientSecret.value,
			accessType: "offline",
			prompt: "select_account consent",
		},
	},
	advanced: {
		cookiePrefix: Resource.Stage.cookiePrefix,
		crossSubDomainCookies: {
			enabled: Resource.Domain.web !== "http://localhost:3000",
		},
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			partitioned: true,
		},
	},
	user: {
		additionalFields: {
			workspaceId: {
				type: "string",
				input: false,
			},
			workspaceName: {
				type: "string",
				input: false,
			},
			role: {
				type: "string",
				input: false,
			},
			plan: {
				type: "string",
				input: false,
			},
			product: {
				type: "string",
				input: false,
			},
		},
	},
	databaseHooks: {
		verification: {
			create: {
				before: async (verification, ctx) => {
					const ip =
						ctx && ctx.request?.headers
							? extractIPAddress(ctx.request.headers)
							: "unknown";

					console.log(`Verification request from IP: ${ip}`);

					let city = null;
					let country = null;

					try {
						const location = await getLocationFromIP(ip);
						if (location) {
							city = location.city;
							country = location.country;
							console.log(`Location resolved: ${city}, ${country}`);
						}
					} catch (error) {
						console.error("Failed to resolve location:", error);
					}

					return {
						data: {
							...verification,
							ipAddress: ip,
							city,
							country,
						},
					};
				},
			},
		},
		user: {
			create: {
				after: async (user) => {
					// NO plan field modification - keep as null (default behavior)
					// Sync to Loops using user.id for automatic deduplication
					const nameParts = (user.name || "").trim().split(" ");
					const firstName = nameParts[0] || "";
					const lastName = nameParts.slice(1).join(" ") || "";

					console.log(
						`[Auth] Syncing new user to Loops: userId=${user.id}, email=${user.email}`,
					);

					const result = await createContactInLoops({
						email: user.email,
						userId: user.id, // Loops handles deduplication!
						firstName,
						lastName,
						properties: {
							source: "resource-signup",
							createdAt: user.createdAt.toISOString(),
						},
						mailingLists: {
							[MAILING_LISTS.MARKETING]: true,
							[MAILING_LISTS.PRODUCT]: true,
						},
					});

					if (result.success) {
						console.log(
							`[Auth] Loops sync successful: contactId=${result.data.id}`,
						);
					} else {
						// Log failure but don't block user creation
						// The detailed error was already logged in createContactInLoops
						console.error(
							`[Auth] Loops sync FAILED for userId=${user.id}: ${result.error}`,
						);
						if (result.details) {
							console.error(`[Auth] Loops error details:`, result.details);
						}
					}
				},
			},
		},
	},
	plugins: [
		openAPI(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				await sendVerificationOTP({ email, otp, type });
			},
		}),
		// Bot-login is dev-only: never registered in production, so the
		// `/bot-login` endpoint returns 404 there (unknown auth path).
		...(Resource.App.stage === "production" ? [] : [botLoginPlugin()]),
		{
			id: "verification-location",
			schema: {
				verification: {
					fields: {
						id: {
							type: "string",
							required: true,
						},
						identifier: {
							type: "string",
							required: true,
						},
						value: {
							type: "string",
							required: true,
						},
						expiresAt: {
							type: "date",
							required: true,
						},
						createdAt: {
							type: "date",
							required: true,
						},
						updatedAt: {
							type: "date",
							required: true,
						},
						ipAddress: {
							type: "string",
							required: false,
						},
						city: {
							type: "string",
							required: false,
						},
						country: {
							type: "string",
							required: false,
						},
					},
				},
			},
		},
		tanstackStartCookies(),
	],
});
