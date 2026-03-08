"use client";

import { useLiveQuery } from "@tanstack/react-db";
import type { SidebarUser } from "@/components/app-sidebar";
import { getImageUrl } from "@/components/ui/image";
import { usersCollection } from "@/lib/collections";

/**
 * Hook to get the current user from the Electric collection with real-time sync.
 * Falls back to auth context if collection is not yet synced.
 */
export function useUser(): SidebarUser | null {
	const { data: users, isLoading } = useLiveQuery((q) =>
		q.from({ user: usersCollection }),
	);

	if (isLoading || !users || users.length === 0) {
		return null;
	}

	const currentUser = users[0];

	return {
		name: currentUser.name,
		email: currentUser.email,
		avatar: currentUser.image
			? getImageUrl(currentUser.image, "?width=400&height=400&format=webp")
			: undefined,
	};
}
