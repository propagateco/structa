import { AccentColour, GreyColour } from "@core/utils/colour";
import { DEFAULT_STALE_TIME } from "@core/utils/constants";
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export async function getBranding() {
	const res = await api.branding.$get();
	if (!res.ok) {
		throw new Error(`Failed to get branding: ${res.status} ${res.statusText}`);
	}
	const branding = await res.json();

	// Convert to the properly typed object with Colour instances
	const result = {
		appId: branding.appId,
		icon: branding.icon,
		font: branding.font,
		lightLargeLogo: branding.lightLargeLogo,
		darkLargeLogo: branding.darkLargeLogo,
		colours: {
			accent: new AccentColour(branding.lightAccent),
			grey: new GreyColour(branding.lightGrey3),
		},
		updatedAt: new Date(branding.updatedAt),
		publishedAt: branding.publishedAt ? new Date(branding.publishedAt) : null,
	};

	return result;
}

export const brandingQueryOptions = queryOptions({
	queryKey: ["branding"],
	queryFn: () => getBranding(),
	staleTime: DEFAULT_STALE_TIME,
});
