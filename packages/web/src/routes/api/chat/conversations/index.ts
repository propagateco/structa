import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/api/chat/conversations/")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const session = await auth.api.getSession({ headers: request.headers });
				if (!session) return new Response("Unauthorized", { status: 401 });
				const apiUrl = import.meta.env.VITE_API_URL;
				if (!apiUrl) {
					return Response.json(
						{ message: "Chat backend URL is not configured" },
						{ status: 503 },
					)
				}
				const upstream = await fetch(
					`${apiUrl}/conversations${new URL(request.url).search}`,
					{
						headers: { cookie: request.headers.get("cookie") ?? "" },
					},
				)
				return new Response(upstream.body, {
					status: upstream.status,
					headers: {
						"content-type":
							upstream.headers.get("content-type") ?? "application/json",
					},
				})
			},
		},
	},
});
