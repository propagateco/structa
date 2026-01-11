export * as PricingModel from "./pricing.model";

import { createInsertSchema } from "drizzle-zod";
import { pricing, currencyEnum } from "./pricing.sql";
import { z } from "zod";

export const Schema = createInsertSchema(pricing, {
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  monthlyPrice: z.number().optional(),
  quarterlyPrice: z.number().optional(),
  annualPrice: z.number().optional(),
  currency: z.enum(currencyEnum.enumValues),
  stripeMonthlyPriceId: z.string().optional(),
  stripeQuarterlyPriceId: z.string().optional(),
  stripeAnnualPriceId: z.string().optional(),
  features: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().optional(),
});
export type SchemaType = z.infer<typeof Schema>;

export const Pricing = Schema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type PricingType = z.infer<typeof Pricing>;
