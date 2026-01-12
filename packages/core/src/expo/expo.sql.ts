import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

/**
 * Expo Table Schema
 * -----------------
 *
 * Stores Expo project configurations for mobile app deployments.
 * Links apps to their corresponding Expo projects and tracks project status.
 */

export const Expo = pgTable('expo', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),

	// App association
	appId: text('app_id').notNull().unique(), // One Expo project per app

	// Project details
	appName: text('app_name').notNull(),
	slug: text('slug').notNull(), // URL-safe version of app name

	// User ownership
	userId: text('user_id').notNull(),

	// EAS integration
	easProjectId: text('eas_project_id'), // EAS project UUID from expo.dev
	projectPath: text('project_path'), // Local file system path to generated project

	// Project status
	status: text('status', { enum: ['creating', 'ready', 'active', 'inactive', 'failed'] })
		.notNull()
		.default('creating'),

	// Timestamps
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

	deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
