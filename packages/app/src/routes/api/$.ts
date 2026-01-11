import { createFileRoute } from "@tanstack/react-router";
import { Resource } from "sst";

export const Route = createFileRoute("/api/$")({
    server: {
        handlers: {
            GET: handler,
            POST: handler,
            PUT: handler,
            DELETE: handler,
            PATCH: handler,
            HEAD: handler,
            OPTIONS: handler,
        },
    },
});

async function handler({ request, params }: { request: Request; params: { "*": string } }) {
    try {
        // Extract the path after /api/
        const path = params["*"] || "";
        
        // Build target URL with query parameters
        const url = new URL(request.url);
        const targetUrl = new URL(path, Resource.Domain.api);
        
        // Copy query parameters from original request
        url.searchParams.forEach((value, key) => {
            targetUrl.searchParams.append(key, value);
        });

        // Forward all headers except 'host'
        const headers = new Headers(request.headers);
        headers.delete("host");

        // Make the proxied request
        const response = await fetch(targetUrl.toString(), {
            method: request.method,
            headers,
            body: request.body,
            // @ts-ignore - duplex is needed for streaming request bodies
            duplex: "half",
        });

        // Clean up response headers that can cause issues
        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete("content-encoding");
        responseHeaders.delete("content-length");
        responseHeaders.delete("transfer-encoding");

        // Return the proxied response
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("[Proxy] Error proxying request:", error);
        return new Response(
            JSON.stringify({ error: "Failed to proxy request" }),
            {
                status: 500,
                headers: {
                    "content-type": "application/json",
                },
            }
        );
    }
}
