export * as StripePriceModel from './stripe-price.model';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { stripePrice, priceTypeEnum, priceIntervalEnum, currencyEnum } from './stripe-price.sql';
import { z } from 'zod';

export const Schema = createSelectSchema(stripePrice, {
	id: z.string(),
	userId: z.string(),
	stripeAccountId: z.string(),
	stripeProductId: z.string(),
	internalStripeProductId: z.string(),
	stripePriceId: z.string(),
	nickname: z.string().optional().nullable(),
	currency: z.enum(currencyEnum.enumValues),
	unitAmount: z.number(),
	type: z.enum(priceTypeEnum.enumValues),
	recurring: z.boolean().default(false),
	interval: z.enum(priceIntervalEnum.enumValues).optional().nullable(),
	intervalCount: z.number().optional().nullable(),
	active: z.boolean().default(true),
	metadata: z.record(z.any()).optional().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().optional().nullable(),
});
export type SchemaType = z.infer<typeof Schema>;

export const StripePrice = Schema.omit({
	createdAt: true,
	updatedAt: true,
	deletedAt: true,
});
export type StripePriceType = z.infer<typeof StripePrice>;

// For creating prices in Stripe
export const CreateStripePrice = z.object({
	userId: z.string(),
	stripeAccountId: z.string(),
	internalStripeProductId: z.string(),
	nickname: z.string().optional(),
	currency: z.enum(currencyEnum.enumValues),
	unitAmount: z.number(),
	recurring: z.boolean().default(false),
	interval: z.enum(priceIntervalEnum.enumValues).optional(),
	intervalCount: z.number().optional(),
	metadata: z.record(z.string()).optional(),
});
export type CreateStripePriceType = z.infer<typeof CreateStripePrice>;
