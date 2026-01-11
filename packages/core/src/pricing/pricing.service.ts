export * as PricingService from "./pricing.service";

import { pricing } from "./pricing.sql";
import { PricingModel } from "./pricing.model";
import { zod } from "../utils/zod";
import { db } from "../drizzle";
import { eq, or } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

export const create = zod(
  PricingModel.Pricing.partial({
    id: true,
    description: true,
    monthlyPrice: true,
    quarterlyPrice: true,
    annualPrice: true,
    stripeMonthlyPriceId: true,
    stripeQuarterlyPriceId: true,
    stripeAnnualPriceId: true,
    features: true,
    isActive: true,
  }),
  async (input) => {
    return db.transaction(async (tx) => {
      // Create the values object with string conversions for numeric fields
      const values = {
        id: input.id ?? createId(),
        userId: input.userId,
        name: input.name,
        description: input.description ?? null,
        monthlyPrice:
          input.monthlyPrice !== undefined ? String(input.monthlyPrice) : null,
        quarterlyPrice:
          input.quarterlyPrice !== undefined
            ? String(input.quarterlyPrice)
            : null,
        annualPrice:
          input.annualPrice !== undefined ? String(input.annualPrice) : null,
        currency: input.currency,
        stripeMonthlyPriceId: input.stripeMonthlyPriceId ?? null,
        stripeQuarterlyPriceId: input.stripeQuarterlyPriceId ?? null,
        stripeAnnualPriceId: input.stripeAnnualPriceId ?? null,
        features: input.features ?? null,
        isActive: input.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Execute the insert
      const result = await tx
        .insert(pricing)
        .values(values)
        .returning()
        .execute();
      return result[0];
    });
  },
);

/** Getters
 *
 * These are functions used to get pricing information from the database.
 */

export const fromId = zod(PricingModel.Schema.shape.id, async (id) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .select()
      .from(pricing)
      .where(eq(pricing.id, id))
      .execute();
    return result[0];
  });
});

export const fromUserId = zod(
  PricingModel.Schema.shape.userId,
  async (userId) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .select()
        .from(pricing)
        .where(eq(pricing.userId, userId))
        .orderBy(pricing.updatedAt)
        .execute();
      return result;
    });
  },
);

export const getActiveFromUserId = zod(
  PricingModel.Schema.shape.userId,
  async (userId) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .select()
        .from(pricing)
        .where(eq(pricing.userId, userId))
        .execute();
      // Filter the active ones after executing the query
      return result.filter((item) => item.isActive === true);
    });
  },
);

// When we need to look up pricing by any Stripe price ID
export const fromStripePriceId = zod(z.string(), async (stripePriceId) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .select()
      .from(pricing)
      .where(
        or(
          eq(pricing.stripeMonthlyPriceId, stripePriceId),
          eq(pricing.stripeQuarterlyPriceId, stripePriceId),
          eq(pricing.stripeAnnualPriceId, stripePriceId),
        ),
      )
      .execute();
    return result[0];
  });
});

/** Updaters
 *
 * These are functions used to update pricing information in the database.
 */

export const updatePrices = zod(
  PricingModel.Pricing.pick({
    id: true,
    monthlyPrice: true,
    quarterlyPrice: true,
    annualPrice: true,
    currency: true,
  }).partial({
    monthlyPrice: true,
    quarterlyPrice: true,
    annualPrice: true,
    currency: true,
  }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(pricing)
        .set({
          ...(input.monthlyPrice !== undefined && {
            monthlyPrice: String(input.monthlyPrice),
          }),
          ...(input.quarterlyPrice !== undefined && {
            quarterlyPrice: String(input.quarterlyPrice),
          }),
          ...(input.annualPrice !== undefined && {
            annualPrice: String(input.annualPrice),
          }),
          ...(input.currency !== undefined && { currency: input.currency }),
          updatedAt: new Date(),
        })
        .where(eq(pricing.id, input.id))
        .returning()
        .execute();
      return result[0];
    });
  },
);

export const updateStripeIds = zod(
  PricingModel.Pricing.pick({
    id: true,
    stripeMonthlyPriceId: true,
    stripeQuarterlyPriceId: true,
    stripeAnnualPriceId: true,
  }).partial({
    stripeMonthlyPriceId: true,
    stripeQuarterlyPriceId: true,
    stripeAnnualPriceId: true,
  }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(pricing)
        .set({
          ...(input.stripeMonthlyPriceId !== undefined && {
            stripeMonthlyPriceId: input.stripeMonthlyPriceId,
          }),
          ...(input.stripeQuarterlyPriceId !== undefined && {
            stripeQuarterlyPriceId: input.stripeQuarterlyPriceId,
          }),
          ...(input.stripeAnnualPriceId !== undefined && {
            stripeAnnualPriceId: input.stripeAnnualPriceId,
          }),
          updatedAt: new Date(),
        })
        .where(eq(pricing.id, input.id))
        .returning()
        .execute();
      return result[0];
    });
  },
);

export const updateFeatures = zod(
  PricingModel.Pricing.pick({
    id: true,
    features: true,
  }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(pricing)
        .set({
          features: input.features,
          updatedAt: new Date(),
        })
        .where(eq(pricing.id, input.id))
        .returning()
        .execute();
      return result[0];
    });
  },
);

export const updateStatus = zod(
  PricingModel.Pricing.pick({
    id: true,
    isActive: true,
  }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(pricing)
        .set({
          isActive: input.isActive,
          updatedAt: new Date(),
        })
        .where(eq(pricing.id, input.id))
        .returning()
        .execute();
      return result[0];
    });
  },
);

/** Deleters
 *
 * These are functions used to delete pricing information from the database.
 */

export const softDelete = zod(PricingModel.Schema.shape.id, async (id) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .update(pricing)
      .set({
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(pricing.id, id))
      .returning()
      .execute();
    return result[0];
  });
});
