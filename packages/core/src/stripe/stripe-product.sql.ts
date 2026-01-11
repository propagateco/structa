import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { user } from '@/auth/auth.sql';
import { stripeAccount } from './stripe-account.sql';
import { product } from '@/product/product.sql';

export const stripeProduct = pgTable('stripe_product', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	stripeAccountId: text('stripe_account_id')
		.notNull()
		.references(() => stripeAccount.id),
	productId: text('product_id').references(() => product.id),

	// Stripe specific fields
	stripeProductId: text('stripe_product_id').notNull().unique(),
	name: text('name').notNull(),
	description: text('description'),
	active: boolean('active').default(true).notNull(),

	// Additional metadata
	images: jsonb('images'),
	metadata: jsonb('metadata'),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at'),
});
