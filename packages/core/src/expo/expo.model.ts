import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { Expo } from './expo.sql';
import { z } from 'zod';

/**
 * Expo Data Models
 * ----------------
 *
 * Zod schemas for type-safe Expo project data validation and transformation.
 * Generated from the database schema with additional validation rules.
 */

// Base schemas from database
export const Insert = createInsertSchema(Expo, {
	appName: z.string().min(1, 'App name is required').max(100, 'App name too long'),
	slug: z.string().min(2, 'Slug must be at least 2 characters').max(50, 'Slug too long')
		.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
	userId: z.string().min(1, 'User ID is required'),
	status: z.enum(['creating', 'ready', 'active', 'inactive', 'failed']).default('creating'),
});

export const Query = createSelectSchema(Expo);
export const Update = Insert.partial();

// API schemas
export const CreateProject = z.object({
	appId: z.string().min(1, 'App ID is required'),
	appName: z.string().min(1, 'App name is required').max(100, 'App name too long'),
});

export const ProjectResponse = z.object({
	id: z.string(),
	appId: z.string(),
	appName: z.string(),
	slug: z.string(),
	status: z.enum(['creating', 'ready', 'active', 'inactive', 'failed']),
	easProjectId: z.string().nullable(),
	projectPath: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

// Type exports
export type InsertExpo = z.infer<typeof Insert>;
export type SelectExpo = z.infer<typeof Query>;
export type UpdateExpo = z.infer<typeof Update>;
export type CreateProjectInput = z.infer<typeof CreateProject>;
export type ProjectResponseData = z.infer<typeof ProjectResponse>;