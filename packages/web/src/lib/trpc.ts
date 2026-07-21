import { initTRPC } from "@trpc/server";
import type { Session, User } from "better-auth/types";
import { sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

/**
 * Context for tRPC procedures
 */
export interface Context {
	session: Session | null;
	user: User | null;
}

/**
 * Create tRPC context from request
 */
export async function createContext(request: Request): Promise<Context> {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session) {
		return { session: null, user: null };
	}

	return {
		session: session.session,
		user: session.user,
	};
}

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure that requires authentication
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.session || !ctx.user) {
		throw new Error("UNAUTHORIZED");
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
			user: ctx.user,
		},
	});
});

/**
 * SQL fragment that returns the current Postgres transaction ID as text.
 *
 * The `::xid` cast strips the epoch, giving the raw 32-bit value that Postgres
 * sends in logical replication streams — which is what Electric exposes as
 * `headers.txids` in the sync stream and what TanStack DB's `awaitTxId`
 * matches against.
 *
 * IMPORTANT: This MUST be embedded in the SAME statement as the mutation
 * (e.g. in its RETURNING clause). neon-http runs each statement in its own
 * implicit transaction, so reading `pg_current_xact_id()` in a separate query
 * returns a different txid that never appears in the sync stream — causing
 * `awaitTxId` to stall and time out, rolling back the optimistic update.
 *
 * @see https://tanstack.com/db/latest/docs/collections/electric-collection#debugging
 */
export const pgCurrentTxId = sql<string>`pg_current_xact_id()::xid::text`;
