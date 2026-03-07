import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { auth } from "@/lib/auth";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session) {
			throw redirect({ to: "/login" as any });
		}

		return await next({
			context: { session: session.session, user: session.user },
		});
	},
);

export const publicAuthMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session) {
			return await next({
				context: { session: null, user: null } as any,
			});
		}

		return await next({
			context: { session: session.session, user: session.user } as any,
		});
	},
);

export const loginMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (session) {
			// Redirect to /app if user has a real plan (not waitlist)
			const hasRealPlan = session.user.plan && session.user.plan !== "waitlist";

			if (hasRealPlan) {
				throw redirect({ to: "/app" as any });
			}

			// Redirect to /onboarding if user is on waitlist or has no plan
			throw redirect({ to: "/onboarding" as any });
		}

		return await next({
			context: { session: null, user: null },
		});
	},
);
