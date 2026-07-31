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

// Only the dev/production stages have a custom domain with a real
// BETTER_AUTH_URL env var (see infra/web.ts). Everything else (previews,
// personal stages) serves from an auto-generated CloudFront URL.
const isDeployedStage =
	Resource.App.stage === "production" || Resource.App.stage === "dev";

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
		// Cross-subdomain cookies require a baseURL (set via the
		// BETTER_AUTH_URL env var), which only deployed stages get
		// (infra/web.ts). Previews/personal stages serve from an
		// auto-generated CloudFront URL where the custom domain does not
		// exist, so host-only cookies are the correct behaviour there —
		// enabling crossSubDomainCookies without a baseURL makes
		// better-auth throw on every auth request.
		crossSubDomainCookies: {
			enabled: isDeployedStage,
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
