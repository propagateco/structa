import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/routes/api/trpc/$";

/**
 * tRPC client for type-safe API calls
 * Uses the /api/trpc endpoint
 */
export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
			// Include credentials for cookie-based auth
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		}),
	],
});

/**
 * Type-safe mutation result with txid for Electric sync confirmation
 */
export interface MutationResult<T = unknown> {
	data: T;
	txid: number;
}
