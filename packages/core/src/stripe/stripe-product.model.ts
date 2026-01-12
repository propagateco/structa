export * as StripeProductModel from './stripe-product.model';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { stripeProduct } from './stripe-product.sql';
import { z } from 'zod';

export const Schema = createSelectSchema(stripeProduct, {
	id: z.string(),
	userId: z.string(),
	stripeAccountId: z.string(),
	productId: z.string().optional().nullable(),
	stripeProductId: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	active: z.boolean().default(true),
	images: z.array(z.string()).optional().nullable(),
	metadata: z.record(z.any()).optional().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().optional().nullable(),
});
export type SchemaType = z.infer<typeof Schema>;

export const StripeProduct = Schema.omit({
	createdAt: true,
	updatedAt: true,
	deletedAt: true,
});
export type StripeProductType = z.infer<typeof StripeProduct>;

// For creating products in Stripe
export const CreateStripeProduct = z.object({
	userId: z.string(),
	stripeAccountId: z.string(),
	productId: z.string().optional(),
	name: z.string(),
	description: z.string().optional(),
	images: z.array(z.string()).optional(),
	metadata: z.record(z.string()).optional(),
});
export type CreateStripeProductType = z.infer<typeof CreateStripeProduct>;
