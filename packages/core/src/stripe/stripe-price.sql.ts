import { pgTable, text, timestamp, boolean, jsonb, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { user } from '@/auth/auth.sql';
import { stripeAccount } from './stripe-account.sql';
import { stripeProduct } from './stripe-product.sql';

// Define enum for price types
const PriceType = ['one_time', 'recurring'] as const;
export type PriceType = (typeof PriceType)[number];
export const priceTypeEnum = pgEnum('price_type', PriceType);

// Define enum for price intervals
const PriceInterval = ['day', 'week', 'month', 'year'] as const;
export type PriceInterval = (typeof PriceInterval)[number];
export const priceIntervalEnum = pgEnum('price_interval', PriceInterval);

// Define enum for currencies
const Currency = ['usd', 'eur', 'gbp'] as const;
export type Currency = (typeof Currency)[number];
export const currencyEnum = pgEnum('currency', Currency);

export const stripePrice = pgTable('stripe_price', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	stripeAccountId: text('stripe_account_id')
		.notNull()
		.references(() => stripeAccount.id),
	stripeProductId: text('stripe_product_id').notNull(),
	internalStripeProductId: text('internal_stripe_product_id')
		.notNull()
		.references(() => stripeProduct.id),

	// Stripe specific fields
	stripePriceId: text('stripe_price_id').notNull().unique(),

	// Price details
	nickname: text('nickname'),
	currency: currencyEnum('currency').notNull(),
	unitAmount: numeric('unit_amount', { precision: 10, scale: 2 }).notNull(),

	// Price type and recurring attributes
	type: priceTypeEnum('price_type').notNull(),
	recurring: boolean('recurring').default(false).notNull(),
	interval: priceIntervalEnum('interval'),
	intervalCount: numeric('interval_count', { precision: 10, scale: 0 }),

	// Status
	active: boolean('active').default(true).notNull(),

	// Additional metadata
	metadata: jsonb('metadata'),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at'),
});
