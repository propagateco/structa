import { auth } from "@/lib/auth";
import {
	buildElectricUpstreamUrl,
	proxyToElectric,
} from "@/lib/electric-proxy";

export const quoteSqlLiteral = (value: string): string =>
	`'${value.replaceAll("'", "''")}'`;

export async function chatShapeRequest(
	request: Request,
	table: string,
	where: string,
): Promise<Response> {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return new Response("Unauthorized", { status: 401 });
	return proxyToElectric(await buildElectricUpstreamUrl(request, table, where));
}

export async function chatEventsShapeRequest(
	request: Request,
): Promise<Response> {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return new Response("Unauthorized", { status: 401 });
	const sessionId = new URL(request.url).searchParams.get("sessionId");
	if (!sessionId) return new Response("sessionId is required", { status: 400 });
	return chatShapeRequest(
		request,
		"chat_run_events",
		`session_id = ${quoteSqlLiteral(sessionId)} AND user_id = ${quoteSqlLiteral(session.user.id)}`,
	);
}
