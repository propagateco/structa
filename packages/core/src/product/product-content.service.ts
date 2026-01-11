export * as ProductContentService from './product-content.service';

import { productContent } from './product-content.sql';
import { ProductContentModel } from './product-content.model';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

/**
 * Create and Update Functions
 * --------------------------
 *
 * Functions for creating and updating product content
 */

export const create = zod(
	ProductContentModel.ProductContent.pick({
		productId: true,
		weekNumber: true,
		dayNumber: true,
		orderIndex: true,
		contentType: true,
		contentId: true,
		title: true,
		description: true,
		duration: true,
		metadata: true,
	}).partial({
		orderIndex: true,
		contentId: true,
		description: true,
		duration: true,
		metadata: true,
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			// Get the max order index for the day
			const maxOrderResult = await tx
				.select({ maxOrder: productContent.orderIndex })
				.from(productContent)
				.where(
					and(
						eq(productContent.productId, input.productId),
						eq(productContent.weekNumber, input.weekNumber),
						eq(productContent.dayNumber, input.dayNumber)
					)
				)
				.orderBy(productContent.orderIndex)
				.limit(1)
				.execute();

			const maxOrder = maxOrderResult[0]?.maxOrder ?? -1;

			const result = await tx
				.insert(productContent)
				.values({
					id: createId(),
					...input,
					orderIndex: input.orderIndex ?? maxOrder + 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning()
				.execute();
			return ProductContentModel.Schema.parse(result[0]);
		});
	}
);

export const update = zod(
	ProductContentModel.UpdateProductContent.extend({ id: ProductContentModel.Schema.shape.id }),
	async ({ id, ...input }) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(productContent)
				.set({
					...input,
					updatedAt: new Date(),
				})
				.where(eq(productContent.id, id))
				.returning()
				.execute();
			return ProductContentModel.Schema.parse(result[0]);
		});
	}
);

export const reorder = zod(ProductContentModel.ReorderProductContent, async ({ items }) => {
	return db.transaction(async (tx) => {
		const results = await Promise.all(
			items.map((item) =>
				tx
					.update(productContent)
					.set({
						weekNumber: item.weekNumber,
						dayNumber: item.dayNumber,
						orderIndex: item.orderIndex,
						updatedAt: new Date(),
					})
					.where(eq(productContent.id, item.id))
					.returning()
					.execute()
			)
		);
		return results.map((r) => ProductContentModel.Schema.parse(r[0]));
	});
});

export const deleteContent = zod(ProductContentModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.delete(productContent)
			.where(eq(productContent.id, id))
			.returning()
			.execute();
		return ProductContentModel.Schema.parse(result[0]);
	});
});

/**
 * Getter Functions
 * ----------------
 *
 * Functions for retrieving product content
 */

export const fromProductId = zod(ProductContentModel.Schema.shape.productId, async (productId) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(productContent)
			.where(eq(productContent.productId, productId))
			.orderBy(productContent.weekNumber, productContent.dayNumber, productContent.orderIndex)
			.execute();
		return result.map((r) => ProductContentModel.Schema.parse(r));
	});
});

export const fromId = zod(ProductContentModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(productContent)
			.where(eq(productContent.id, id))
			.execute();
		return result[0] ? ProductContentModel.Schema.parse(result[0]) : null;
	});
});
