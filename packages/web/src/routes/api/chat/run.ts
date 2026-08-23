import { createFileRoute } from "@tanstack/react-router";

/** Same-origin browser entry point; the backend remains the runtime owner. */
export const Route = createFileRoute("/api/chat/run")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				const apiUrl = import.meta.env.VITE_API_URL;
				if (!apiUrl) {
					return Response.json(
						{ message: "Chat backend URL is not configured" },
						{ status: 503 },
					);
				}

				const upstream = await fetch(`${apiUrl}/chat/run`, {
					method: "POST",
					headers: {
						"content-type": request.headers.get("content-type") ?? "application/json",
						cookie: request.headers.get("cookie") ?? "",
					},
					body: await request.arrayBuffer(),
				});

				return new Response(upstream.body, {
					status: upstream.status,
					headers: {
						"content-type": upstream.headers.get("content-type") ?? "application/json",
					},
				});
			},
		},
	},
});
