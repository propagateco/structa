import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";
import { Resource } from "sst";

/**
 * Electric Cloud base URL
 * The source_id is passed as a query parameter, not part of the URL
 */
const ELECTRIC_CLOUD_BASE_URL = "https://api.electric-sql.cloud/v1/shape";

/**
 * Get the Electric source ID from SST resources
 * This is the source_id query parameter, not a full URL
 */
export function getElectricSourceId(): string {
    const source = Resource.SyncEngine?.source;
    if (!source) {
        throw new Error(
            `Resource.SyncEngine.source is not available. Got: ${JSON.stringify(Resource.SyncEngine)}. Ensure sst dev is running and ElectricSQL is configured.`,
        );
    }
    return source;
}

/**
 * Get the Electric secret for authentication
 */
export function getElectricSecret(): string {
    const secret = Resource.SyncEngine?.secret;
    if (!secret) {
        throw new Error(
            `Resource.SyncEngine.secret is not available. Got: ${JSON.stringify(Resource.SyncEngine)}. Ensure sst dev is running and ElectricSQL is configured.`,
        );
    }
    return secret;
}

/**
 * Build the upstream Electric URL with proper parameters
 * Only passes through Electric protocol parameters and sets server-side shape config
 */
export function buildElectricUpstreamUrl(
    request: Request,
    table: string,
    whereClause?: string,
): URL {
    const requestUrl = new URL(request.url);
    // Use the Electric Cloud base URL
    const originUrl = new URL(ELECTRIC_CLOUD_BASE_URL);

    // Pass through Electric protocol parameters (offset, handle, live, etc.)
    requestUrl.searchParams.forEach((value, key) => {
        if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
            originUrl.searchParams.set(key, value);
        }
    });

    // Set shape definition server-side (security: these must be controlled by server)
    originUrl.searchParams.set("source_id", getElectricSourceId());
    originUrl.searchParams.set("secret", getElectricSecret());
    originUrl.searchParams.set("table", table);

    if (whereClause) {
        originUrl.searchParams.set("where", whereClause);
    }

    console.debug("[electric-proxy] Built URL:", originUrl.toString());

    return originUrl;
}

/**
 * Proxy a request to Electric Cloud and return the response
 * Handles proper header cleanup for browser compatibility
 */
export async function proxyToElectric(originUrl: URL): Promise<Response> {
    const response = await fetch(originUrl);

    // Clean up headers that would break decoding in the browser
    // See: https://github.com/whatwg/fetch/issues/1729
    const headers = new Headers(response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");

    // Add Vary header for proper cache isolation with cookie-based auth
    headers.set("Vary", "Cookie");

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}
