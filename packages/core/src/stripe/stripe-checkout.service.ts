export * as StripeCheckoutService from './stripe-checkout.service';

import { Resource } from 'sst';
import { stripeCheckout, checkoutStatusEnum } from './stripe-checkout.sql';
import { StripeCheckoutModel } from './stripe-checkout.model';
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
 * These are functions used to create checkout sessions.
 */

export const create = zod(StripeCheckoutModel.CreateStripeCheckout, async (input) => {
	try {
		// Get the Stripe account
		const stripeAccountRecord = await StripeAccountService.fromId(input.stripeAccountId);
		if (!stripeAccountRecord) {
			throw new Error('Stripe account not found');
		}

		// Create an instance of Stripe with the connected account
		const stripeInstance = new Stripe(
			stripeAccountRecord.stripeAccessToken || Resource.StripeSecretKey.value || '',
			{
				apiVersion: '2025-07-30.basil',
				stripeAccount: stripeAccountRecord.stripeAccountId,
			}
		);

		// Prepare the checkout session data
		const sessionData: Stripe.Checkout.SessionCreateParams = {
			mode: input.mode,
			success_url: input.successUrl,
			cancel_url: input.cancelUrl,
			line_items: input.lineItems.map((item) => ({
				price: item.price,
				quantity: item.quantity,
			})),
			metadata: {
				userId: input.userId,
				...(input.metadata || {}),
			},
		};

		// Add customer email if provided
		if (input.customerEmail) {
			sessionData.customer_email = input.customerEmail;
		}

		// Add expiration if provided
		if (input.expiresAt) {
			const expiresAt = new Date();
			expiresAt.setMinutes(expiresAt.getMinutes() + input.expiresAt);
			sessionData.expires_at = Math.floor(expiresAt.getTime() / 1000);
		}

		// Create the checkout session in Stripe
		const checkoutSession = await stripeInstance.checkout.sessions.create(sessionData);

		// Store the checkout session in the database
		return db.transaction(async (tx) => {
			const result = await tx
				.insert(stripeCheckout)
				.values({
					id: createId(),
					userId: input.userId,
					stripeAccountId: input.stripeAccountId,
					stripeCheckoutId: checkoutSession.id,
					stripeCustomerId: checkoutSession.customer?.toString() || null,
					customerEmail: checkoutSession.customer_email || null,
					mode: checkoutSession.mode,
					status: 'created',
					successUrl: checkoutSession.success_url || '',
					cancelUrl: checkoutSession.cancel_url || '',
					url: checkoutSession.url || '',
					paymentStatus: checkoutSession.payment_status || null,
					amountTotal: checkoutSession.amount_total
						? String(checkoutSession.amount_total / 100)
						: null,
					currencyCode: checkoutSession.currency || null,
					metadata: checkoutSession.metadata || null,
					lineItems: input.lineItems,
					expiresAt: checkoutSession.expires_at
						? new Date(checkoutSession.expires_at * 1000)
						: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning()
				.execute();
			return result[0];
		});
	} catch (error) {
		console.error('Error creating Stripe checkout session:', error);
		throw error;
	}
});

/** Getters
 *
 * These are functions used to get checkout session information from the database.
 */

export const fromId = zod(StripeCheckoutModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeCheckout)
			.where(eq(stripeCheckout.id, id))
			.execute();
		return result[0];
	});
});

export const fromStripeCheckoutId = zod(
	StripeCheckoutModel.Schema.shape.stripeCheckoutId,
	async (stripeCheckoutId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(stripeCheckout)
				.where(eq(stripeCheckout.stripeCheckoutId, stripeCheckoutId))
				.execute();
			return result[0];
		});
	}
);

export const listByUserId = zod(StripeCheckoutModel.Schema.shape.userId, async (userId) => {
	return db.transaction(async (tx) => {
		return tx.select().from(stripeCheckout).where(eq(stripeCheckout.userId, userId)).execute();
	});
});

export const listByStripeAccountId = zod(
	StripeCheckoutModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripeCheckout)
				.where(eq(stripeCheckout.stripeAccountId, stripeAccountId))
				.execute();
		});
	}
);

/** Updaters
 *
 * These are functions used to update checkout sessions.
 */

export const updateStatus = zod(
	z.object({
		stripeCheckoutId: z.string(),
		status: z.enum(checkoutStatusEnum.enumValues),
		paymentStatus: z.string().optional(),
		amountTotal: z.string().optional(),
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(stripeCheckout)
				.set({
					status: input.status as any,
					paymentStatus: input.paymentStatus ?? null,
					amountTotal: input.amountTotal ?? null,
					updatedAt: new Date(),
				})
				.where(eq(stripeCheckout.stripeCheckoutId, input.stripeCheckoutId as string))
				.returning()
				.execute();
			return result[0];
		});
	}
);

/** Utility Functions
 *
 * These are helper functions for working with Stripe Checkout sessions.
 */

// Retrieve and sync a checkout session from Stripe
export const retrieveAndSync = zod(
	StripeCheckoutModel.Schema.shape.stripeCheckoutId,
	async (stripeCheckoutId) => {
		try {
			// First get the current checkout session
			const currentCheckout = await fromStripeCheckoutId(stripeCheckoutId);
			if (!currentCheckout) {
				throw new Error('Checkout session not found');
			}

			// Get the Stripe account
			const stripeAccountRecord = await StripeAccountService.fromId(
				currentCheckout.stripeAccountId
			);
			if (!stripeAccountRecord) {
				throw new Error('Stripe account not found');
			}

			// Create an instance of Stripe with the connected account
			const stripeInstance = new Stripe(
				stripeAccountRecord.stripeAccessToken || Resource.StripeSecretKey.value || '',
				{
					apiVersion: '2025-07-30.basil',
					stripeAccount: stripeAccountRecord.stripeAccountId,
				}
			);

			// Retrieve the checkout session from Stripe
			const checkoutSession =
				await stripeInstance.checkout.sessions.retrieve(stripeCheckoutId);

			// Map Stripe status to our status enum
			let status: (typeof checkoutStatusEnum.enumValues)[number] = 'created';

			if (checkoutSession.status === 'complete') {
				status = 'succeeded';
			} else if (checkoutSession.status === 'expired') {
				status = 'expired';
			} else if (checkoutSession.status === 'open') {
				status = 'created';
			}

			// Update our database record
			return updateStatus({
				stripeCheckoutId,
				status,
				paymentStatus: checkoutSession.payment_status || undefined,
				amountTotal: checkoutSession.amount_total
					? String(checkoutSession.amount_total / 100)
					: undefined,
			});
		} catch (error) {
			console.error('Error retrieving and syncing checkout session:', error);
			throw error;
		}
	}
);

export const hardDeleteByAccountId = zod(
	StripeAccountModel.Schema.shape.id,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.delete(stripeCheckout)
				.where(eq(stripeCheckout.stripeAccountId, stripeAccountId))
				.returning()
				.execute();
			return result;
		});
	}
);
