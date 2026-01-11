import {
	foreignKey,
	pgTable,
	text,
	numeric,
	decimal,
	timestamp,
	boolean,
	jsonb,
	integer,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { app } from '../app/app.sql';
import { user } from '../auth/auth.sql';

// Enums for fitness product types
export const difficultyLevelEnum = pgEnum('difficulty_level', ['beginner', 'intermediate', 'advanced', 'expert']);
export const trainingStyleEnum = pgEnum('training_style', ['strength', 'cardio', 'hiit', 'yoga', 'pilates', 'mixed']);

export const product = pgTable('product', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	appId: text('app_id')
		.notNull()
		.references(() => app.id),
	name: text('name').notNull(),
	description: text('description').notNull(),
	coverImage: text('cover_image'),
	
	// Fitness-specific fields
	durationWeeks: integer('duration_weeks').notNull().default(4),
	difficultyLevel: difficultyLevelEnum('difficulty_level').notNull().default('beginner'),
	daysPerWeek: integer('days_per_week').notNull().default(3),
	trainingStyle: trainingStyleEnum('training_style').notNull().default('mixed'),
	prerequisites: text('prerequisites'),
	goals: text('goals'),
	
	// Additional metadata
	metadata: jsonb('metadata'),
	
	// Published fields
	publishedName: text('published_name'),
	publishedDescription: text('published_description'),
	publishedCoverImage: text('published_cover_image'),
	publishedDurationWeeks: integer('published_duration_weeks'),
	publishedDifficultyLevel: difficultyLevelEnum('published_difficulty_level'),
	publishedDaysPerWeek: integer('published_days_per_week'),
	publishedTrainingStyle: trainingStyleEnum('published_training_style'),
	publishedPrerequisites: text('published_prerequisites'),
	publishedGoals: text('published_goals'),
	publishedMetadata: jsonb('published_metadata'),
	
	active: boolean('active').default(true).notNull(),
	publishedAt: timestamp('published_at'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	deletedAt: timestamp('deleted_at'),
});

export const productToApp = foreignKey({
	columns: [product.appId],
	foreignColumns: [app.id],
});

export const productToUser = foreignKey({
	columns: [product.userId],
	foreignColumns: [user.id],
});
