import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				return await auth.handler(request);
			},
			POST: async ({ request }: { request: Request }) => {
				return await auth.handler(request);
			},
			PUT: async ({ request }: { request: Request }) => {
				return await auth.handler(request);
			},
			DELETE: async ({ request }: { request: Request }) => {
				return await auth.handler(request);
			},
			PATCH: async ({ request }: { request: Request }) => {
				return await auth.handler(request);
			},
			HEAD: async ({ request }: { request: Request }) => {
				return await auth.handler(request);
			},
			OPTIONS: async ({ request }: { request: Request }) => {
				return await auth.handler(request);
			},
		},
	},
});
