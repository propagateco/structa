import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext, router } from "@/lib/trpc";
import { storageRouter } from "@/lib/trpc/storage";
import { usersRouter } from "@/lib/trpc/users";

/**
 * Combined tRPC router
 *
 * Feature routers are namespaced (e.g. trpc.users.update, trpc.storage.*)
 * so new routers (projects, floor plans, ...) can be added without path
 * collisions.
 */
const appRouter = router({
	users: usersRouter,
	storage: storageRouter,
});

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
