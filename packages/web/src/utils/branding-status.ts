// TODO: Replace with actual BrandingModel from @core when available
// Currently using stub types until branding model is implemented

export type BrandingModelStub = {
	icon?: string | null;
	publishedAt?: string | null;
	updatedAt: string;
};

export function getBrandingStatus(
	branding: BrandingModelStub | null | undefined,
): "published" | "draft" | "none" {
	if (!branding) return "none";
	return branding.publishedAt ? "published" : "draft";
}

export function isBrandingPublished(
	branding: BrandingModelStub | null | undefined,
): boolean {
	return getBrandingStatus(branding) === "published";
}

export function isBrandingDraft(
	branding: BrandingModelStub | null | undefined,
): boolean {
	return getBrandingStatus(branding) === "draft";
}
