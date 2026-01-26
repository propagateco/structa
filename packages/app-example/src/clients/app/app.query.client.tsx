import { DEFAULT_STALE_TIME } from "@core/utils/constants";
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

async function getApp() {
	const res = await api.app.$get();
	if (!res.ok) {
		throw new Error(`Failed to get app: ${res.status} ${res.statusText}`);
	}
	const rawData = await res.json();

	const data = {
		...rawData,
		createdAt: new Date(rawData.createdAt),
		updatedAt: new Date(rawData.updatedAt),
		deletedAt: rawData.deletedAt ? new Date(rawData.deletedAt) : null,
		publishedAt: rawData.publishedAt ? new Date(rawData.publishedAt) : null,
	};

	return data;
}
export const appQueryOptions = queryOptions({
	queryKey: ["app"],
	queryFn: () => getApp(),
	staleTime: DEFAULT_STALE_TIME,
});

export async function getAppPricing() {
	const res = await api.app.pricing.$get();

	if (!res.ok) {
		throw new Error(
			`Failed to get app pricing: ${res.status} ${res.statusText}`,
		);
	}

	return await res.json();
}

export const appPricingQueryOptions = () =>
	queryOptions({
		queryKey: ["sales", "pricing"],
		queryFn: () => getAppPricing(),
		staleTime: DEFAULT_STALE_TIME,
	});
