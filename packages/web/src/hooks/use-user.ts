"use client";

import { useLiveQuery } from "@tanstack/react-db";
import { usersCollection } from "@/lib/collections";

/**
 * Hook to get the current user from the Electric collection with real-time sync.
 * Uses findOne() to get a single user (Electric shape already filters to current user).
 *
 * Returns the raw user data from the collection - consumers should derive
 * what they need (e.g., SidebarUser shape, avatar URL, etc.)
 *
 * @returns The current user or null while loading
 */
export function useUser() {
	// Use findOne() to get a single user - the Electric shape already filters
	// to only the current authenticated user, so there's only one result
	const { data: user, isLoading } = useLiveQuery((q) =>
		q.from({ user: usersCollection }).findOne(),
	);

	if (isLoading || !user) {
		return null;
	}

	// Return the raw user from the collection - stable reference
	return user;
}
