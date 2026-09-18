import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";

/**
 * Server-to-server relay for conversation DO events. The browser cannot
 * read events directly from the Worker (no CORS, token held server-side),
 * so this proxy authenticates the session and forwards the request.
 */
export const Route = createFileRoute("/api/chat/stream-events")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});
				if (!session) return new Response("Unauthorized", { status: 401 });

				const url = new URL(request.url);
				const conversationId = url.searchParams.get("conversationId");
				if (!conversationId) {
					return Response.json(
						{ message: "conversationId required" },
						{ status: 400 },
					);
				}

				const afterSeq = Number(url.searchParams.get("afterSeq") ?? "0");
				const dataServiceUrl = import.meta.env.VITE_DATA_SERVICE_URL;
				const token = process.env.DATA_SERVICE_TOKEN;
				if (!dataServiceUrl || !token) {
					return Response.json(
						{ message: "Data service is not configured" },
						{ status: 503 },
					);
				}

				const upstream = await fetch(
					`${dataServiceUrl.replace(/\/$/, "")}/conversations/${encodeURIComponent(conversationId)}/events?afterSeq=${Number.isFinite(afterSeq) && afterSeq > 0 ? afterSeq : 0}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"x-structa-user-id": session.user.id,
						},
					},
				);

				return new Response(upstream.body, {
					status: upstream.status,
					headers: {
						"content-type":
							upstream.headers.get("content-type") ?? "application/json",
					},
				});
			},
		},
	},
});
