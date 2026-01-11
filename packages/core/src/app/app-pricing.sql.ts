import {
  foreignKey,
  pgTable,
  text,
  numeric,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { app } from './app.sql';
import { user } from '../auth/auth.sql';

const Currency = ['usd', 'eur', 'gbp'] as const;
export type Currency = (typeof Currency)[number];
export const currencyEnum = pgEnum('app_pricing_currency', Currency);

export const appPricing = pgTable('app_pricing', {
  id: text('id').primaryKey().notNull(),
  appId: text('app_id').notNull(),
  userId: text('user_id').notNull(),

  // Prices stored as numeric with 2 decimal places
  monthlyPrice: numeric('monthly_price', { precision: 10, scale: 2 }),
  quarterlyPrice: numeric('quarterly_price', { precision: 10, scale: 2 }),
  annualPrice: numeric('annual_price', { precision: 10, scale: 2 }),
  currency: currencyEnum('currency').notNull().default('usd'),

  // Stripe product/price IDs for integration
  stripeProductId: text('stripe_product_id'),
  stripeMonthlyPriceId: text('stripe_monthly_price_id'),
  stripeQuarterlyPriceId: text('stripe_quarterly_price_id'),
  stripeAnnualPriceId: text('stripe_annual_price_id'),

  // Status
  isActive: boolean('is_active').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const appPricingToApp = foreignKey({
  columns: [appPricing.appId],
  foreignColumns: [app.id],
});

export const appPricingToUser = foreignKey({
  columns: [appPricing.userId],
  foreignColumns: [user.id],
});