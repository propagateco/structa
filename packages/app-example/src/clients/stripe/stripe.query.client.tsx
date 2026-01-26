import type { StripeAccountModel } from "@core/stripe";
import { DEFAULT_STALE_TIME } from "@core/utils/constants";
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export async function getStripeAccount(): Promise<StripeAccountModel.StripeAccountClientResponseType> {
	try {
		const res = await api.stripe.account.$get();

		if (!res.ok) {
			// Error occurred
			const errorData = (await res.json()) as { error?: string };
			console.error("Error fetching Stripe account:", errorData);
			return {
				connected: false,
				error: errorData.error || "Failed to fetch Stripe account",
			};
		}

		const data = await res.json();

		// API now returns { connected: false } when not connected
		// or full account data when connected
		if (
			data &&
			typeof data === "object" &&
			"connected" in data &&
			data.connected === false
		) {
			return { connected: false };
		}

		return { ...data, connected: true };
	} catch (error) {
		console.error("Exception fetching Stripe account:", error);
		return { connected: false, error: "Failed to connect to Stripe API" };
	}
}

export const stripeAccountQueryOptions = queryOptions({
	queryKey: ["stripe"],
	queryFn: () => getStripeAccount(),
	refetchOnWindowFocus: true,
	retry: false, // Don't retry failed Stripe account requests
});

export async function getStripeStatus() {
	const res = await api.sales["stripe-status"].$get();

	if (!res.ok) {
		throw new Error(
			`Failed to get Stripe status: ${res.status} ${res.statusText}`,
		);
	}

	return await res.json();
}

export const stripeStatusQueryOptions = queryOptions({
	queryKey: ["sales", "stripe-status"],
	queryFn: () => getStripeStatus(),
	staleTime: DEFAULT_STALE_TIME,
});

export async function getTransactions(params?: {
	limit?: number;
	starting_after?: string;
	ending_before?: string;
}) {
	const res = await api.sales.transactions.$get({
		query: {
			...(params?.limit && { limit: params.limit.toString() }),
			...(params?.starting_after && { starting_after: params.starting_after }),
			...(params?.ending_before && { ending_before: params.ending_before }),
		},
	});

	if (!res.ok) {
		throw new Error(
			`Failed to get transactions: ${res.status} ${res.statusText}`,
		);
	}

	return await res.json();
}

export const transactionsQueryOptions = (params?: {
	limit?: number;
	starting_after?: string;
	ending_before?: string;
}) =>
	queryOptions({
		queryKey: ["sales", "transactions", params],
		queryFn: () => getTransactions(params),
		staleTime: DEFAULT_STALE_TIME,
	});
