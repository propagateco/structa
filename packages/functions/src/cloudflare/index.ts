import { verifyConversationTicket } from "./capability";
import { ConversationObject } from "./durable-objects/conversation-object";
import type { DataServiceEnv } from "./env";
import { getInternalToken } from "./env";

export { ConversationObject };

/**
 * DataService entry point.
 *
 * Auth model:
 *  - Service relays (backend/web server) send `Authorization: Bearer <token>`
 *    plus `x-structa-user-id` for the real end-user. Mutation routes (POST
 *    /run) require this.
 *  - Browsers cannot hold the token; the web app mints short-lived HMAC
 *    tickets used for live WebSocket connections and reads.
 *  - When `STRUCTA_INTERNAL_TOKEN` is not configured (dev / feature stages
 *    before the secret is set) the worker stays open, mirroring the original
 *    behaviour, so curl E2E still works.
 */

const ACTOR_HEADER = "x-structa-actor";
const USER_HEADER = "x-structa-user-id";

function bearerToken(request: Request): string | null {
	const header = request.headers.get("Authorization");
	if (!header?.startsWith("Bearer ")) return null;
	const token = header.slice("Bearer ".length).trim();
	return token.length > 0 ? token : null;
}

function actorError(status: 401 | 403 | 503, message: string): Response {
	return Response.json({ message }, { status });
}

export default {
	async fetch(request: Request, env: DataServiceEnv): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/health") {
			return Response.json({ status: "ok" });
		}

		if (!url.pathname.startsWith("/conversations/")) {
			return new Response("Not found", { status: 404 });
		}

		const segments = url.pathname.slice("/conversations/".length).split("/");
		const conversationId = segments[0] ?? "";
		if (!conversationId || conversationId.length === 0) {
			return new Response("Conversation id required", { status: 400 });
		}

		const expectedToken = getInternalToken(env);
		const isService =
			expectedToken !== undefined && bearerToken(request) === expectedToken;

		let userId: string | null = null;
		if (isService) {
			const headerUserId = request.headers.get(USER_HEADER);
			if (headerUserId && headerUserId.length > 0) userId = headerUserId;
		} else if (expectedToken === undefined) {
			// No secret configured — development fallback, keep the worker open.
			const headerUserId = request.headers.get(USER_HEADER);
			userId = headerUserId && headerUserId.length > 0 ? headerUserId : "anon";
		}

		const needsUserId = request.method === "POST" && segments[1] === "run";
		if (needsUserId && !userId) {
			return actorError(401, "Unauthorized");
		}

		if (userId === null) {
			// Try a browser capability ticket (live WS + reads).
			const ticket = url.searchParams.get("ticket");
			if (!ticket || expectedToken === undefined) {
				return actorError(401, "Unauthorized");
			}
			const claims = await verifyConversationTicket(expectedToken, ticket);
			if (!claims || claims.conversationId !== conversationId) {
				return actorError(403, "Forbidden");
			}
			userId = claims.userId;
		}

		try {
			const stub = env.CONVERSATIONS.getByName(conversationId);
			const headers = new Headers(request.headers);
			headers.set(ACTOR_HEADER, JSON.stringify({ conversationId, userId }));
			const proxied = new Request(request, { headers });
			return await stub.fetch(proxied);
		} catch (error) {
			console.error("Conversation Durable Object request failed", {
				conversationId,
				error: error instanceof Error ? error.message : String(error),
			});
			return actorError(503, "Conversation service unavailable");
		}
	},
} satisfies ExportedHandler<DataServiceEnv>;

export type {
	ConversationActor,
	RunRequest,
} from "./durable-objects/conversation-object";
