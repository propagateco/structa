import { selectUserSchema } from "@core/auth/auth.sql";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { trpc } from "@/lib/trpc-client";

/**
 * Users collection with Electric sync
 *
 * This collection syncs the current user's profile data via ElectricSQL.
 * Uses optimistic updates with tRPC mutations and txid-based confirmation.
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
			url: "/api/users",
		},
		startSync: true,
		onUpdate: async ({ transaction }) => {
			const { changes } = transaction.mutations[0];

			// Call tRPC mutation to persist changes
			// @ts-expect-error - tRPC client types need proper router inference
			const result = await trpc.users.update.mutate({
				name: changes.name as string | undefined,
				image: changes.image as string | null | undefined,
			});

			// Return txid to wait for sync confirmation
			return { txid: result.txid };
		},
	}),
);
