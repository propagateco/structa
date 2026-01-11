import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppleModel } from "@core/apple/apple.model";

/**
 * Apple Account Query Options
 * --------------------------
 *
 * This module provides query options for fetching Apple account data.
 */

export async function getAppleAccount(): Promise<AppleModel.ClientResponseType> {
    try {
        const res = await api.apple.account.$get();
        if (res.status === 404) {
            // No Apple account found - user hasn't connected yet
            return { connected: false };
        }

        if (!res.ok) {
            // Other error occurred
            const errorData = (await res.json()) as { error?: string };
            console.error("Error fetching Apple account:", errorData);
            return { connected: false };
        }

        const data = await res.json();

        // Transform lastVerifiedAt string to Date object if it exists and account is connected
        if (
            data.connected &&
            data.lastVerifiedAt &&
            typeof data.lastVerifiedAt === "string"
        ) {
            data.lastVerifiedAt = new Date(data.lastVerifiedAt);
        }

        // Ensure the response matches our type expectations
        return data as AppleModel.ClientResponseType;
    } catch (error) {
        console.error("Exception fetching Apple account:", error);
        return { connected: false };
    }
}

export const appleAccountQueryOptions = queryOptions({
    queryKey: ["apple", "account"],
    queryFn: () => getAppleAccount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refresh when user returns to window
});

export const appleAppsQueryOptions = queryOptions({
    queryKey: ["apple", "apps"],
    queryFn: async () => {
        const response = await api.apple.apps.$get();
        const data = await response.json();
        return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
});
