export * as StripePaymentService from './stripe-payment.service';

import { Resource } from 'sst';
import { stripePayment } from './stripe-payment.sql';
import { StripePaymentModel } from './stripe-payment.model';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { StripeAccountService } from './stripe-account.service';
import { StripeAccountModel } from './stripe-account.model';
import { StripeCheckoutService } from './stripe-checkout.service';
import Stripe from 'stripe';
import { z } from 'zod';

// Initialize Stripe with the platform account's secret key
const stripe = new Stripe(Resource.StripeSecretKey.value, {
	apiVersion: '2025-07-30.basil',
});

/** Creators
 *
 * These are functions used to create payment records.
 */

export const create = zod(StripePaymentModel.CreateStripePayment, async (input) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.insert(stripePayment)
			.values([
				{
					id: createId(),
					userId: input.userId,
					stripeAccountId: input.stripeAccountId,
					checkoutId: input.checkoutId || null,
					stripePaymentId: input.stripePaymentId,
					stripePaymentType: input.stripePaymentType,
					stripeCustomerId: input.stripeCustomerId || null,
					amount: String(input.amount),
					currency: input.currency,
					status: input.status,
					paymentObject: input.paymentObject,
					lastError: input.lastError || null,
					metadata: input.metadata || null,
					description: input.description || null,
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

/** Getters
 *
 * These are functions used to get payment information from the database.
 */

export const fromId = zod(StripePaymentModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripePayment)
			.where(eq(stripePayment.id, id))
			.execute();
		return result[0];
	});
});

export const fromStripePaymentId = zod(
	StripePaymentModel.Schema.shape.stripePaymentId,
	async (stripePaymentId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(stripePayment)
				.where(eq(stripePayment.stripePaymentId, stripePaymentId))
				.execute();
			return result[0];
		});
	}
);

export const listByUserId = zod(StripePaymentModel.Schema.shape.userId, async (userId) => {
	return db.transaction(async (tx) => {
		return tx.select().from(stripePayment).where(eq(stripePayment.userId, userId)).execute();
	});
});

export const listByStripeAccountId = zod(
	StripePaymentModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripePayment)
				.where(eq(stripePayment.stripeAccountId, stripeAccountId))
				.execute();
		});
	}
);

export const listByCheckoutId = zod(
	StripePaymentModel.Schema.shape.checkoutId,
	async (checkoutId) => {
		if (!checkoutId) return [];

		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripePayment)
				.where(eq(stripePayment.checkoutId, checkoutId))
				.execute();
		});
	}
);

/** Updaters
 *
 * These are functions used to update payment information.
 */

export const updateStatus = zod(StripePaymentModel.UpdatePaymentStatus, async (input) => {
	return db.transaction(async (tx) => {
		const updateData: any = {
			status: input.status,
			updatedAt: new Date(),
		};

		if (input.lastError !== undefined) {
			updateData.lastError = input.lastError;
		}

		const result = await tx
			.update(stripePayment)
			.set(updateData)
			.where(eq(stripePayment.id, input.id))
			.returning()
			.execute();
		return result[0];
	});
});

/** Webhook Handlers
 *
 * These are functions used to handle payment-related webhook events.
 */

// Handle payment_intent.succeeded webhook event
export const handlePaymentIntentSucceeded = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
	}),
	async (input) => {
		const paymentIntent = input.event.data.object as Stripe.PaymentIntent;

		// Check if we already have this payment recorded
		const existingPayment = await fromStripePaymentId(paymentIntent.id);
		if (existingPayment) {
			// Update the status if needed
			if (existingPayment.status !== 'succeeded') {
				return updateStatus({
					id: existingPayment.id,
					status: 'succeeded',
				});
			}
			return existingPayment;
		}

		// Find the checkout session if this payment is related to one
		let checkoutId: string | undefined = undefined;
		if (paymentIntent.metadata && paymentIntent.metadata.checkout_session_id) {
			const checkout = await StripeCheckoutService.fromStripeCheckoutId(
				paymentIntent.metadata.checkout_session_id
			);
			if (checkout) {
				checkoutId = checkout.id;
			}
		}

		// Find the user ID from the payment metadata or the stripe account
		let userId = paymentIntent.metadata?.userId;
		if (!userId) {
			const stripeAccountRecord = await StripeAccountService.fromId(input.stripeAccountId);
			if (stripeAccountRecord) {
				userId = stripeAccountRecord.userId;
			} else {
				throw new Error('Could not determine user ID for payment');
			}
		}

		// Create a new payment record
		return create({
			userId,
			stripeAccountId: input.stripeAccountId,
			checkoutId,
			stripePaymentId: paymentIntent.id,
			stripePaymentType: 'payment_intent',
			stripeCustomerId: paymentIntent.customer?.toString() || undefined,
			amount: paymentIntent.amount / 100, // Convert from cents to dollars
			currency: paymentIntent.currency,
			status: 'succeeded',
			paymentObject: paymentIntent,
			metadata: paymentIntent.metadata,
			description: paymentIntent.description || undefined,
			stripeCreatedAt: new Date(paymentIntent.created * 1000),
		});
	}
);

// Handle charge.refunded webhook event
export const handleChargeRefunded = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
	}),
	async (input) => {
		const charge = input.event.data.object as Stripe.Charge;

		// Find the related payment intent
		const paymentIntentId = charge.payment_intent?.toString();
		if (!paymentIntentId) {
			console.error('No payment intent ID found for the refunded charge');
			return null;
		}

		// Find the existing payment
		const existingPayment = await fromStripePaymentId(paymentIntentId);
		if (!existingPayment) {
			console.error('No matching payment record found for refund');
			return null;
		}

		// Update the payment status
		const status = charge.refunded ? 'refunded' : 'partially_refunded';
		return updateStatus({
			id: existingPayment.id,
			status,
		});
	}
);

// Handle payment_intent.payment_failed webhook event
export const handlePaymentIntentFailed = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
	}),
	async (input) => {
		const paymentIntent = input.event.data.object as Stripe.PaymentIntent;

		// Check if we already have this payment recorded
		const existingPayment = await fromStripePaymentId(paymentIntent.id);

		// If payment exists, update its status
		if (existingPayment) {
			return updateStatus({
				id: existingPayment.id,
				status: 'failed',
				lastError: paymentIntent.last_payment_error?.message || 'Unknown error',
			});
		}

		// Find the checkout session if this payment is related to one
		let checkoutId: string | undefined = undefined;
		if (paymentIntent.metadata && paymentIntent.metadata.checkout_session_id) {
			const checkout = await StripeCheckoutService.fromStripeCheckoutId(
				paymentIntent.metadata.checkout_session_id
			);
			if (checkout) {
				checkoutId = checkout.id;
			}
		}

		// Find the user ID from the payment metadata or the stripe account
		let userId = paymentIntent.metadata?.userId;
		if (!userId) {
			const stripeAccountRecord = await StripeAccountService.fromId(input.stripeAccountId);
			if (stripeAccountRecord) {
				userId = stripeAccountRecord.userId;
			} else {
				throw new Error('Could not determine user ID for payment');
			}
		}

		// Create a new payment record with failed status
		return create({
			userId,
			stripeAccountId: input.stripeAccountId,
			checkoutId,
			stripePaymentId: paymentIntent.id,
			stripePaymentType: 'payment_intent',
			stripeCustomerId: paymentIntent.customer?.toString() || undefined,
			amount: paymentIntent.amount / 100, // Convert from cents to dollars
			currency: paymentIntent.currency,
			status: 'failed',
			paymentObject: paymentIntent,
			lastError: paymentIntent.last_payment_error?.message || 'Unknown error',
			metadata: paymentIntent.metadata,
			description: paymentIntent.description || undefined,
			stripeCreatedAt: new Date(paymentIntent.created * 1000),
		});
	}
);


export const hardDeleteByAccountId = zod(
	StripeAccountModel.Schema.shape.id,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.delete(stripePayment)
				.where(eq(stripePayment.stripeAccountId, stripeAccountId))
				.returning()
				.execute();
			return result;
		});
	}
);
