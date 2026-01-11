export * as ProductModel from "./product.model";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { product } from "./product.sql";
import { z } from "zod";

// Full select schema
export const Schema = createSelectSchema(product);
export type SchemaType = z.infer<typeof Schema>;

// API Response schema with date transformations - recreated instead of extended
export const Query = z.object({
    id: z.string(),
    userId: z.string(),
    appId: z.string(),
    name: z.string(),
    description: z.string(),
    coverImage: z.string().nullable(),
    durationWeeks: z.number(),
    difficultyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
    daysPerWeek: z.number(),
    trainingStyle: z.enum(["strength", "cardio", "hiit", "yoga", "pilates", "mixed"]),
    prerequisites: z.string().nullable(),
    goals: z.string().nullable(),
    metadata: z.any().nullable(),
    publishedName: z.string().nullable(),
    publishedDescription: z.string().nullable(),
    publishedCoverImage: z.string().nullable(),
    publishedDurationWeeks: z.number().nullable(),
    publishedDifficultyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]).nullable(),
    publishedDaysPerWeek: z.number().nullable(),
    publishedTrainingStyle: z.enum(["strength", "cardio", "hiit", "yoga", "pilates", "mixed"]).nullable(),
    publishedPrerequisites: z.string().nullable(),
    publishedGoals: z.string().nullable(),
    publishedMetadata: z.any().nullable(),
    active: z.boolean(),
    publishedAt: z.union([
        z.string().transform((str) => new Date(str)),
        z.date(),
        z.null()
    ]).nullable(),
    createdAt: z.union([
        z.string().transform((str) => new Date(str)),
        z.date()
    ]),
    updatedAt: z.union([
        z.string().transform((str) => new Date(str)),
        z.date()
    ]),
    deletedAt: z.union([
        z.string().transform((str) => new Date(str)),
        z.date(),
        z.null()
    ]).nullable(),
});
export type QueryType = z.infer<typeof Query>;

// Server-side mutation schema (for database operations)
export const MutateServer = createInsertSchema(product, {
    id: z
        .string()
        .length(24, { message: "Product ID should be 24 characters" }),
    name: z.string().min(1, { message: "Product name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    durationWeeks: z.number().min(4).max(16),
    difficultyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
    daysPerWeek: z.number().min(3).max(7),
    trainingStyle: z.enum([
        "strength",
        "cardio",
        "hiit",
        "yoga",
        "pilates",
        "mixed",
    ]),
    prerequisites: z.string().optional(),
    goals: z.string().optional(),
})
    .partial()
    .omit({
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        publishedAt: true,
    });
export type MutateServerType = z.infer<typeof MutateServer>;

// Client-side mutation schema (for forms and API calls)
export const MutateClient = MutateServer.extend({
    coverImage: z
        .union([z.instanceof(File), z.null(), z.undefined()])
        .optional()
        .describe("Cover image file for upload"),
});
export type MutateClientType = z.infer<typeof MutateClient>;
