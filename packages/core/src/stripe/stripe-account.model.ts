export * as StripeAccountModel from "./stripe-account.model";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { stripeAccount } from "./stripe-account.sql";
import { z } from "zod";

export const Schema = createSelectSchema(stripeAccount, {
  id: z.string(),
  userId: z.string(),
  stripeAccountId: z.string(),
  stripePublishableKey: z.string().optional(),
  stripeAccessToken: z.string().optional(),
  stripeRefreshToken: z.string().optional(),
  chargesEnabled: z.boolean().default(false),
  payoutsEnabled: z.boolean().default(false),
  detailsSubmitted: z.boolean().default(false),
  businessType: z.string().optional(),
  accountType: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  email: z.string().optional(),
  businessProfileName: z.string().optional(),
  businessProfileUrl: z.string().optional(),
  companyName: z.string().optional(),
  individualFirstName: z.string().optional(),
  individualLastName: z.string().optional(),
  accountMetadata: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
});
export type SchemaType = z.infer<typeof Schema>;

export const StripeAccount = Schema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type StripeAccountType = z.infer<typeof StripeAccount>;

// For OAuth responses from Stripe Connect
export const StripeConnectResponse = z.object({
  code: z.string(),
  state: z.string().optional(),
});
export type StripeConnectResponseType = z.infer<typeof StripeConnectResponse>;

// For updates to Stripe Account
export const StripeAccountUpdate = Schema.pick({
  chargesEnabled: true,
  payoutsEnabled: true,
  detailsSubmitted: true,
  businessType: true,
  accountType: true,
  country: true,
  currency: true,
  email: true,
  businessProfileName: true,
  businessProfileUrl: true,
  companyName: true,
  individualFirstName: true,
  individualLastName: true,
  accountMetadata: true,
  isActive: true,
}).partial();
export type StripeAccountUpdateType = z.infer<typeof StripeAccountUpdate>;

// API Response types
export const StripeAccountApiResponse = z.object({
  id: z.string(),
  stripeAccountId: z.string(),
  chargesEnabled: z.boolean().nullable(),
  payoutsEnabled: z.boolean().nullable(),
  detailsSubmitted: z.boolean().nullable(),
  businessType: z.string().nullable(),
  accountType: z.string().nullable(),
  country: z.string().nullable(),
  currency: z.string().nullable(),
  email: z.string().nullable(),
  businessName: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]),
});
export type StripeAccountApiResponseType = z.infer<
  typeof StripeAccountApiResponse
>;

// Client-side response types for connected/disconnected states
export const StripeAccountConnectedResponse = StripeAccountApiResponse.extend({
  connected: z.literal(true),
});
export type StripeAccountConnectedResponseType = z.infer<
  typeof StripeAccountConnectedResponse
>;

export const StripeAccountDisconnectedResponse = z.object({
  connected: z.literal(false),
  error: z.string().optional(),
});
export type StripeAccountDisconnectedResponseType = z.infer<
  typeof StripeAccountDisconnectedResponse
>;

export const StripeAccountClientResponse = z.discriminatedUnion("connected", [
  StripeAccountConnectedResponse,
  StripeAccountDisconnectedResponse,
]);
export type StripeAccountClientResponseType = z.infer<
  typeof StripeAccountClientResponse
>;
