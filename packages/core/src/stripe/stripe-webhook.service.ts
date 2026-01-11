export * as StripeWebhookService from './stripe-webhook.service';

import { Resource } from 'sst';
import { stripeWebhook } from './stripe-webhook.sql';
import { StripeWebhookModel } from './stripe-webhook.model';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import Stripe from 'stripe';
import { StripeAccountService } from './stripe-account.service';
import { StripeAccountModel } from './stripe-account.model';
import { z } from 'zod';

// Initialize Stripe with the platform account's secret key
const stripe = new Stripe(Resource.StripeSecretKey.value, {
	apiVersion: '2025-07-30.basil',
});

/** Creators
 *
 * These are functions used to create webhook records.
 */

export const create = zod(
	StripeWebhookModel.StripeWebhook.pick({
		stripeAccountId: true,
		eventId: true,
		eventType: true,
		eventCreated: true,
		payload: true,
		processed: true,
		processingErrors: true,
	}).partial({
		stripeAccountId: true,
		processed: true,
		processingErrors: true,
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.insert(stripeWebhook)
				.values([
					{
						id: createId(),
						stripeAccountId: input.stripeAccountId ?? null,
						eventId: input.eventId,
						eventType: input.eventType,
						eventCreated: input.eventCreated,
						payload: input.payload,
						processed: input.processed ?? false,
						processingErrors: input.processingErrors ?? null,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				])
				.returning()
				.execute();
			return result[0];
		});
	}
);

/** Getters
 *
 * These are functions used to get webhook records from the database.
 */

export const fromId = zod(StripeWebhookModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeWebhook)
			.where(eq(stripeWebhook.id, id))
			.execute();
		return result[0];
	});
});

export const fromEventId = zod(StripeWebhookModel.Schema.shape.eventId, async (eventId) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeWebhook)
			.where(eq(stripeWebhook.eventId, eventId))
			.execute();
		return result[0];
	});
});

/** Updaters
 *
 * These are functions used to update webhook records in the database.
 */

export const markAsProcessed = zod(StripeWebhookModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.update(stripeWebhook)
			.set({
				processed: true,
				updatedAt: new Date(),
			})
			.where(eq(stripeWebhook.id, id))
			.returning()
			.execute();
		return result[0];
	});
});

export const markAsError = zod(
	z.object({
		id: StripeWebhookModel.Schema.shape.id,
		error: z.string(),
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(stripeWebhook)
				.set({
					processed: false,
					processingErrors: input.error,
					updatedAt: new Date(),
				})
				.where(eq(stripeWebhook.id, input.id))
				.returning()
				.execute();
			return result[0];
		});
	}
);

/** Webhook Handling
 *
 * These functions handle Stripe webhook events
 */

export const handleWebhookEvent = zod(
	z.object({
		body: z.string(),
		signature: z.string(),
		endpointSecret: z.string(),
	}),
	async (input) => {
		try {
			// Verify the event
			const event = stripe.webhooks.constructEvent(
				input.body,
				input.signature,
				input.endpointSecret
			) as Stripe.Event;

			// Find the connected account if it exists
			let stripeAccountId = null;
			if (event.account) {
				const account = await StripeAccountService.fromStripeAccountId(event.account);
				if (account) {
					stripeAccountId = account.id;
				}
			} // Create a record of the webhook event
			const webhookRecord = await create({
				stripeAccountId: stripeAccountId || undefined,
				eventId: event.id,
				eventType: event.type,
				eventCreated: new Date(event.created * 1000),
				payload: event as any,
			});

			// Handle different event types
			await processWebhookEvent(webhookRecord.id, event);

			return {
				success: true,
				webhookRecordId: webhookRecord.id,
			};
		} catch (error) {
			console.error('Error handling webhook event:', error);
			throw error;
		}
	}
);

// Process different types of webhook events
async function processWebhookEvent(webhookId: string, event: Stripe.Event) {
	try {
		switch (event.type) {
			case 'account.updated':
				await handleAccountUpdated(event);
				break;

			// Add more event handlers as needed

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		// Mark the webhook as processed
		await markAsProcessed(webhookId);
	} catch (error) {
		console.error(`Error processing webhook ${webhookId}:`, error);
		await markAsError({
			id: webhookId,
			error: error instanceof Error ? error.message : String(error),
		});
	}
}

// Handler for account.updated event
async function handleAccountUpdated(event: Stripe.Event) {
	const account = event.data.object as Stripe.Account;

	if (!account.id) {
		throw new Error('Account ID not found in event data');
	}

	// Extract business profile information
	const businessProfileName = account.business_profile?.name || undefined;
	const businessProfileUrl = account.business_profile?.url || undefined;
	const companyName = account.company?.name || undefined;
	const individualFirstName = account.individual?.first_name || undefined;
	const individualLastName = account.individual?.last_name || undefined;

	// Update the account record in our database
	await StripeAccountService.updateFromStripeEvent({
		stripeAccountId: account.id,
		updates: {
			chargesEnabled: account.charges_enabled,
			payoutsEnabled: account.payouts_enabled,
			detailsSubmitted: account.details_submitted,
			businessType: account.business_type ? String(account.business_type) : undefined,
			accountType: account.type,
			country: account.country,
			currency: account.default_currency,
			email: account.email || undefined,
			businessProfileName: businessProfileName,
			businessProfileUrl: businessProfileUrl,
			companyName: companyName,
			individualFirstName: individualFirstName,
			individualLastName: individualLastName,
			accountMetadata: undefined, // Don't store full account object
		},
	});
}


export const hardDeleteByAccountId = zod(
	StripeAccountModel.Schema.shape.id,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.delete(stripeWebhook)
				.where(eq(stripeWebhook.stripeAccountId, stripeAccountId))
				.returning()
				.execute();
			return result;
		});
	}
);
