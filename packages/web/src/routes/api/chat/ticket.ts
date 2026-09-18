import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import {
	mintConversationTicket,
	TICKET_TTL_MS,
} from "@/lib/data-service/ticket";

/**
 * Mints a short-lived signed ticket for the conversation's live WebSocket
 * stream. The server verifies the session AND backend ownership before
 * signing — the browser never supplies the conversation id trustingly.
 */
export const Route = createFileRoute("/api/chat/ticket")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});
				if (!session) return new Response("Unauthorized", { status: 401 });

				const conversationId = new URL(request.url).searchParams.get(
					"conversationId",
				);
				if (!conversationId)
					return new Response("conversationId required", { status: 400 });

				const apiUrl = import.meta.env.VITE_API_URL;
				const token = process.env.DATA_SERVICE_TOKEN;
				if (!apiUrl || !token) {
					return Response.json(
						{ message: "Data service is not configured" },
						{ status: 503 },
					);
				}

				// Ownership check against the user-scoped backend endpoint.
				const ownership = await fetch(
					`${apiUrl}/conversations/${encodeURIComponent(conversationId)}`,
					{
						headers: { cookie: request.headers.get("cookie") ?? "" },
					},
				);
				if (ownership.status === 404) {
					return Response.json(
						{ message: "Conversation not found" },
						{ status: 404 },
					);
				}
				if (!ownership.ok) {
					return Response.json(
						{ message: "Ownership check failed" },
						{ status: 502 },
					);
				}

				const ticket = mintConversationTicket(token, {
					conversationId,
					userId: session.user.id,
				});
				return Response.json({ ticket, expiresIn: TICKET_TTL_MS });
			},
		},
	},
});
