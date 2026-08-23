import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { chatShapeRequest, quoteSqlLiteral } from "./shape";

export const Route = createFileRoute("/api/chat/sessions")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const session = await auth.api.getSession({ headers: request.headers });
				return session
					? chatShapeRequest(
							request,
							"chat_sessions",
							`user_id = ${quoteSqlLiteral(session.user.id)}`,
						)
					: new Response("Unauthorized", { status: 401 });
			},
		},
	},
});
