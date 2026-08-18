import { conversation } from "@core/conversation/conversation.sql";
import { db } from "@core/drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { buildElectricUpstreamUrl, proxyToElectric } from "@/lib/electric-proxy";

export const quoteSqlLiteral = (value: string): string => `'${value.replaceAll("'", "''")}'`;

export async function chatShapeRequest(
	request: Request,
	table: string,
	where: string,
): Promise<Response> {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return new Response("Unauthorized", { status: 401 });
	return proxyToElectric(await buildElectricUpstreamUrl(request, table, where));
}

export async function chatEventsShapeRequest(request: Request): Promise<Response> {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return new Response("Unauthorized", { status: 401 });
	const sessionId = new URL(request.url).searchParams.get("sessionId");
	if (!sessionId) return new Response("sessionId is required", { status: 400 });

	const owned = await db
		.select({ userId: conversation.userId })
		.from(conversation)
		.where(eq(conversation.id, sessionId))
		.limit(1);
	if (!owned[0]) return new Response("Not found", { status: 404 });
	// Electric's event shape is session-scoped; ownership must be checked before proxying.
	if (owned[0].userId !== session.user.id) {
		return new Response("Forbidden", { status: 403 });
	}
	return proxyToElectric(
		await buildElectricUpstreamUrl(
			request,
			"chat_run_events",
			`session_id = ${quoteSqlLiteral(sessionId)}`,
		),
	);
}
