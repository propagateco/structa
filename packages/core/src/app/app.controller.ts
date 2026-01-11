export * as AppController from './app.controller';

import { zod } from '../utils/zod';
import { AppModel } from './app.model';
import { AppService } from './app.service';

export const updateAppFromBrandingPage = zod(
	AppModel.App.pick({ id: true, name: true, description: true }).partial({
		name: true,
		description: true,
	}),
	async (input) => {
		if (!input.id) {
			throw new Error('App ID is required');
		}
		if (input.description && !input.name) {
			const result = await AppService.updateDescriptionFromId({
				id: input.id,
				description: input.description,
			});
			return result;
		}
		if (input.name && !input.description) {
			const result = await AppService.updateNameFromId({ id: input.id, name: input.name });
			return result;
		}
		if (input.name && input.description) {
			const result = await AppService.updateNameAndDescriptionFromId({
				id: input.id,
				name: input.name,
				description: input.description,
			});
			return result;
		}
	}
);

/**
 * Publish App
 * -----------
 *
 * Copies draft app fields (name and description) to their published counterparts.
 * This makes the current draft state visible to end users.
 */
export async function publishApp({
	id,
}: {
	id: string;
}): Promise<AppModel.SchemaType> {
	console.log('Publishing app:', id);

	// Get current app data
	const currentApp = await AppService.fromID(id);
	
	if (!currentApp) {
		throw new Error('App not found');
	}

	// Import required dependencies
	const { db } = await import('../drizzle');
	const { app } = await import('./app.sql');
	const { eq } = await import('drizzle-orm');

	// Update published fields with current draft values
	const result = await db.transaction(async (tx) => {
		const result = await tx
			.update(app)
			.set({
				publishedName: currentApp.name,
				publishedDescription: currentApp.description,
				publishedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(app.id, id))
			.returning()
			.execute();
		return result[0];
	});

	return result;
}
