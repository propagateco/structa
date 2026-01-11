export * as BrandingController from './branding.controller';

import { Resource } from 'sst';
import { UserModel } from '@/user';
import { zod } from '../utils/zod';
import { BrandingModel } from './branding.model';
import { BrandingService } from './branding.service';
import { buildObjectKey } from '@/storage/storage.utils';
import { StorageController } from '@/storage';

export async function updateIconFromAppId({
	appId,
	iconKey,
}: {
	appId: UserModel.UserType['workspaceId'];
	iconKey?: string;
}) {
	console.log('Updating app icon from branding...');

	const oldIconKey = await BrandingService.iconKeyFromId(appId);
	const icon = `${Resource.Cdn.url}/${iconKey}`;

	const user = await BrandingService.updateIconFromAppId({
		appId,
		icon,
	});

	if (oldIconKey) {
		const key = buildObjectKey({
			baseDirectory: 'apps',
			relativeDirectory: `app-${appId}/images`,
			objectName: oldIconKey,
		});
		await StorageController.deleteImagesFromKey(key);
	}

	return user;
}

export async function updateLightLargeLogoFromAppId({
	appId,
	lightLargeLogoKey,
}: {
	appId: UserModel.UserType['workspaceId'];
	lightLargeLogoKey?: string | null;
}) {
	console.log('Updating app light large logo from branding...');

	const oldLightLargeLogoKey = await BrandingService.lightLargeLogoKeyFromId(appId);
	const lightLargeLogo = lightLargeLogoKey ? `${Resource.Cdn.url}/${lightLargeLogoKey}` : null;

	const user = await BrandingService.updateLightLargeLogoFromAppId({
		appId,
		lightLargeLogo,
	});

	if (oldLightLargeLogoKey) {
		const key = buildObjectKey({
			baseDirectory: 'apps',
			relativeDirectory: `app-${appId}/images`,
			objectName: oldLightLargeLogoKey,
		});
		await StorageController.deleteImagesFromKey(key);
	}

	return user;
}

export async function updateDarkLargeLogoFromAppId({
	appId,
	darkLargeLogoKey,
}: {
	appId: UserModel.UserType['workspaceId'];
	darkLargeLogoKey?: string;
}) {
	console.log('Updating app dark large logo from branding...');

	const oldDarkLargeLogoKey = await BrandingService.darkLargeLogoKeyFromId(appId);
	const darkLargeLogoUrl = `${Resource.Cdn.url}/${darkLargeLogoKey}`;

	const user = await BrandingService.updateDarkLargeLogoFromAppId({
		appId,
		darkLargeLogo: darkLargeLogoUrl,
	});

	if (oldDarkLargeLogoKey) {
		const key = buildObjectKey({
			baseDirectory: 'apps',
			relativeDirectory: `app-${appId}/images`,
			objectName: oldDarkLargeLogoKey,
		});
		await StorageController.deleteImagesFromKey(key);
	}

	return user;
}

/**
 * Icon Deletion
 * -------------
 *
 * Removes the app icon by setting it to null in the database
 * and deleting the associated image files from storage.
 */
export async function deleteIconFromAppId({
	appId,
}: {
	appId: UserModel.UserType['workspaceId'];
}) {
	console.log('Deleting app icon from branding...');

	const oldIconKey = await BrandingService.iconKeyFromId(appId);

	// Set icon to null in the database
	const branding = await BrandingService.updateIconFromAppId({
		appId,
		icon: null,
	});

	// Delete the old icon from storage if it exists
	if (oldIconKey) {
		const key = buildObjectKey({
			baseDirectory: 'apps',
			relativeDirectory: `app-${appId}/images`,
			objectName: oldIconKey,
		});
		await StorageController.deleteImagesFromKey(key);
	}

	return branding;
}

/**
 * Light Large Logo Deletion
 * ------------------------
 *
 * Removes the light large logo by setting it to null in the database
 * and deleting the associated image files from storage.
 */
export async function deleteLightLargeLogoFromAppId({
	appId,
}: {
	appId: UserModel.UserType['workspaceId'];
}) {
	console.log('Deleting app light large logo from branding...');

	const oldLightLargeLogoKey = await BrandingService.lightLargeLogoKeyFromId(appId);

	// Set light large logo to null in the database
	const branding = await BrandingService.updateLightLargeLogoFromAppId({
		appId,
		lightLargeLogo: null,
	});

	// Delete the old logo from storage if it exists
	if (oldLightLargeLogoKey) {
		const key = buildObjectKey({
			baseDirectory: 'apps',
			relativeDirectory: `app-${appId}/images`,
			objectName: oldLightLargeLogoKey,
		});
		await StorageController.deleteImagesFromKey(key);
	}

	return branding;
}

/**
 * Publish Branding
 * ----------------
 *
 * Copies all draft branding fields to their published counterparts.
 * This makes the current draft state visible to end users.
 */
export async function publishBranding({
	appId,
}: {
	appId: string;
}) {
	console.log('Publishing branding for app:', appId);

	// Get current branding data
	const currentBranding = await BrandingService.fromAppId(appId);
	
	if (!currentBranding) {
		throw new Error('Branding not found');
	}

	// Import required dependencies
	const { db } = await import('../drizzle');
	const { branding } = await import('./branding.sql');
	const { eq } = await import('drizzle-orm');

	// Update all published fields with current draft values
	const result = await db.transaction(async (tx) => {
		const result = await tx
			.update(branding)
			.set({
				publishedIcon: currentBranding.icon,
				publishedFont: currentBranding.font,
				publishedLightLargeLogo: currentBranding.lightLargeLogo,
				publishedDarkLargeLogo: currentBranding.darkLargeLogo,
				publishedLightAccent: currentBranding.lightAccent,
				publishedLightAccentHigh: currentBranding.lightAccentHigh,
				publishedLightAccentLow: currentBranding.lightAccentLow,
				publishedLightForeground: currentBranding.lightForeground,
				publishedLightBackground: currentBranding.lightBackground,
				publishedLightGrey1: currentBranding.lightGrey1,
				publishedLightGrey2: currentBranding.lightGrey2,
				publishedLightGrey3: currentBranding.lightGrey3,
				publishedLightGrey4: currentBranding.lightGrey4,
				publishedLightGrey5: currentBranding.lightGrey5,
				publishedLightGrey6: currentBranding.lightGrey6,
				publishedLightGrey7: currentBranding.lightGrey7,
				publishedDarkAccent: currentBranding.darkAccent,
				publishedDarkAccentHigh: currentBranding.darkAccentHigh,
				publishedDarkAccentLow: currentBranding.darkAccentLow,
				publishedDarkForeground: currentBranding.darkForeground,
				publishedDarkBackground: currentBranding.darkBackground,
				publishedDarkGrey1: currentBranding.darkGrey1,
				publishedDarkGrey2: currentBranding.darkGrey2,
				publishedDarkGrey3: currentBranding.darkGrey3,
				publishedDarkGrey4: currentBranding.darkGrey4,
				publishedDarkGrey5: currentBranding.darkGrey5,
				publishedDarkGrey6: currentBranding.darkGrey6,
				publishedDarkGrey7: currentBranding.darkGrey7,
				publishedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(branding.appId, appId))
			.returning()
			.execute();
		return result[0];
	});

	return result;
}