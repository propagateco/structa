export * as AppModel from "./app.model";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { app } from "./app.sql";
import { z } from "zod";

// Full select schema
export const Schema = createSelectSchema(app);
export type SchemaType = z.infer<typeof Schema>;

// API Response schema with date transformations
export const Query = Schema.extend({
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
  deletedAt: z
    .string()
    .nullable()
    .transform((str) => (str ? new Date(str) : null)),
  publishedAt: z
    .string()
    .nullable()
    .transform((str) => (str ? new Date(str) : null)),
});
export type QueryType = z.infer<typeof Query>;

// Server-side mutation schema (for database operations)
export const MutateServer = createInsertSchema(app, {
  id: z.string(),
  userId: z.string(),
  name: z.string().min(2, { message: "App name is required" }),
  description: z.string().max(4000, {
    message: "App description should be less than 4000 characters",
  }),
})
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    publishedAt: true,
  });
export type MutateServerType = z.infer<typeof MutateServer>;

// Legacy App export for backward compatibility
export const App = MutateServer;
export type AppType = z.infer<typeof App>;
