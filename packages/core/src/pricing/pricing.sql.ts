import {
	foreignKey,
	pgTable,
	text,
	numeric,
	timestamp,
	boolean,
	jsonb,
	primaryKey,
	integer,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { user } from '@/auth/auth.sql';

// export const currency = ['usd', 'eur', 'gbp'] as const;
const Currency = ['usd', 'eur', 'gbp'] as const;
export type Currency = (typeof Currency)[number];
export const currencyEnum = pgEnum('currency', Currency);

export const pricing = pgTable('pricing', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	description: text('description'),

	// Prices in smallest currency unit (cents/pennies)
	monthlyPrice: numeric('monthly_price', { precision: 10, scale: 2 }),
	quarterlyPrice: numeric('quarterly_price', { precision: 10, scale: 2 }),
	annualPrice: numeric('annual_price', { precision: 10, scale: 2 }),
	currency: currencyEnum('currency').notNull(),

	// Stripe specific fields
	stripeMonthlyPriceId: text('stripe_monthly_price_id'),
	stripeQuarterlyPriceId: text('stripe_quarterly_price_id'),
	stripeAnnualPriceId: text('stripe_annual_price_id'),

	// Additional subscription details
	features: jsonb('features'), // JSON of features
	isActive: boolean('is_active').default(true).notNull(),

	// Metadata
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at'),
});
