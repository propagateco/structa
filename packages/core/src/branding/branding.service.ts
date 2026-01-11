export * as BrandingService from './branding.service';

import { branding } from './branding.sql';
import { BrandingModel } from './branding.model';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { eq } from 'drizzle-orm';

export const create = zod(
	BrandingModel.Branding.partial({
		icon: true,
		font: true,
		lightLargeLogo: true,
		darkLargeLogo: true,
		lightAccent: true,
		lightAccentHigh: true,
		lightAccentLow: true,
		lightForeground: true,
		lightBackground: true,
		lightGrey1: true,
		lightGrey2: true,
		lightGrey3: true,
		lightGrey4: true,
		lightGrey5: true,
		lightGrey6: true,
		lightGrey7: true,
		darkAccent: true,
		darkAccentHigh: true,
		darkAccentLow: true,
		darkForeground: true,
		darkBackground: true,
		darkGrey1: true,
		darkGrey2: true,
		darkGrey3: true,
		darkGrey4: true,
		darkGrey5: true,
		darkGrey6: true,
		darkGrey7: true,
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.insert(branding)
				.values({
					appId: input.appId,
					icon: input.icon ?? null,
					font: 'inter',
					lightLargeLogo: input.lightLargeLogo ?? null,
					darkLargeLogo: input.darkLargeLogo ?? null,
					lightAccent: '#20B8CD',
					lightAccentHigh: '#1d3b14',
					lightAccentLow: '#cbddc6',
					lightForeground: '#151A13',
					lightBackground: '#FFFFFF',
					lightGrey1: '#1F2A1C',
					lightGrey2: '#303C2D',
					lightGrey3: '#4F5C4D',
					lightGrey4: '#82907F',
					lightGrey5: '#BDC4BB',
					lightGrey6: '#EAF0E8',
					lightGrey7: '#F4F7F3',
					darkAccent: '#AAD7A0',
					darkAccentHigh: '#b9d1b2',
					darkAccentLow: '#172912',
					darkForeground: '#FFFFFF',
					darkBackground: '#151A13',
					darkGrey1: '#EAF0E8',
					darkGrey2: '#BDC4BB',
					darkGrey3: '#82907F',
					darkGrey4: '#4F5C4D',
					darkGrey5: '#303C2D',
					darkGrey6: '#1F2A1C',
					darkGrey7: '#F4F7F3',
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning()
				.execute();
			return result[0];
		});
	}
);

/** Getters
 *
 * These are functions used to get branding information from the database.
 */

export const fromAppId = zod(BrandingModel.Schema.shape.appId, async (appId) => {
	return db.transaction(async (tx) => {
		const result = await tx.select().from(branding).where(eq(branding.appId, appId)).execute();
		return result[0];
	});
});

export const iconKeyFromId = zod(BrandingModel.Schema.shape.appId, async (appId) => {
	return db.transaction(async (tx) => {
		const result = await tx.select().from(branding).where(eq(branding.appId, appId)).execute();
		const iconUrl = result[0]?.icon ?? null;
		if (!iconUrl) {
			return null;
		}
		return iconUrl.split('/').pop();
	});
});

export const lightLargeLogoKeyFromId = zod(BrandingModel.Schema.shape.appId, async (appId) => {
	return db.transaction(async (tx) => {
		const result = await tx.select().from(branding).where(eq(branding.appId, appId)).execute();
		const lightLargeLogoUrl = result[0]?.lightLargeLogo ?? null;
		if (!lightLargeLogoUrl) {
			return null;
		}
		return lightLargeLogoUrl.split('/').pop();
	});
});

export const darkLargeLogoKeyFromId = zod(BrandingModel.Schema.shape.appId, async (appId) => {
	return db.transaction(async (tx) => {
		const result = await tx.select().from(branding).where(eq(branding.appId, appId)).execute();
		const darkLargeLogoUrl = result[0]?.darkLargeLogo ?? null;
		if (!darkLargeLogoUrl) {
			return null;
		}
		return darkLargeLogoUrl.split('/').pop();
	});
});

export const getPublishedBranding = zod(BrandingModel.Schema.shape.appId, async (appId) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select({
				appId: branding.appId,
				icon: branding.publishedIcon,
				font: branding.publishedFont,
				lightLargeLogo: branding.publishedLightLargeLogo,
				darkLargeLogo: branding.publishedDarkLargeLogo,
				lightAccent: branding.publishedLightAccent,
				lightAccentHigh: branding.publishedLightAccentHigh,
				lightAccentLow: branding.publishedLightAccentLow,
				lightForeground: branding.publishedLightForeground,
				lightBackground: branding.publishedLightBackground,
				lightGrey1: branding.publishedLightGrey1,
				lightGrey2: branding.publishedLightGrey2,
				lightGrey3: branding.publishedLightGrey3,
				lightGrey4: branding.publishedLightGrey4,
				lightGrey5: branding.publishedLightGrey5,
				lightGrey6: branding.publishedLightGrey6,
				lightGrey7: branding.publishedLightGrey7,
				darkAccent: branding.publishedDarkAccent,
				darkAccentHigh: branding.publishedDarkAccentHigh,
				darkAccentLow: branding.publishedDarkAccentLow,
				darkForeground: branding.publishedDarkForeground,
				darkBackground: branding.publishedDarkBackground,
				darkGrey1: branding.publishedDarkGrey1,
				darkGrey2: branding.publishedDarkGrey2,
				darkGrey3: branding.publishedDarkGrey3,
				darkGrey4: branding.publishedDarkGrey4,
				darkGrey5: branding.publishedDarkGrey5,
				darkGrey6: branding.publishedDarkGrey6,
				darkGrey7: branding.publishedDarkGrey7,
				publishedAt: branding.publishedAt,
				createdAt: branding.createdAt,
				updatedAt: branding.updatedAt,
				deletedAt: branding.deletedAt,
			})
			.from(branding)
			.where(eq(branding.appId, appId))
			.execute();
		return result[0];
	});
});

/** Updaters
 *
 * These are functions used to update branding information in the database.
 */

export const updateFontFromId = zod(
	BrandingModel.Branding.pick({ appId: true, font: true }),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(branding)
				.set({ font: input.font, updatedAt: new Date() })
				.where(eq(branding.appId, input.appId))
				.returning()
				.execute();
			return result[0];
		});
	}
);

export const updateIconFromAppId = zod(
	BrandingModel.Branding.pick({ appId: true, icon: true }),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(branding)
				.set({ icon: input.icon, updatedAt: new Date() })
				.where(eq(branding.appId, input.appId))
				.returning()
				.execute();
			return result[0];
		});
	}
);

export const updateLightLargeLogoFromAppId = zod(
	BrandingModel.Branding.pick({ appId: true, lightLargeLogo: true }),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(branding)
				.set({ lightLargeLogo: input.lightLargeLogo, updatedAt: new Date() })
				.where(eq(branding.appId, input.appId))
				.returning()
				.execute();
			return result[0];
		});
	}
);

export const updateDarkLargeLogoFromAppId = zod(
	BrandingModel.Branding.pick({ appId: true, darkLargeLogo: true }),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(branding)
				.set({ darkLargeLogo: input.darkLargeLogo, updatedAt: new Date() })
				.where(eq(branding.appId, input.appId))
				.returning()
				.execute();
			return result[0];
		});
	}
);

export const updateColoursFromAppId = zod(
	BrandingModel.Colours.extend({
		appId: BrandingModel.Schema.shape.appId,
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(branding)
				.set({
					...input,
					updatedAt: new Date(),
				})
				.where(eq(branding.appId, input.appId))
				.returning()
				.execute();
			return result[0];
		});
	}
);

/** Deleters
 *
 * These are functions used to delete branding information from the database.
 */

export const deleteIconFromAppId = zod(BrandingModel.Schema.shape.appId, async (appId) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.update(branding)
			.set({ icon: null, updatedAt: new Date() })
			.where(eq(branding.appId, appId))
			.returning()
			.execute();
		return result[0];
	});
});

export const deleteLightLargeLogoFromAppId = zod(
	BrandingModel.Schema.shape.appId,
	async (appId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(branding)
				.set({ lightLargeLogo: null, updatedAt: new Date() })
				.where(eq(branding.appId, appId))
				.returning()
				.execute();
			return result[0];
		});
	}
);

export const deleteDarkLargeLogoFromAppId = zod(BrandingModel.Schema.shape.appId, async (appId) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.update(branding)
			.set({ darkLargeLogo: null, updatedAt: new Date() })
			.where(eq(branding.appId, appId))
			.returning()
			.execute();
		return result[0];
	});
});
