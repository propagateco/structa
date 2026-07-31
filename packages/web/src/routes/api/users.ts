import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import {
	buildElectricUpstreamUrl,
	proxyToElectric,
} from "@/lib/electric-proxy";

/**
 * Users shape proxy route
 *
 * This route proxies requests to Electric Cloud with auth-aware filtering:
 * 1. Validates the user's session via better-auth
 * 2. Only allows users to sync their own profile data
 * 3. Sets server-side shape parameters for security
 *
 * Client usage:
 * ```ts
 * const usersCollection = createCollection(
 *   electricCollectionOptions({
 *     shapeOptions: {
 *       url: '/api/users',
 *     },
 *     getKey: (item) => item.id,
 *   })
 * )
 * ```
 */
export const Route = createFileRoute("/api/users")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				try {
					// Validate session via better-auth
					const session = await auth.api.getSession({
						headers: request.headers,
					});

					console.log("[api/users] Session:", session ? "found" : "not found");

					// Return 401 if not authenticated
					if (!session) {
						return new Response("Unauthorized", { status: 401 });
					}

					// Build Electric URL with user-filtered where clause
					// Users can only see their own profile data
					const whereClause = `id = '${session.user.id}'`;
					const originUrl = await buildElectricUpstreamUrl(
						request,
						"user",
						whereClause,
					);

					console.log("[api/users] Proxying to:", originUrl.toString());

					// Proxy to Electric and return response
					return proxyToElectric(originUrl);
				} catch (error) {
					console.error("[api/users] Error:", error);
					return new Response(
						JSON.stringify({
							error: "Internal server error",
							message: error instanceof Error ? error.message : "Unknown error",
						}),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
