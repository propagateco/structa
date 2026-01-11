import { pgTable, text, timestamp, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { user } from '@/auth/auth.sql';
import { stripeAccount } from './stripe-account.sql';

// Define enum for checkout status
const CheckoutStatus = ['created', 'succeeded', 'expired', 'canceled'] as const;
export type CheckoutStatus = (typeof CheckoutStatus)[number];
export const checkoutStatusEnum = pgEnum('checkout_status', CheckoutStatus);

// Define enum for checkout mode
const CheckoutMode = ['payment', 'subscription', 'setup'] as const;
export type CheckoutMode = (typeof CheckoutMode)[number];
export const checkoutModeEnum = pgEnum('checkout_mode', CheckoutMode);

export const stripeCheckout = pgTable('stripe_checkout', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	stripeAccountId: text('stripe_account_id')
		.notNull()
		.references(() => stripeAccount.id),

	// Stripe checkout session details
	stripeCheckoutId: text('stripe_checkout_id').notNull().unique(),

	// Customer information
	stripeCustomerId: text('stripe_customer_id'),
	customerEmail: text('customer_email'),

	// Session details
	mode: checkoutModeEnum('mode').notNull(),
	status: checkoutStatusEnum('status').notNull().default('created'),

	// URLs
	successUrl: text('success_url').notNull(),
	cancelUrl: text('cancel_url').notNull(),
	url: text('url').notNull(),

	// Payment information
	paymentStatus: text('payment_status'),
	amountTotal: text('amount_total'),
	currencyCode: text('currency_code'),

	// Metadata
	metadata: jsonb('metadata'),
	lineItems: jsonb('line_items'),

	// Expiration
	expiresAt: timestamp('expires_at'),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
