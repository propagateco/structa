import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { chatShapeRequest, quoteSqlLiteral } from "./shape";

export const Route = createFileRoute("/api/chat/messages")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const session = await auth.api.getSession({ headers: request.headers });
				return session
					? chatShapeRequest(
							request,
							"chat_messages",
							`user_id = ${quoteSqlLiteral(session.user.id)}`,
						)
					: new Response("Unauthorized", { status: 401 });
			},
		},
	},
});
