import { initTRPC } from "@trpc/server";
import type { Session, User } from "better-auth/types";
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
 * Generate a PostgreSQL transaction ID for Electric sync confirmation
 * This is used to match optimistic updates with their confirmation in the sync stream
 *
 * NOTE: With Neon HTTP connections, we can't use pg_current_xact_id() in the same
 * transaction as our mutations. For the tracer bullet, we'll return a timestamp-based
 * txid that can be matched using the awaitMatch utility instead.
 *
 * Future improvement: Use a connection pooler that supports transactions for true txid matching.
 */
export function generateTxId(): number {
	// Use current timestamp in milliseconds as a pseudo txid
	// This works with the awaitMatch utility in the Electric collection
	return Date.now();
}
