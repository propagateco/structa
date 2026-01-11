import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { stripeAccount } from './stripe-account.sql';

export const stripeWebhook = pgTable('stripe_webhook', {
	id: text('id').primaryKey().notNull(),
	stripeAccountId: text('stripe_account_id').references(() => stripeAccount.id),

	// Webhook details
	eventId: text('event_id').notNull().unique(),
	eventType: text('event_type').notNull(),
	eventCreated: timestamp('event_created').notNull(),

	// Webhook payload
	payload: jsonb('payload').notNull(),

	// Processing status
	processed: boolean('processed').default(false).notNull(),
	processingErrors: text('processing_errors'),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
