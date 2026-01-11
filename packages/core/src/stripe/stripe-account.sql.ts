import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { user } from '@/auth/auth.sql';

export const stripeAccount = pgTable('stripe_account', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),

	// Stripe Connect specific fields
	stripeAccountId: text('stripe_account_id').notNull().unique(),
	stripePublishableKey: text('stripe_publishable_key'),
	stripeAccessToken: text('stripe_access_token'),
	stripeRefreshToken: text('stripe_refresh_token'),

	// Account details
	chargesEnabled: boolean('charges_enabled').default(false),
	payoutsEnabled: boolean('payouts_enabled').default(false),
	detailsSubmitted: boolean('details_submitted').default(false),

	// Account metadata from Stripe
	businessType: text('business_type'), // individual, company, non_profit, etc.
	accountType: text('account_type'), // standard, express, custom
	country: text('country'),
	currency: text('currency'),
	email: text('email'),

	// Business profile information
	businessProfileName: text('business_profile_name'), // The customer-facing business name
	businessProfileUrl: text('business_profile_url'), // The business website
	companyName: text('company_name'), // Legal company name for companies
	individualFirstName: text('individual_first_name'), // For individual accounts
	individualLastName: text('individual_last_name'), // For individual accounts

	// Additional metadata (for other fields we might need later)
	accountMetadata: jsonb('account_metadata'), // Additional account details from Stripe

	// Status
	isActive: boolean('is_active').default(true).notNull(),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at'),
});
