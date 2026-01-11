export * as ProductService from "./product.service";

import { product } from "./product.sql";
import { ProductModel } from "./product.model";
import { zod } from "../utils/zod";
import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const create = zod(
  ProductModel.MutateServer.extend({
    userId: ProductModel.Schema.shape.userId,
    appId: ProductModel.Schema.shape.appId,
  }).required({
    userId: true,
    appId: true,
    name: true,
    description: true,
    durationWeeks: true,
    difficultyLevel: true,
    daysPerWeek: true,
    trainingStyle: true,
  }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .insert(product)
        .values({
          id: input.id ?? createId(),
          userId: input.userId,
          appId: input.appId,
          name: input.name,
          description: input.description,
          coverImage: input.coverImage ?? null,
          durationWeeks: input.durationWeeks,
          difficultyLevel: input.difficultyLevel,
          daysPerWeek: input.daysPerWeek,
          trainingStyle: input.trainingStyle,
          prerequisites: input.prerequisites ?? null,
          goals: input.goals ?? null,
          metadata: input.metadata ?? null,
          active: input.active ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .execute();
      return ProductModel.Query.parse(result[0]);
    });
  },
);

/** Getters
 *
 * These are functions used to get product information from the database.
 */

export const fromId = zod(ProductModel.Schema.shape.id, async (id) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .select()
      .from(product)
      .where(eq(product.id, id))
      .execute();
    return result[0];
  });
});

export const fromAppId = zod(ProductModel.Schema.shape.appId, async (appId) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .select()
      .from(product)
      .where(eq(product.appId, appId))
      .orderBy(product.updatedAt)
      .execute();
    return result;
  });
});

export const coverImageKeyFromId = zod(
  ProductModel.Schema.shape.id,
  async (id) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .select()
        .from(product)
        .where(eq(product.id, id))
        .execute();
      const coverImageUrl = result[0]?.coverImage ?? null;
      if (!coverImageUrl) {
        return null;
      }
      return coverImageUrl.split("/").pop();
    });
  },
);

export const update = zod(
  ProductModel.MutateServer.extend({
    id: ProductModel.Schema.shape.id,
  }).required({ id: true }),
  async ({ id, ...input }) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(product)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(product.id, id))
        .returning()
        .execute();
      return ProductModel.Query.parse(result[0]);
    });
  },
);

export const deleteProduct = zod(ProductModel.Schema.shape.id, async (id) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .delete(product)
      .where(eq(product.id, id))
      .returning()
      .execute();
    return ProductModel.Schema.parse(result[0]);
  });
});

/** Publishers
 * -----------
 *
 * These are functions used to publish product information, making draft content visible to end users.
 */

export const publishProductFromId = zod(ProductModel.Schema.shape.id, async (id) => {
  return db.transaction(async (tx) => {
    // First get current product data
    const currentProduct = await tx
      .select()
      .from(product)
      .where(eq(product.id, id))
      .execute();
    
    if (!currentProduct[0]) {
      throw new Error('Product not found');
    }

    const current = currentProduct[0];

    // Update all published fields with current draft values
    const result = await tx
      .update(product)
      .set({
        publishedName: current.name,
        publishedDescription: current.description,
        publishedCoverImage: current.coverImage,
        publishedDurationWeeks: current.durationWeeks,
        publishedDifficultyLevel: current.difficultyLevel,
        publishedDaysPerWeek: current.daysPerWeek,
        publishedTrainingStyle: current.trainingStyle,
        publishedPrerequisites: current.prerequisites,
        publishedGoals: current.goals,
        publishedMetadata: current.metadata,
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(product.id, id))
      .returning()
      .execute();
    
    return ProductModel.Schema.parse(result[0]);
  });
});
