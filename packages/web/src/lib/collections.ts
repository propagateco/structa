import { selectUserSchema } from "@core/auth/auth.sql";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { trpc } from "@/lib/trpc-client";

/**
 * Get the API base URL for client-side requests.
 * Returns absolute URL to avoid "Invalid URL" errors during SSR.
 * MUST be called at runtime (not module load time) to ensure window is available.
 */
const getApiBase = (): string => {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	// Fallback for SSR - use platform URL from env
	const platformUrl = import.meta.env.VITE_PLATFORM_URL;
	if (platformUrl) {
		return platformUrl;
	}
	throw new Error(
		"getApiBase() called during SSR without VITE_PLATFORM_URL - ensure collection is only used client-side or set VITE_PLATFORM_URL",
	);
};

/**
 * Users collection with Electric sync
 *
 * This collection syncs the current user's profile data via ElectricSQL.
 * Uses optimistic updates with tRPC mutations and txid-based confirmation.
 *
 * Note: URL is computed lazily via getter to avoid SSR issues with window.location
 *
 * Usage:
 * ```tsx
 * import { usersCollection } from '@/lib/collections';
 * import { useLiveQuery } from '@tanstack/react-db';
 *
 * function UserProfile() {
 *   const { data: users } = useLiveQuery((q) =>
 *     q.from({ user: usersCollection })
 *   );
 *
 *   const currentUser = users[0];
 *
 *   const updateName = (name: string) => {
 *     usersCollection.update(currentUser.id, (draft) => {
 *       draft.name = name;
 *     });
 *   };
 * }
 * ```
 */
export const usersCollection = createCollection(
	electricCollectionOptions({
		id: "users",
		schema: selectUserSchema,
		getKey: (item) => item.id,
		shapeOptions: {
			// Use getter to defer URL construction until sync actually starts (client-side only)
			get url() {
				return `${getApiBase()}/api/users`;
			},
		},
		onUpdate: async ({ transaction }) => {
			const { changes } = transaction.mutations[0];

			// Call tRPC mutation to persist changes
			// @ts-expect-error - tRPC client types need proper router inference
			const result = await trpc.users.update.mutate({
				name: changes.name as string | undefined,
				workspaceName: changes.workspaceName as string | undefined,
				image: changes.image as string | null | undefined,
			});

			// Return txid to wait for sync confirmation
			return { txid: result.txid };
		},
	}),
);
