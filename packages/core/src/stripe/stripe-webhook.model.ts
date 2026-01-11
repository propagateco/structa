export * as StripeWebhookModel from './stripe-webhook.model';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { stripeWebhook } from './stripe-webhook.sql';
import { z } from 'zod';

export const Schema = createSelectSchema(stripeWebhook, {
	id: z.string(),
	stripeAccountId: z.string().optional(),
	eventId: z.string(),
	eventType: z.string(),
	eventCreated: z.date(),
	payload: z.record(z.any()),
	processed: z.boolean().default(false),
	processingErrors: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type SchemaType = z.infer<typeof Schema>;

export const StripeWebhook = Schema.omit({
	createdAt: true,
	updatedAt: true,
});
export type StripeWebhookType = z.infer<typeof StripeWebhook>;

// For webhook event handling
export const WebhookEventPayload = z.object({
	id: z.string(),
	object: z.literal('event'),
	api_version: z.string().optional(),
	created: z.number(),
	data: z.object({
		object: z.record(z.any()),
	}),
	livemode: z.boolean(),
	pending_webhooks: z.number(),
	request: z
		.object({
			id: z.string().optional().nullable(),
			idempotency_key: z.string().optional().nullable(),
		})
		.optional(),
	type: z.string(),
});
export type WebhookEventPayloadType = z.infer<typeof WebhookEventPayload>;
