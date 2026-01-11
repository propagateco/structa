import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { user } from '@/auth/auth.sql';
import { stripeAccount } from './stripe-account.sql';

export const stripeCustomer = pgTable('stripe_customer', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	stripeAccountId: text('stripe_account_id')
		.notNull()
		.references(() => stripeAccount.id),

	// Stripe customer details
	stripeCustomerId: text('stripe_customer_id').notNull(),
	
	// Customer information
	email: text('email'),
	name: text('name'),
	phone: text('phone'),
	
	// Address information
	addressLine1: text('address_line1'),
	addressLine2: text('address_line2'),
	addressCity: text('address_city'),
	addressState: text('address_state'),
	addressPostalCode: text('address_postal_code'),
	addressCountry: text('address_country'),
	
	// Billing information
	currency: text('currency'),
	defaultPaymentMethod: text('default_payment_method'),
	
	// Customer metadata
	description: text('description'),
	metadata: jsonb('metadata'),
	
	// Customer object from Stripe
	customerObject: jsonb('customer_object').notNull(), // The full customer object from Stripe
	
	// Customer status
	isDeleted: boolean('is_deleted').default(false).notNull(),
	isDelinquent: boolean('is_delinquent').default(false).notNull(),
	
	// Timestamps
	stripeCreatedAt: timestamp('stripe_created_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});