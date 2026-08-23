import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat/conversations/$conversationId")(
	{
		server: {
			handlers: {
				DELETE: async ({
					request,
					params,
				}: {
					request: Request;
					params: { conversationId: string };
				}) => {
					const apiUrl = import.meta.env.VITE_API_URL;
					if (!apiUrl) {
						return Response.json(
							{ message: "Chat backend URL is not configured" },
							{ status: 503 },
						);
					}

					const upstream = await fetch(
						`${apiUrl}/conversations/${encodeURIComponent(params.conversationId)}`,
						{
							method: "DELETE",
							headers: { cookie: request.headers.get("cookie") ?? "" },
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
	},
);
