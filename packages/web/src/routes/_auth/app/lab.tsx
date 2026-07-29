import { createFileRoute, redirect } from "@tanstack/react-router";
import { type FC, lazy, Suspense } from "react";

/**
 * `/app/lab` — development-only prototype sandbox.
 *
 * In production (`!import.meta.env.DEV`) `beforeLoad` redirects to `/app`, so
 * the route never renders. The scene component is also lazy-loaded *behind the
 * same DEV guard*, so Vite eliminates the dynamic import as dead code and leva
 * stays out of the production bundle graph entirely. Verified via
 * `npm run build`.
 *
 * Use this route to prototype interactions (drawing, snapping, etc.) with Leva
 * controls colocated next to the code under test. See
 * `src/components/dev/dev-leva.tsx` for usage patterns.
 */
export const Route = createFileRoute("/_auth/app/lab")({
	beforeLoad: () => {
		if (!import.meta.env.DEV) {
			throw redirect({ to: "/app" });
		}
	},
	component: RouteComponent,
});

const LabScene = import.meta.env.DEV
	? lazy(() => import("@/lab/lab-scene").then((m) => ({ default: m.LabScene })))
	: ((() => null) as FC);

function RouteComponent() {
	return (
		<Suspense fallback={null}>
			<LabScene />
		</Suspense>
	);
}
