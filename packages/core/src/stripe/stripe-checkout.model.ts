export * as StripeCheckoutModel from './stripe-checkout.model';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { stripeCheckout, checkoutStatusEnum, checkoutModeEnum } from './stripe-checkout.sql';
import { z } from 'zod';

// Export the enum types
export { checkoutStatusEnum, checkoutModeEnum } from './stripe-checkout.sql';
export type { CheckoutStatus } from './stripe-checkout.sql';

export const Schema = createSelectSchema(stripeCheckout, {
	id: z.string(),
	userId: z.string(),
	stripeAccountId: z.string(),
	stripeCheckoutId: z.string(),
	stripeCustomerId: z.string().optional().nullable(),
	customerEmail: z.string().optional().nullable(),
	mode: z.enum(checkoutModeEnum.enumValues),
	status: z.enum(checkoutStatusEnum.enumValues).default('created'),
	successUrl: z.string(),
	cancelUrl: z.string(),
	url: z.string(),
	paymentStatus: z.string().optional().nullable(),
	amountTotal: z.string().optional().nullable(),
	currencyCode: z.string().optional().nullable(),
	metadata: z.record(z.any()).optional().nullable(),
	lineItems: z.array(z.any()).optional().nullable(),
	expiresAt: z.date().optional().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type SchemaType = z.infer<typeof Schema>;

export const StripeCheckout = Schema.omit({
	createdAt: true,
	updatedAt: true,
});
export type StripeCheckoutType = z.infer<typeof StripeCheckout>;

// For creating checkout sessions
export const LineItem = z.object({
	price: z.string(),
	quantity: z.number().default(1),
});
export type LineItemType = z.infer<typeof LineItem>;

export const CreateStripeCheckout = z.object({
	userId: z.string(),
	stripeAccountId: z.string(),
	successUrl: z.string(),
	cancelUrl: z.string(),
	mode: z.enum(checkoutModeEnum.enumValues),
	lineItems: z.array(LineItem),
	customerEmail: z.string().optional(),
	metadata: z.record(z.string()).optional(),
	expiresAt: z.number().optional(), // Number of minutes until expiration
});
export type CreateStripeCheckoutType = z.infer<typeof CreateStripeCheckout>;
