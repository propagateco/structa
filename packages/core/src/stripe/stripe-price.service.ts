export * as StripePriceService from './stripe-price.service';

import { Resource } from 'sst';
import { stripePrice } from './stripe-price.sql';
import { StripePriceModel } from './stripe-price.model';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import Stripe from 'stripe';
import { StripeAccountService } from './stripe-account.service';
import { StripeAccountModel } from './stripe-account.model';
import { z } from 'zod';
import { StripeProductService } from './stripe-product.service';

// Initialize Stripe with the platform account's secret key
const stripe = new Stripe(Resource.StripeSecretKey.value, {
	apiVersion: '2025-07-30.basil',
});

/** Creators
 *
 * These are functions used to create stripe prices.
 */

export const create = zod(StripePriceModel.CreateStripePrice, async (input) => {
	try {
		// Get the Stripe account
		const stripeAccountRecord = await StripeAccountService.fromId(input.stripeAccountId);
		if (!stripeAccountRecord) {
			throw new Error('Stripe account not found');
		}

		// Get the Stripe product
		const stripeProductRecord = await StripeProductService.fromId(
			input.internalStripeProductId
		);
		if (!stripeProductRecord) {
			throw new Error('Stripe product not found');
		}

		// Create an instance of Stripe with the connected account
		const stripeInstance = new Stripe(
			stripeAccountRecord.stripeAccessToken || Resource.StripeSecretKey.value || '',
			{
				apiVersion: '2025-07-30.basil',
				stripeAccount: stripeAccountRecord.stripeAccountId,
			}
		);

		// Prepare the price creation data
		const priceData: Stripe.PriceCreateParams = {
			product: stripeProductRecord.stripeProductId,
			currency: input.currency,
			unit_amount: Math.round(input.unitAmount * 100), // Convert to cents
			metadata: {
				userId: input.userId,
				...(input.metadata || {}),
			},
			active: true,
		};

		// Add nickname if provided
		if (input.nickname) {
			priceData.nickname = input.nickname;
		}

		// Add recurring parameters if it's a recurring price
		if (input.recurring && input.interval) {
			priceData.recurring = {
				interval: input.interval,
				interval_count: input.intervalCount || 1,
			};
		}

		// Create the price in Stripe
		const stripePriceResult = await stripeInstance.prices.create(priceData);

		// Store the price in the database
		return db.transaction(async (tx) => {
			const result = await tx
				.insert(stripePrice)
				.values([
					{
						id: createId(),
						userId: input.userId,
						stripeAccountId: input.stripeAccountId,
						stripeProductId: stripeProductRecord.stripeProductId,
						internalStripeProductId: input.internalStripeProductId,
						stripePriceId: stripePriceResult.id,
						nickname: input.nickname || null,
						currency: input.currency,
						unitAmount: input.unitAmount.toString(), // Convert to string
						type: input.recurring ? 'recurring' : 'one_time',
						recurring: input.recurring,
						interval: input.interval || null,
						intervalCount: input.intervalCount ? String(input.intervalCount) : null,
						active: true,
						metadata: stripePriceResult.metadata,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				])
				.returning()
				.execute();
			return result[0];
		});
	} catch (error) {
		console.error('Error creating Stripe price:', error);
		throw error;
	}
});

/** Getters
 *
 * These are functions used to get stripe price information from the database.
 */

export const fromId = zod(StripePriceModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx.select().from(stripePrice).where(eq(stripePrice.id, id)).execute();
		return result[0];
	});
});

export const fromStripePriceId = zod(
	StripePriceModel.Schema.shape.stripePriceId,
	async (stripePriceId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(stripePrice)
				.where(eq(stripePrice.stripePriceId, stripePriceId))
				.execute();
			return result[0];
		});
	}
);

export const listByProductId = zod(
	StripePriceModel.Schema.shape.internalStripeProductId,
	async (internalStripeProductId) => {
		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripePrice)
				.where(eq(stripePrice.internalStripeProductId, internalStripeProductId))
				.execute();
		});
	}
);

export const listByUserId = zod(StripePriceModel.Schema.shape.userId, async (userId) => {
	return db.transaction(async (tx) => {
		return tx.select().from(stripePrice).where(eq(stripePrice.userId, userId)).execute();
	});
});

export const listByStripeAccountId = zod(
	StripePriceModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripePrice)
				.where(eq(stripePrice.stripeAccountId, stripeAccountId))
				.execute();
		});
	}
);

/** Updaters
 *
 * These are functions used to update stripe price information.
 * Note: Stripe doesn't allow updating most price attributes after creation
 * We can only update the metadata and active status
 */

export const update = zod(
	z.object({
		id: z.string(),
		active: z.boolean().optional(),
		metadata: z.record(z.string()).optional(),
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			// First get the current price
			const currentPrice = await fromId(input.id);
			if (!currentPrice) {
				throw new Error('Price not found');
			}

			// Get the Stripe account
			const stripeAccountRecord = await StripeAccountService.fromId(
				currentPrice.stripeAccountId
			);
			if (!stripeAccountRecord) {
				throw new Error('Stripe account not found');
			}

			// Update in Stripe
			const stripeInstance = new Stripe(
				stripeAccountRecord.stripeAccessToken || Resource.StripeSecretKey.value || '',
				{
					apiVersion: '2025-07-30.basil',
					stripeAccount: stripeAccountRecord.stripeAccountId,
				}
			);

			const updateData: Stripe.PriceUpdateParams = {};

			if (input.active !== undefined) {
				updateData.active = input.active;
			}

			if (input.metadata !== undefined) {
				updateData.metadata = input.metadata;
			}

			// Only update in Stripe if we have changes
			if (Object.keys(updateData).length > 0) {
				await stripeInstance.prices.update(currentPrice.stripePriceId, updateData);
			}

			// Update in our database
			const result = await tx
				.update(stripePrice)
				.set({
					active: input.active ?? currentPrice.active,
					metadata: input.metadata ?? currentPrice.metadata,
					updatedAt: new Date(),
				})
				.where(eq(stripePrice.id, input.id))
				.returning()
				.execute();
			return result[0];
		});
	}
);

/** Deleters
 *
 * These are functions used to delete stripe prices.
 * Note: In Stripe, prices are not deleted but deactivated
 */

export const softDelete = zod(StripePriceModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		// First get the current price
		const currentPrice = await fromId(id);
		if (!currentPrice) {
			throw new Error('Price not found');
		}

		// Get the Stripe account
		const stripeAccountRecord = await StripeAccountService.fromId(currentPrice.stripeAccountId);
		if (!stripeAccountRecord) {
			throw new Error('Stripe account not found');
		}

		// Update in Stripe - set to inactive
		const stripeInstance = new Stripe(
			stripeAccountRecord.stripeAccessToken || Resource.StripeSecretKey.value || '',
			{
				apiVersion: '2025-07-30.basil',
				stripeAccount: stripeAccountRecord.stripeAccountId,
			}
		);

		await stripeInstance.prices.update(currentPrice.stripePriceId, {
			active: false,
		});

		// Soft delete in our database
		const result = await tx
			.update(stripePrice)
			.set({
				active: false,
				deletedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(stripePrice.id, id))
			.returning()
			.execute();
		return result[0];
	});
});


export const hardDeleteByAccountId = zod(
	StripeAccountModel.Schema.shape.id,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.delete(stripePrice)
				.where(eq(stripePrice.stripeAccountId, stripeAccountId))
				.returning()
				.execute();
			return result;
		});
	}
);
