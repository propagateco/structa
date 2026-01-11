import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Prevent aggressive refetching
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
            // Default stale/cache times if not specified in query options
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
        },
    },
});
