export * as StripePaymentModel from './stripe-payment.model';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { stripePayment, paymentStatusEnum, paymentTypeEnum } from './stripe-payment.sql';
import { z } from 'zod';

export const Schema = createSelectSchema(stripePayment, {
	id: z.string(),
	userId: z.string(),
	stripeAccountId: z.string(),
	checkoutId: z.string().optional().nullable(),
	stripePaymentId: z.string(),
	stripePaymentType: z.enum(paymentTypeEnum.enumValues),
	stripeCustomerId: z.string().optional().nullable(),
	amount: z.number(),
	currency: z.string(),
	status: z.enum(paymentStatusEnum.enumValues),
	paymentObject: z.record(z.any()),
	lastError: z.string().optional().nullable(),
	metadata: z.record(z.any()).optional().nullable(),
	description: z.string().optional().nullable(),
	stripeCreatedAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type SchemaType = z.infer<typeof Schema>;

export const StripePayment = Schema.omit({
	createdAt: true,
	updatedAt: true,
});
export type StripePaymentType = z.infer<typeof StripePayment>;

// For creating payments in our database (typically from webhook events)
export const CreateStripePayment = z.object({
	userId: z.string(),
	stripeAccountId: z.string(),
	checkoutId: z.string().optional(),
	stripePaymentId: z.string(),
	stripePaymentType: z.enum(paymentTypeEnum.enumValues),
	stripeCustomerId: z.string().optional(),
	amount: z.number(),
	currency: z.string(),
	status: z.enum(paymentStatusEnum.enumValues),
	paymentObject: z.record(z.any()),
	lastError: z.string().optional(),
	metadata: z.record(z.any()).optional(),
	description: z.string().optional(),
	stripeCreatedAt: z.date(),
});
export type CreateStripePaymentType = z.infer<typeof CreateStripePayment>;

// For updating payment status
export const UpdatePaymentStatus = z.object({
	id: z.string(),
	status: z.enum(paymentStatusEnum.enumValues),
	lastError: z.string().optional(),
});
export type UpdatePaymentStatusType = z.infer<typeof UpdatePaymentStatus>;
