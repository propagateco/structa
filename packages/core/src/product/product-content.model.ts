export * as ProductContentModel from './product-content.model';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { productContent } from './product-content.sql';
import { z } from 'zod';

// Full select schema
export const Schema = createSelectSchema(productContent);
export type SchemaType = z.infer<typeof Schema>;

// Insert schema (without timestamps)
export const ProductContent = createInsertSchema(productContent).omit({
	createdAt: true,
	updatedAt: true,
	deletedAt: true,
});
export type ProductContentType = z.infer<typeof ProductContent>;

// Update schema
export const UpdateProductContent = ProductContent.partial().omit({
	id: true,
	productId: true,
});
export type UpdateProductContentType = z.infer<typeof UpdateProductContent>;

// Bulk update schema for reordering
export const ReorderProductContent = z.object({
	items: z.array(z.object({
		id: z.string(),
		weekNumber: z.number().min(1).max(16),
		dayNumber: z.number().min(1).max(7),
		orderIndex: z.number().min(0),
	})),
});
export type ReorderProductContentType = z.infer<typeof ReorderProductContent>;

// Form schema for adding content
export const AddProductContentForm = z.object({
	weekNumber: z.number().min(1).max(16),
	dayNumber: z.number().min(1).max(7),
	contentType: z.enum(['workout', 'audio', 'video', 'assessment']),
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().optional(),
	duration: z.number().optional(),
});
export type AddProductContentFormType = z.infer<typeof AddProductContentForm>;