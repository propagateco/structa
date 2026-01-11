import { type RoutesType } from "@backend/api/api";
import { hc } from "hono/client";

// Client-side: use relative URL (works in browser)
// Server-side: use platform URL from env (works with custom domains via proxy)
const getApiUrl = () => {
    if (typeof window === "undefined") {
        // Server-side: use the platform URL which proxies to API
        return `${process.env.PLATFORM_URL}/api`;
    }
    // Client-side: use relative URL (proxied through same domain)
    return "/api";
};

export const api = hc<RoutesType>(getApiUrl(), {
    init: {
        credentials: "include",
    },
});
