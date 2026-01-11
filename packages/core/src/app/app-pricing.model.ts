export * as AppPricingModel from "./app-pricing.model";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { appPricing } from "./app-pricing.sql";
import { z } from "zod";

// Full select schema
export const Schema = createSelectSchema(appPricing);
export type SchemaType = z.infer<typeof Schema>;

// API Response schema with date transformations
export const Query = Schema.extend({
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
  deletedAt: z
    .string()
    .nullable()
    .transform((str) => (str ? new Date(str) : null)),
});
export type QueryType = z.infer<typeof Query>;

// Server-side mutation schema (for database operations)
export const MutationServer = createInsertSchema(appPricing).partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type MutationServerType = z.infer<typeof MutationServer>;

// Client-side mutation schema (for forms and API calls)
export const MutationClient = z.object({
  monthlyPrice: z.number().min(0).optional(),
  quarterlyPrice: z.number().min(0).optional(),
  annualPrice: z.number().min(0).optional(),
  currency: z.enum(["usd", "eur", "gbp"]).default("usd"),
});
export type MutationClientType = z.infer<typeof MutationClient>;
