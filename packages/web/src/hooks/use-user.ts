"use client";

import { useLiveQuery } from "@tanstack/react-db";
import { usersCollection } from "@/lib/collections";

/**
 * Hook to get the current user from the Electric collection with real-time sync.
 * Uses findOne() to get a single user (Electric shape already filters to current user).
 *
 * Returns an object with user data and loading state to match TanStack DB patterns.
 *
 * @returns { user, isLoading } - user is undefined while loading
 *
 * @example
 * const { user, isLoading } = useUser();
 *
 * if (isLoading) return <LoadingScreen />;
 *
 * // Use user data (may be undefined if sync failed)
 * const name = user?.name ?? authUser.name;
 */
export function useUser() {
	const { data: user, isLoading } = useLiveQuery((q) =>
		q.from({ user: usersCollection }).findOne(),
	);

	return { user, isLoading };
}
