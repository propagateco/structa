export * as StripeCustomerModel from './stripe-customer.model';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { stripeCustomer } from './stripe-customer.sql';
import { z } from 'zod';

export const Schema = createSelectSchema(stripeCustomer, {
	id: z.string(),
	userId: z.string(),
	stripeAccountId: z.string(),
	stripeCustomerId: z.string(),
	email: z.string().email().optional().nullable(),
	name: z.string().optional().nullable(),
	phone: z.string().optional().nullable(),
	addressLine1: z.string().optional().nullable(),
	addressLine2: z.string().optional().nullable(),
	addressCity: z.string().optional().nullable(),
	addressState: z.string().optional().nullable(),
	addressPostalCode: z.string().optional().nullable(),
	addressCountry: z.string().optional().nullable(),
	currency: z.string().optional().nullable(),
	defaultPaymentMethod: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	metadata: z.record(z.any()).optional().nullable(),
	customerObject: z.record(z.any()),
	isDeleted: z.boolean(),
	isDelinquent: z.boolean(),
	stripeCreatedAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type SchemaType = z.infer<typeof Schema>;

export const StripeCustomer = Schema.omit({
	createdAt: true,
	updatedAt: true,
});
export type StripeCustomerType = z.infer<typeof StripeCustomer>;

// For creating customers in our database
export const CreateStripeCustomer = z.object({
	userId: z.string(),
	stripeAccountId: z.string(),
	stripeCustomerId: z.string(),
	email: z.string().email().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
	addressLine1: z.string().optional(),
	addressLine2: z.string().optional(),
	addressCity: z.string().optional(),
	addressState: z.string().optional(),
	addressPostalCode: z.string().optional(),
	addressCountry: z.string().optional(),
	currency: z.string().optional(),
	defaultPaymentMethod: z.string().optional(),
	description: z.string().optional(),
	metadata: z.record(z.any()).optional(),
	customerObject: z.record(z.any()),
	isDeleted: z.boolean().optional(),
	isDelinquent: z.boolean().optional(),
	stripeCreatedAt: z.date(),
});
export type CreateStripeCustomerType = z.infer<typeof CreateStripeCustomer>;

// For updating customer information
export const UpdateStripeCustomer = z.object({
	id: z.string(),
	email: z.string().email().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
	addressLine1: z.string().optional(),
	addressLine2: z.string().optional(),
	addressCity: z.string().optional(),
	addressState: z.string().optional(),
	addressPostalCode: z.string().optional(),
	addressCountry: z.string().optional(),
	currency: z.string().optional(),
	defaultPaymentMethod: z.string().optional(),
	description: z.string().optional(),
	metadata: z.record(z.any()).optional(),
	customerObject: z.record(z.any()).optional(),
	isDeleted: z.boolean().optional(),
	isDelinquent: z.boolean().optional(),
});
export type UpdateStripeCustomerType = z.infer<typeof UpdateStripeCustomer>;