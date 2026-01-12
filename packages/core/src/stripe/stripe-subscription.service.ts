export * as StripeSubscriptionService from './stripe-subscription.service';

import { Resource } from 'sst';
import { stripeSubscription } from './stripe-subscription.sql';
import { StripeSubscriptionModel } from './stripe-subscription.model';
import { StripeCustomerService } from './stripe-customer.service';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import Stripe from 'stripe';
import { z } from 'zod';

// Initialize Stripe with the platform account's secret key
const stripe = new Stripe(Resource.StripeSecretKey.value, {
	apiVersion: '2025-07-30.basil',
});

/**
 * Creators
 * -----------
 * 
 * These are functions used to create subscription records.
 */

export const create = zod(StripeSubscriptionModel.CreateStripeSubscription, async (input) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.insert(stripeSubscription)
			.values([
				{
					id: createId(),
					userId: input.userId,
					stripeAccountId: input.stripeAccountId,
					stripeCustomerId: input.stripeCustomerId,
					stripeSubscriptionId: input.stripeSubscriptionId,
					status: input.status,
					collectionMethod: input.collectionMethod,
					currency: input.currency,
					currentPeriodStart: input.currentPeriodStart,
					currentPeriodEnd: input.currentPeriodEnd,
					trialStart: input.trialStart || null,
					trialEnd: input.trialEnd || null,
					cancelAt: input.cancelAt || null,
					cancelAtPeriodEnd: input.cancelAtPeriodEnd || false,
					canceledAt: input.canceledAt || null,
					subscriptionItems: input.subscriptionItems,
					billingCycleAnchor: input.billingCycleAnchor || null,
					daysUntilDue: input.daysUntilDue ? String(input.daysUntilDue) : null,
					metadata: input.metadata || null,
					description: input.description || null,
					subscriptionObject: input.subscriptionObject,
					discountObject: input.discountObject || null,
					latestInvoice: input.latestInvoice || null,
					stripeCreatedAt: input.stripeCreatedAt,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			])
			.returning()
			.execute();
		return result[0];
	});
});

/**
 * Getters
 * -----------
 * 
 * These are functions used to get subscription information from the database.
 */

export const fromId = zod(StripeSubscriptionModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeSubscription)
			.where(eq(stripeSubscription.id, id))
			.execute();
		return result[0];
	});
});

export const fromStripeSubscriptionId = zod(
	StripeSubscriptionModel.Schema.shape.stripeSubscriptionId,
	async (stripeSubscriptionId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(stripeSubscription)
				.where(eq(stripeSubscription.stripeSubscriptionId, stripeSubscriptionId))
				.execute();
			return result[0];
		});
	}
);

export const listByUserId = zod(StripeSubscriptionModel.Schema.shape.userId, async (userId) => {
	return db.transaction(async (tx) => {
		return tx
			.select()
			.from(stripeSubscription)
			.where(eq(stripeSubscription.userId, userId))
			.execute();
	});
});

export const listByStripeAccountId = zod(
	StripeSubscriptionModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripeSubscription)
				.where(eq(stripeSubscription.stripeAccountId, stripeAccountId))
				.execute();
		});
	}
);

export const listByStripeCustomerId = zod(
	StripeSubscriptionModel.Schema.shape.stripeCustomerId,
	async (stripeCustomerId) => {
		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripeSubscription)
				.where(eq(stripeSubscription.stripeCustomerId, stripeCustomerId))
				.execute();
		});
	}
);

/**
 * Updaters
 * -----------
 * 
 * These are functions used to update subscription information.
 */

export const update = zod(StripeSubscriptionModel.UpdateStripeSubscription, async (input) => {
	return db.transaction(async (tx) => {
		const updateData: any = {
			updatedAt: new Date(),
		};

		// Only update fields that are provided
		if (input.status !== undefined) updateData.status = input.status;
		if (input.collectionMethod !== undefined) updateData.collectionMethod = input.collectionMethod;
		if (input.currency !== undefined) updateData.currency = input.currency;
		if (input.currentPeriodStart !== undefined) updateData.currentPeriodStart = input.currentPeriodStart;
		if (input.currentPeriodEnd !== undefined) updateData.currentPeriodEnd = input.currentPeriodEnd;
		if (input.trialStart !== undefined) updateData.trialStart = input.trialStart;
		if (input.trialEnd !== undefined) updateData.trialEnd = input.trialEnd;
		if (input.cancelAt !== undefined) updateData.cancelAt = input.cancelAt;
		if (input.cancelAtPeriodEnd !== undefined) updateData.cancelAtPeriodEnd = input.cancelAtPeriodEnd;
		if (input.canceledAt !== undefined) updateData.canceledAt = input.canceledAt;
		if (input.subscriptionItems !== undefined) updateData.subscriptionItems = input.subscriptionItems;
		if (input.billingCycleAnchor !== undefined) updateData.billingCycleAnchor = input.billingCycleAnchor;
		if (input.daysUntilDue !== undefined) updateData.daysUntilDue = input.daysUntilDue ? String(input.daysUntilDue) : null;
		if (input.metadata !== undefined) updateData.metadata = input.metadata;
		if (input.description !== undefined) updateData.description = input.description;
		if (input.subscriptionObject !== undefined) updateData.subscriptionObject = input.subscriptionObject;
		if (input.discountObject !== undefined) updateData.discountObject = input.discountObject;
		if (input.latestInvoice !== undefined) updateData.latestInvoice = input.latestInvoice;

		const result = await tx
			.update(stripeSubscription)
			.set(updateData)
			.where(eq(stripeSubscription.id, input.id))
			.returning()
			.execute();
		return result[0];
	});
});

/**
 * Webhook Handlers
 * -----------
 * 
 * These are functions used to handle subscription-related webhook events.
 */

// Handle customer.subscription.created webhook event
export const handleSubscriptionCreated = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
		userId: z.string(),
	}),
	async (input) => {
		const subscription = input.event.data.object as Stripe.Subscription;

		// Check if we already have this subscription recorded
		const existingSubscription = await fromStripeSubscriptionId(subscription.id);
		if (existingSubscription) {
			return existingSubscription;
		}

		// Find or create the customer record
		let customerRecord = await StripeCustomerService.fromStripeCustomerId(subscription.customer.toString());
		if (!customerRecord) {
			// If we don't have the customer, we need to create them first
			// Fetch customer data from Stripe to create the record
			const stripeCustomer = await stripe.customers.retrieve(subscription.customer.toString(), {
				stripeAccount: input.stripeAccountId,
			});

			if (stripeCustomer.deleted) {
				throw new Error('Customer has been deleted');
			}

			customerRecord = await StripeCustomerService.create({
				userId: input.userId,
				stripeAccountId: input.stripeAccountId,
				stripeCustomerId: stripeCustomer.id,
				email: stripeCustomer.email || undefined,
				name: stripeCustomer.name || undefined,
				phone: stripeCustomer.phone || undefined,
				addressLine1: stripeCustomer.address?.line1 || undefined,
				addressLine2: stripeCustomer.address?.line2 || undefined,
				addressCity: stripeCustomer.address?.city || undefined,
				addressState: stripeCustomer.address?.state || undefined,
				addressPostalCode: stripeCustomer.address?.postal_code || undefined,
				addressCountry: stripeCustomer.address?.country || undefined,
				currency: stripeCustomer.currency || undefined,
				defaultPaymentMethod: stripeCustomer.default_source?.toString() || stripeCustomer.invoice_settings?.default_payment_method?.toString() || undefined,
				description: stripeCustomer.description || undefined,
				metadata: stripeCustomer.metadata,
				customerObject: stripeCustomer,
				isDeleted: false,
				isDelinquent: stripeCustomer.delinquent || false,
				stripeCreatedAt: new Date(stripeCustomer.created * 1000),
			});
		}

		// Create a new subscription record
		return create({
			userId: input.userId,
			stripeAccountId: input.stripeAccountId,
			stripeCustomerId: customerRecord.id,
			stripeSubscriptionId: subscription.id,
			status: subscription.status,
			collectionMethod: subscription.collection_method,
			currency: subscription.currency,
			// TODO: Get period details from expanded invoice
			currentPeriodStart: new Date(subscription.start_date * 1000),
			currentPeriodEnd: subscription.ended_at ? new Date(subscription.ended_at * 1000) : new Date(),
			trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : undefined,
			trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
			cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : undefined,
			cancelAtPeriodEnd: subscription.cancel_at_period_end,
			canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : undefined,
			subscriptionItems: subscription.items.data,
			billingCycleAnchor: subscription.billing_cycle_anchor ? new Date(subscription.billing_cycle_anchor * 1000) : undefined,
			daysUntilDue: subscription.days_until_due || undefined,
			metadata: subscription.metadata,
			description: subscription.description || undefined,
			subscriptionObject: subscription,
			discountObject: (typeof subscription.discounts?.[0] === 'object' ? subscription.discounts[0] : undefined) || undefined,
			latestInvoice: subscription.latest_invoice?.toString() || undefined,
			stripeCreatedAt: new Date(subscription.created * 1000),
		});
	}
);

// Handle customer.subscription.updated webhook event
export const handleSubscriptionUpdated = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
	}),
	async (input) => {
		const subscription = input.event.data.object as Stripe.Subscription;

		// Find the existing subscription
		const existingSubscription = await fromStripeSubscriptionId(subscription.id);
		if (!existingSubscription) {
			console.error('No matching subscription record found for update');
			return null;
		}

		// Update the subscription record
		return update({
			id: existingSubscription.id,
			status: subscription.status,
			collectionMethod: subscription.collection_method,
			currency: subscription.currency,
			// TODO: Get period details from expanded invoice
			currentPeriodStart: new Date(subscription.start_date * 1000),
			currentPeriodEnd: subscription.ended_at ? new Date(subscription.ended_at * 1000) : new Date(),
			trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : undefined,
			trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
			cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : undefined,
			cancelAtPeriodEnd: subscription.cancel_at_period_end,
			canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : undefined,
			subscriptionItems: subscription.items.data,
			billingCycleAnchor: subscription.billing_cycle_anchor ? new Date(subscription.billing_cycle_anchor * 1000) : undefined,
			daysUntilDue: subscription.days_until_due || undefined,
			metadata: subscription.metadata,
			description: subscription.description || undefined,
			subscriptionObject: subscription,
			discountObject: (typeof subscription.discounts?.[0] === 'object' ? subscription.discounts[0] : undefined) || undefined,
			latestInvoice: subscription.latest_invoice?.toString() || undefined,
		});
	}
);

// Handle customer.subscription.deleted webhook event
export const handleSubscriptionDeleted = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
	}),
	async (input) => {
		const subscription = input.event.data.object as Stripe.Subscription;

		// Find the existing subscription
		const existingSubscription = await fromStripeSubscriptionId(subscription.id);
		if (!existingSubscription) {
			console.error('No matching subscription record found for deletion');
			return null;
		}

		// Update the subscription status to canceled
		return update({
			id: existingSubscription.id,
			status: 'canceled',
			canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : new Date(),
		});
	}
);

/**
 * Cleanup Functions
 * -----------
 * 
 * These are functions used to clean up subscription data.
 */

export const hardDeleteByAccountId = zod(
	StripeSubscriptionModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.delete(stripeSubscription)
				.where(eq(stripeSubscription.stripeAccountId, stripeAccountId))
				.returning()
				.execute();
			return result;
		});
	}
);