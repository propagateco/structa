import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";
import { Resource } from "sst";

/**
 * Get the Electric Cloud base URL from SST resources
 */
export function getElectricBaseUrl(): string {
	return Resource.SyncEngine.source;
}

/**
 * Get the Electric secret for authentication
 */
export function getElectricSecret(): string {
	return Resource.SyncEngine.secret;
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
	const originUrl = new URL(getElectricBaseUrl());

	// Pass through Electric protocol parameters (offset, handle, live, etc.)
	requestUrl.searchParams.forEach((value, key) => {
		if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
			originUrl.searchParams.set(key, value);
		}
	});

	// Set shape definition server-side (security: these must be controlled by server)
	originUrl.searchParams.set("table", table);
	originUrl.searchParams.set("secret", getElectricSecret());

	if (whereClause) {
		originUrl.searchParams.set("where", whereClause);
	}

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
