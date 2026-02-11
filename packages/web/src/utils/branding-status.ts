// TODO: STUB - Replace with actual BrandingModel from @core/branding/branding.model when available
// Currently using stub types until branding model is implemented

export interface BrandingModelStub {
	icon?: string | null;
	publishedAt?: string | null;
	updatedAt: string;
}

// TODO: STUB - Replace with actual AppModel from @core/app/app.model when available
// Currently using stub types until app model is implemented

export interface AppModelStub {
	publishedAt?: string | null;
	updatedAt: string;
}

export interface BrandingStatusInfo {
	type: "success" | "warning" | "info";
	label: string;
	detail: string;
}

/**
 * Get status info based on branding and app state
 * Similar to getProductStatusInfo but for branding/app data
 */
export const getBrandingStatusInfo = (
	branding: BrandingModelStub | null | undefined,
	app: AppModelStub | null | undefined,
): BrandingStatusInfo => {
	// If either data is missing, can't determine status
	if (!branding || !app) {
		return {
			type: "info",
			label: "Loading",
			detail: "Status information is loading.",
		};
	}

	// Both branding and app are published and up to date
	const brandingPublished =
		branding.publishedAt && branding.updatedAt <= branding.publishedAt;
	const appPublished = app.publishedAt && app.updatedAt <= app.publishedAt;

	if (brandingPublished && appPublished) {
		return {
			type: "success",
			label: "Published",
			detail:
				"Branding and app information are published and visible to users.",
		};
	}

	// Either has unpublished changes
	const brandingHasChanges =
		branding.publishedAt && branding.updatedAt > branding.publishedAt;
	const appHasChanges = app.publishedAt && app.updatedAt > app.publishedAt;

	if (brandingHasChanges || appHasChanges) {
		return {
			type: "warning",
			label: "Draft",
			detail: "There are unpublished changes to branding or app information.",
		};
	}

	// Either has never been published
	if (!branding.publishedAt || !app.publishedAt) {
		return {
			type: "info",
			label: "Draft",
			detail: "Branding or app information has not been published yet.",
		};
	}

	// Default case (shouldn't reach here)
	return {
		type: "info",
		label: "Draft",
		detail: "Status unknown.",
	};
};
