import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@/lib/trpc";
import { usersRouter } from "@/lib/trpc/users";

/**
 * Combined tRPC router
 */
const appRouter = usersRouter;

export type AppRouter = typeof appRouter;

/**
 * tRPC API route handler
 * Handles all requests to /api/trpc/*
 */
export const Route = createFileRoute("/api/trpc/$")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				return fetchRequestHandler({
					endpoint: "/api/trpc",
					req: request,
					router: appRouter,
					createContext: () => createContext(request),
				});
			},
			POST: async ({ request }: { request: Request }) => {
				return fetchRequestHandler({
					endpoint: "/api/trpc",
					req: request,
					router: appRouter,
					createContext: () => createContext(request),
				});
			},
		},
	},
});
