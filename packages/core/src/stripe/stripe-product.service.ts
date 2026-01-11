export * as StripeProductService from './stripe-product.service';
import { StripeAccountModel } from './stripe-account.model';

import { Resource } from 'sst';
import { stripeProduct } from './stripe-product.sql';
import { StripeProductModel } from './stripe-product.model';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import Stripe from 'stripe';
import { StripeAccountService } from './stripe-account.service';
import { z } from 'zod';

// Initialize Stripe with the platform account's secret key
const stripe = new Stripe(Resource.StripeSecretKey.value, {
	apiVersion: '2025-07-30.basil',
});

/** Creators
 *
 * These are functions used to create stripe products.
 */

export const create = zod(StripeProductModel.CreateStripeProduct, async (input) => {
	try {
		// Get the Stripe account for creating the product
		const stripeAccountRecord = await StripeAccountService.fromId(input.stripeAccountId);
		if (!stripeAccountRecord) {
			throw new Error('Stripe account not found');
		}

		// Create the product in Stripe
		const stripeInstance = new Stripe(
			stripeAccountRecord.stripeAccessToken || Resource.StripeSecretKey.value || '',
			{
				apiVersion: '2025-07-30.basil',
				stripeAccount: stripeAccountRecord.stripeAccountId,
			}
		);

		const productData: Stripe.ProductCreateParams = {
			name: input.name,
			active: true,
			metadata: {
				userId: input.userId,
				...(input.productId ? { productId: input.productId } : {}),
				...(input.metadata || {}),
			},
		};

		if (input.description) {
			productData.description = input.description;
		}

		if (input.images && input.images.length > 0) {
			productData.images = input.images;
		}

		const stripeProductResult = await stripeInstance.products.create(productData);

		// Store the product in the database
		return db.transaction(async (tx) => {
			const result = await tx
				.insert(stripeProduct)
				.values([
					{
						id: createId(),
						userId: input.userId,
						stripeAccountId: input.stripeAccountId,
						productId: input.productId || null,
						stripeProductId: stripeProductResult.id,
						name: stripeProductResult.name,
						description: stripeProductResult.description || null,
						active: stripeProductResult.active,
						images:
							stripeProductResult.images.length > 0
								? stripeProductResult.images
								: null,
						metadata: stripeProductResult.metadata,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				])
				.returning()
				.execute();
			return result[0];
		});
	} catch (error) {
		console.error('Error creating Stripe product:', error);
		throw error;
	}
});

/** Getters
 *
 * These are functions used to get stripe product information from the database.
 */

export const fromId = zod(StripeProductModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeProduct)
			.where(eq(stripeProduct.id, id))
			.execute();
		return result[0];
	});
});

export const fromStripeProductId = zod(
	StripeProductModel.Schema.shape.stripeProductId,
	async (stripeProductId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(stripeProduct)
				.where(eq(stripeProduct.stripeProductId, stripeProductId))
				.execute();
			return result[0];
		});
	}
);

export const fromProductId = zod(StripeProductModel.Schema.shape.productId, async (productId) => {
	if (!productId) return null;

	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeProduct)
			.where(eq(stripeProduct.productId, productId))
			.execute();
		return result[0];
	});
});

export const listByUserId = zod(StripeProductModel.Schema.shape.userId, async (userId) => {
	return db.transaction(async (tx) => {
		return tx.select().from(stripeProduct).where(eq(stripeProduct.userId, userId)).execute();
	});
});

export const listByStripeAccountId = zod(
	StripeProductModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripeProduct)
				.where(eq(stripeProduct.stripeAccountId, stripeAccountId))
				.execute();
		});
	}
);

/** Updaters
 *
 * These are functions used to update stripe product information.
 */

export const update = zod(
	z.object({
		id: z.string(),
		updates: StripeProductModel.StripeProduct.partial(),
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			// First get the current product
			const currentProduct = await fromId(input.id);
			if (!currentProduct) {
				throw new Error('Product not found');
			}

			// Get the Stripe account
			const stripeAccountRecord = await StripeAccountService.fromId(
				currentProduct.stripeAccountId
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

			const updateData: Stripe.ProductUpdateParams = {};

			if (input.updates.name !== undefined) {
				updateData.name = input.updates.name;
			}

			if (input.updates.description !== undefined) {
				updateData.description = input.updates.description || null;
			}

			if (input.updates.active !== undefined) {
				updateData.active = input.updates.active;
			}

			if (input.updates.images !== undefined) {
				updateData.images = input.updates.images || [];
			}

			if (input.updates.metadata !== undefined) {
				updateData.metadata = input.updates.metadata || {};
			}

			// Only update in Stripe if we have changes
			if (Object.keys(updateData).length > 0) {
				await stripeInstance.products.update(currentProduct.stripeProductId, updateData);
			}

			// Update in our database
			const result = await tx
				.update(stripeProduct)
				.set({
					...input.updates,
					updatedAt: new Date(),
				})
				.where(eq(stripeProduct.id, input.id))
				.returning()
				.execute();
			return result[0];
		});
	}
);

/** Deleters
 *
 * These are functions used to delete stripe products.
 */

export const softDelete = zod(StripeProductModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		// First get the current product
		const currentProduct = await fromId(id);
		if (!currentProduct) {
			throw new Error('Product not found');
		}

		// Get the Stripe account
		const stripeAccountRecord = await StripeAccountService.fromId(
			currentProduct.stripeAccountId
		);
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

		await stripeInstance.products.update(currentProduct.stripeProductId, {
			active: false,
		});

		// Soft delete in our database
		const result = await tx
			.update(stripeProduct)
			.set({
				active: false,
				deletedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(stripeProduct.id, id))
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
				.delete(stripeProduct)
				.where(eq(stripeProduct.stripeAccountId, stripeAccountId))
				.returning()
				.execute();
			return result;
		});
	}
);
