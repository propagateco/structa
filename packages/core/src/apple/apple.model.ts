export * as AppleModel from "./apple.model";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { apple } from "./apple.sql";
import { z } from "zod";

// Full select schema
export const Schema = createSelectSchema(apple);
export type SchemaType = z.infer<typeof Schema>;

// API Response schema with date transformations
export const Query = Schema.extend({
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
  deletedAt: z
    .string()
    .nullable()
    .transform((str) => (str ? new Date(str) : null)),
  lastVerifiedAt: z
    .string()
    .nullable()
    .transform((str) => (str ? new Date(str) : null)),
});
export type QueryType = z.infer<typeof Query>;

// Server-side mutation schema (for database operations)
export const MutateServer = createInsertSchema(apple, {
  keyId: z
    .string()
    .min(1)
    .max(10)
    .regex(
      /^[A-Z0-9]+$/,
      "Key ID must contain only uppercase letters and numbers",
    ),
  issuerId: z.string().uuid("Issuer ID must be a valid UUID"),
  privateKey: z.string().min(1).max(5000),
})
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  });
export type MutateServerType = z.infer<typeof MutateServer>;

// Client-side mutation schema (for forms and API calls)
export const MutateClient = z.object({
  keyId: z
    .string()
    .min(1, "Key ID is required")
    .length(10, "Key ID must be exactly 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Key ID must contain only uppercase letters and numbers",
    ),
  issuerId: z
    .string()
    .min(1, "Issuer ID is required")
    .uuid("Issuer ID must be a valid UUID"),
  privateKey: z
    .string()
    .min(1, "Private key is required")
    .refine(
      (val) =>
        val.includes("BEGIN PRIVATE KEY") && val.includes("END PRIVATE KEY"),
      "Must be a valid .p8 private key content",
    ),
  contractStatus: z.array(z.string()).optional(),
});
export type MutateClientType = z.infer<typeof MutateClient>;

// API Response types - simplified using existing schemas
export const ClientResponse = z.union([
  z.object({ connected: z.literal(false) }),
  Query.pick({
    id: true,
    keyId: true,
    issuerId: true,
    teamId: true,
    accountName: true,
    accountEmail: true,
    lastVerifiedAt: true,
    roles: true,
    contractStatus: true,
  }).extend({ connected: z.literal(true) }),
]);
export type ClientResponseType = z.infer<typeof ClientResponse>;
export type NotConnectedResponseType = Extract<
  ClientResponseType,
  { connected: false }
>;
export type ConnectedResponseType = Extract<
  ClientResponseType,
  { connected: true }
>;

// App metadata
export const App = z.object({
  id: z.string(),
  bundleId: z.string(),
  name: z.string(),
  sku: z.string(),
  primaryLocale: z.string(),
});
export type AppType = z.infer<typeof App>;

// Verification result - conditional schema based on success
export const VerificationResult = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(false),
    error: z.string().optional(),
  }),
  z.object({
    success: z.literal(true),
    teamId: z.string().optional(),
    accountName: z.string().optional(),
    accountEmail: z.string().optional(),
    roles: z.array(z.string()).optional(),
    contractStatus: z.array(z.string()).optional(),
  }),
]);
export type VerificationResultType = z.infer<typeof VerificationResult>;

// Wizard form schema - extend MutateClient and add agreement fields
export const WizardForm = MutateClient.extend({
  paidAppsAgreement: z.boolean(),
  dsaCompliance: z.boolean().optional(),
}).refine((data) => data.paidAppsAgreement === true, {
  message: "You must accept the Paid Apps Agreement to continue",
  path: ["paidAppsAgreement"],
});
export type WizardFormType = z.infer<typeof WizardForm>;
