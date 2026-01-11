export * as AppPricingService from "./app-pricing.service";

import { appPricing } from "./app-pricing.sql";
import { AppPricingModel } from "./app-pricing.model";
import { zod } from "../utils/zod";
import { db } from "../drizzle";
import { eq, and } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';

export const create = zod(
  AppPricingModel.MutationServer.extend({
    appId: AppPricingModel.Schema.shape.appId,
    userId: AppPricingModel.Schema.shape.userId,
  }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .insert(appPricing)
        .values({
          id: createId(),
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .execute();
      return result[0];
    });
  },
);

export const fromAppId = zod(
  AppPricingModel.Schema.shape.appId,
  async (appId) => {
    const result = await db.transaction(async (tx) => {
      const result = await tx
        .select()
        .from(appPricing)
        .where(and(eq(appPricing.appId, appId), eq(appPricing.isActive, true)))
        .execute();
      return result[0];
    });

    return result;
  },
);

export const fromId = zod(AppPricingModel.Schema.shape.id, async (id) => {
  const result = await db.transaction(async (tx) => {
    const result = await tx
      .select()
      .from(appPricing)
      .where(eq(appPricing.id, id))
      .execute();
    return result[0];
  });

  if (!result) {
    throw new Error("App pricing not found");
  }

  return result;
});

export const updateFromAppId = zod(
  AppPricingModel.MutationServer.extend({
    appId: AppPricingModel.Schema.shape.appId,
    userId: AppPricingModel.Schema.shape.userId,
  }),
  async (input) => {
    const { appId, userId, ...updateData } = input;
    
    return db.transaction(async (tx) => {
      // First try to update existing pricing
      const existing = await tx
        .select()
        .from(appPricing)
        .where(and(eq(appPricing.appId, appId), eq(appPricing.isActive, true)))
        .execute();

      if (existing.length > 0) {
        // Update existing pricing
        const result = await tx
          .update(appPricing)
          .set({
            ...updateData,
            updatedAt: new Date(),
          })
          .where(eq(appPricing.id, existing[0].id))
          .returning()
          .execute();
        return result[0];
      } else {
        // Create new pricing if none exists
        const result = await tx
          .insert(appPricing)
          .values({
            id: createId(),
            appId,
            userId,
            ...updateData,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()
          .execute();
        return result[0];
      }
    });
  },
);

export const deleteFromAppId = zod(
  AppPricingModel.Schema.shape.appId,
  async (appId) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(appPricing)
        .set({
          isActive: false,
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(and(eq(appPricing.appId, appId), eq(appPricing.isActive, true)))
        .returning()
        .execute();
      return result[0];
    });
  },
);