import { zValidator } from "@hono/zod-validator";
import { createContactInLoops, MAILING_LISTS } from "@structa/core/marketing";
import { Hono } from "hono";
import { z } from "zod";

const WaitlistSchema = z.object({
	email: z.string().email(),
	name: z.string().optional(),
});

export const WaitlistRoute = new Hono().post(
	"/",
	zValidator("json", WaitlistSchema),
	async (c) => {
		const { email, name } = c.req.valid("json");

		const nameParts = (name || "").trim().split(" ");
		const firstName = nameParts[0] || undefined;
		const lastName = nameParts.slice(1).join(" ") || undefined;

		const result = await createContactInLoops({
			email,
			userId: email, // Use email as userId for unauthenticated waitlist signups
			firstName,
			lastName,
			properties: {
				source: "waitlist",
				createdAt: new Date().toISOString(),
			},
			mailingLists: {
				[MAILING_LISTS.WAITLIST]: true,
			},
		});

		if (!result.success) {
			return c.json({ error: result.error }, 400);
		}

		return c.json({ success: true }, 200);
	},
);
