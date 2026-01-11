export * as StripeSubscriptionModel from './stripe-subscription.model';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { stripeSubscription, subscriptionStatusEnum, collectionMethodEnum } from './stripe-subscription.sql';
import { z } from 'zod';

export const Schema = createSelectSchema(stripeSubscription, {
	id: z.string(),
	userId: z.string(),
	stripeAccountId: z.string(),
	stripeCustomerId: z.string(),
	stripeSubscriptionId: z.string(),
	status: z.enum(subscriptionStatusEnum.enumValues),
	collectionMethod: z.enum(collectionMethodEnum.enumValues),
	currency: z.string(),
	currentPeriodStart: z.date(),
	currentPeriodEnd: z.date(),
	trialStart: z.date().optional().nullable(),
	trialEnd: z.date().optional().nullable(),
	cancelAt: z.date().optional().nullable(),
	cancelAtPeriodEnd: z.boolean(),
	canceledAt: z.date().optional().nullable(),
	subscriptionItems: z.array(z.record(z.any())),
	billingCycleAnchor: z.date().optional().nullable(),
	daysUntilDue: z.number().optional().nullable(),
	metadata: z.record(z.any()).optional().nullable(),
	description: z.string().optional().nullable(),
	subscriptionObject: z.record(z.any()),
	discountObject: z.record(z.any()).optional().nullable(),
	latestInvoice: z.string().optional().nullable(),
	stripeCreatedAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type SchemaType = z.infer<typeof Schema>;

export const StripeSubscription = Schema.omit({
	createdAt: true,
	updatedAt: true,
});
export type StripeSubscriptionType = z.infer<typeof StripeSubscription>;

// For creating subscriptions in our database
export const CreateStripeSubscription = z.object({
	userId: z.string(),
	stripeAccountId: z.string(),
	stripeCustomerId: z.string(),
	stripeSubscriptionId: z.string(),
	status: z.enum(subscriptionStatusEnum.enumValues),
	collectionMethod: z.enum(collectionMethodEnum.enumValues),
	currency: z.string(),
	currentPeriodStart: z.date(),
	currentPeriodEnd: z.date(),
	trialStart: z.date().optional(),
	trialEnd: z.date().optional(),
	cancelAt: z.date().optional(),
	cancelAtPeriodEnd: z.boolean().optional(),
	canceledAt: z.date().optional(),
	subscriptionItems: z.array(z.record(z.any())),
	billingCycleAnchor: z.date().optional(),
	daysUntilDue: z.number().optional(),
	metadata: z.record(z.any()).optional(),
	description: z.string().optional(),
	subscriptionObject: z.record(z.any()),
	discountObject: z.record(z.any()).optional(),
	latestInvoice: z.string().optional(),
	stripeCreatedAt: z.date(),
});
export type CreateStripeSubscriptionType = z.infer<typeof CreateStripeSubscription>;

// For updating subscription information
export const UpdateStripeSubscription = z.object({
	id: z.string(),
	status: z.enum(subscriptionStatusEnum.enumValues).optional(),
	collectionMethod: z.enum(collectionMethodEnum.enumValues).optional(),
	currency: z.string().optional(),
	currentPeriodStart: z.date().optional(),
	currentPeriodEnd: z.date().optional(),
	trialStart: z.date().optional(),
	trialEnd: z.date().optional(),
	cancelAt: z.date().optional(),
	cancelAtPeriodEnd: z.boolean().optional(),
	canceledAt: z.date().optional(),
	subscriptionItems: z.array(z.record(z.any())).optional(),
	billingCycleAnchor: z.date().optional(),
	daysUntilDue: z.number().optional(),
	metadata: z.record(z.any()).optional(),
	description: z.string().optional(),
	subscriptionObject: z.record(z.any()).optional(),
	discountObject: z.record(z.any()).optional(),
	latestInvoice: z.string().optional(),
});
export type UpdateStripeSubscriptionType = z.infer<typeof UpdateStripeSubscription>;