import {
	foreignKey,
	pgTable,
	text,
	timestamp,
	integer,
	pgEnum,
	jsonb,
} from 'drizzle-orm/pg-core';
import { product } from './product.sql';

// Enum for content types
export const contentTypeEnum = pgEnum('content_type', ['workout', 'audio', 'video', 'assessment']);

export const productContent = pgTable('product_content', {
	id: text('id').primaryKey().notNull(),
	productId: text('product_id')
		.notNull()
		.references(() => product.id),
	
	// Schedule information
	weekNumber: integer('week_number').notNull(), // 1-16
	dayNumber: integer('day_number').notNull(), // 1-7 (Monday-Sunday)
	orderIndex: integer('order_index').notNull().default(0), // For ordering multiple items on same day
	
	// Content information
	contentType: contentTypeEnum('content_type').notNull(),
	contentId: text('content_id'), // ID of the actual content (workout, audio, etc.)
	title: text('title').notNull(),
	description: text('description'),
	duration: integer('duration'), // Duration in minutes
	
	// Additional data
	metadata: jsonb('metadata'), // For storing content-specific data
	
	// Timestamps
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	deletedAt: timestamp('deleted_at'),
});

export const productContentToProduct = foreignKey({
	columns: [productContent.productId],
	foreignColumns: [product.id],
});