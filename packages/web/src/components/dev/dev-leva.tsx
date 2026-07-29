import { lazy, Suspense } from "react";

/**
 * DevLevaPanel — development-only [Leva](https://github.com/pmndrs/leva) controls
 * panel for rapid interaction prototyping.
 *
 * Mount this once near the app shell (see `routes/_auth.tsx`). Leva's store is
 * global, so any `useControls(...)` hook used anywhere in the tree — a
 * component, a hook, a playground route — registers its folder into this
 * single panel. No provider wiring is required per component.
 *
 * Gating:
 *  - `import.meta.env.DEV` → stripped in production builds.
 *  - `lazy()` dynamic import → leva (~120KB gz) lives in its own chunk that
 *    is only ever fetched in dev. In prod the guard is dead code, so Vite never
 *    emits the chunk. Verified via `npm run build` (no `leva` in prod chunks).
 *
 * Prototyping patterns:
 *
 *   // Colocate next to the interaction you're tuning — re-renders on change:
 *   const { snapDist, snapAngle } = useControls("Drawing", {
 *     snapDist: { value: 10, min: 0, max: 50, step: 1 },
 *     snapAngle: { value: 15, min: 0, max: 90, step: 5 },
 *     reset: button(() => reset()),
 *   }, { collapsed: true });
 *
 *   // Canvas / rAF loop (avoid React re-renders per slider tick):
 *   const store = useCreateStore();
 *   // mount once: <LevaPanel store={store} />  (or use the global panel)
 *   // then read inside the loop:  const v = store.get("Drawing.snapDist")
 *
 * Capture winning presets with Leva's built-in JSON import/export (the panel's
 * clipboard button), then paste values back into code as constants.
 */
// Build the lazy wrapper ONLY in dev. Putting `import("leva")` inside the
// `import.meta.env.DEV` ternary means Rollup folds the whole dynamic import
// away as a dead branch in production — so leva never appears in either the
// server or client production bundles. (A render-time guard alone is not
// enough: `lazy(() => import("leva"))` constructed at module top-level keeps
// the dynamic import statically reachable, so the leva chunk still gets
// emitted.) Verified via `npm run build`.
const Leva = import.meta.env.DEV
	? lazy(async () => ({ default: (await import("leva")).Leva }))
	: null;

export function DevLevaPanel() {
	if (!Leva) return null;

	return (
		<Suspense fallback={null}>
			<Leva
				collapsed
				oneLineLabels
				hideCopyButton={false}
				titleBar={{ title: "Prototype", drag: true, filter: true }}
			/>
		</Suspense>
	);
}
