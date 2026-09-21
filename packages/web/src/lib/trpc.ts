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
