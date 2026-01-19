import { Resource } from 'sst';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '../../../core/src/drizzle';
import { AuthSchema } from '../../../core/src/auth/';
import { openAPI, emailOTP } from 'better-auth/plugins';
import { sendVerificationOTP } from './email';
import {
    extractIPAddress,
    getLocationFromIP,
} from '../../../core/src/utils/geolocation';

// Backend auth instance - uses same baseURL as frontend for cookie compatibility
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: AuthSchema,
    }),
    baseURL: `${Resource.Domain.platform}/auth`,
    secret: Resource.BetterAuthSecret.value,
    allowedOrigins: [Resource.Domain.platform],
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: Resource.GoogleOAuthClientId.value,
            clientSecret: Resource.GoogleOAuthClientSecret.value,
            accessType: 'offline',
            prompt: 'select_account consent',
        },
    },
    advanced: {
        cookiePrefix: Resource.Stage.cookiePrefix,
        crossSubDomainCookies: {
            enabled: Resource.App.stage !== 'local',
        },
        defaultCookieAttributes: {
            sameSite: 'none',
            secure: true,
            partitioned: true,
        },
    },
    user: {
        additionalFields: {
            workspaceId: {
                type: 'string',
                input: false,
            },
            workspaceName: {
                type: 'string',
                input: false,
            },
            role: {
                type: 'string',
                input: false,
            },
            plan: {
                type: 'string',
                input: false,
            },
            product: {
                type: 'string',
                input: false,
            },
        },
    },
    databaseHooks: {
        verification: {
            create: {
                before: async (verification, ctx) => {
                    let ip =
                        ctx && ctx.request?.headers
                            ? extractIPAddress(ctx.request.headers)
                            : 'unknown';

                    console.log(`Verification request from IP: ${ip}`);

                    let city = null;
                    let country = null;

                    try {
                        const location = await getLocationFromIP(ip);
                        if (location) {
                            city = location.city;
                            country = location.country;
                            console.log(
                                `Location resolved: ${city}, ${country}`
                            );
                        }
                    } catch (error) {
                        console.error('Failed to resolve location:', error);
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
    },
    plugins: [
        openAPI(),
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                await sendVerificationOTP({ email, otp, type });
            },
        }),
        {
            id: 'verification-location',
            schema: {
                verification: {
                    fields: {
                        id: {
                            type: 'string',
                            required: true,
                        },
                        identifier: {
                            type: 'string',
                            required: true,
                        },
                        value: {
                            type: 'string',
                            required: true,
                        },
                        expiresAt: {
                            type: 'date',
                            required: true,
                        },
                        createdAt: {
                            type: 'date',
                            required: true,
                        },
                        updatedAt: {
                            type: 'date',
                            required: true,
                        },
                        // Custom location fields
                        ipAddress: {
                            type: 'string',
                            required: false,
                        },
                        city: {
                            type: 'string',
                            required: false,
                        },
                        country: {
                            type: 'string',
                            required: false,
                        },
                    },
                },
            },
        },
    ],
});
