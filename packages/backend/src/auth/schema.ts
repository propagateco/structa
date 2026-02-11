import { z } from "zod";

export const google = z.object({
	iss: z.literal("https://accounts.google.com"),
	azp: z.string(),
	aud: z.string(),
	sub: z.string(),
	email: z.string().email(),
	email_verified: z.boolean(),
	nonce: z.string(),
	nbf: z.number(),
	iat: z.number(),
	exp: z.number(),
	jti: z.string(),
	name: z.string().optional(),
	picture: z.string().optional(),
});
