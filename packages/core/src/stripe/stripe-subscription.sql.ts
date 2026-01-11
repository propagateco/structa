import { pgTable, text, timestamp, boolean, jsonb, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { user } from '@/auth/auth.sql';
import { stripeAccount } from './stripe-account.sql';
import { stripeCustomer } from './stripe-customer.sql';

// Define enum for subscription status
const SubscriptionStatus = [
	'active',
	'past_due',
	'unpaid',
	'canceled',
	'incomplete',
	'incomplete_expired',
	'trialing',
	'paused',
] as const;
export type SubscriptionStatus = (typeof SubscriptionStatus)[number];
export const subscriptionStatusEnum = pgEnum('subscription_status', SubscriptionStatus);

// Define enum for subscription collection method
const CollectionMethod = ['charge_automatically', 'send_invoice'] as const;
export type CollectionMethod = (typeof CollectionMethod)[number];
export const collectionMethodEnum = pgEnum('collection_method', CollectionMethod);

export const stripeSubscription = pgTable('stripe_subscription', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	stripeAccountId: text('stripe_account_id')
		.notNull()
		.references(() => stripeAccount.id),
	stripeCustomerId: text('stripe_customer_id')
		.notNull()
		.references(() => stripeCustomer.id),

	// Stripe subscription details
	stripeSubscriptionId: text('stripe_subscription_id').notNull(),
	
	// Subscription information
	status: subscriptionStatusEnum('status').notNull(),
	collectionMethod: collectionMethodEnum('collection_method').notNull(),
	
	// Pricing information
	currency: text('currency').notNull(),
	currentPeriodStart: timestamp('current_period_start').notNull(),
	currentPeriodEnd: timestamp('current_period_end').notNull(),
	
	// Trial information
	trialStart: timestamp('trial_start'),
	trialEnd: timestamp('trial_end'),
	
	// Cancellation information
	cancelAt: timestamp('cancel_at'),
	cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
	canceledAt: timestamp('canceled_at'),
	
	// Product information (will be JSON since subscriptions can have multiple items)
	subscriptionItems: jsonb('subscription_items').notNull(), // Array of subscription items
	
	// Billing information
	billingCycleAnchor: timestamp('billing_cycle_anchor'),
	daysUntilDue: numeric('days_until_due'),
	
	// Metadata and additional information
	metadata: jsonb('metadata'),
	description: text('description'),
	
	// Stripe objects
	subscriptionObject: jsonb('subscription_object').notNull(), // The full subscription object from Stripe
	
	// Discount information
	discountObject: jsonb('discount_object'), // Current discount applied to subscription
	
	// Latest invoice
	latestInvoice: text('latest_invoice'), // Stripe invoice ID
	
	// Timestamps
	stripeCreatedAt: timestamp('stripe_created_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});