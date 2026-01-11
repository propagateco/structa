import { pgTable, text, timestamp, boolean, jsonb, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { user } from '@/auth/auth.sql';
import { stripeAccount } from './stripe-account.sql';
import { stripeCheckout } from './stripe-checkout.sql';

// Define enum for payment status
const PaymentStatus = [
	'succeeded',
	'pending',
	'failed',
	'canceled',
	'refunded',
	'partially_refunded',
] as const;
export type PaymentStatus = (typeof PaymentStatus)[number];
export const paymentStatusEnum = pgEnum('payment_status', PaymentStatus);

// Define enum for payment types
const PaymentType = ['payment_intent', 'subscription', 'invoice', 'charge'] as const;
export type PaymentType = (typeof PaymentType)[number];
export const paymentTypeEnum = pgEnum('payment_type', PaymentType);

export const stripePayment = pgTable('stripe_payment', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	stripeAccountId: text('stripe_account_id')
		.notNull()
		.references(() => stripeAccount.id),
	checkoutId: text('checkout_id').references(() => stripeCheckout.id),

	// Payment details
	stripePaymentId: text('stripe_payment_id').notNull(),
	stripePaymentType: paymentTypeEnum('stripe_payment_type').notNull(),
	stripeCustomerId: text('stripe_customer_id'),

	// Payment information
	amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
	currency: text('currency').notNull(),
	status: paymentStatusEnum('status').notNull(),

	// Stripe objects
	paymentObject: jsonb('payment_object').notNull(), // The full payment object from Stripe
	lastError: text('last_error'), // If the payment failed, this will contain the error

	// Metadata and additional information
	metadata: jsonb('metadata'),
	description: text('description'),

	// Timestamps
	stripeCreatedAt: timestamp('stripe_created_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
