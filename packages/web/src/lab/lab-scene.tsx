import { button, LevaPanel, useControls, useCreateStore } from "leva";
import { PageContainer } from "@/components/layout/page-container";

/**
 * LabScene — dev-only prototype playground mounted at `/app/lab`.
 *
 * Two Leva patterns are demonstrated here; pick whichever fits the interaction
 * you're prototyping:
 *
 *  1. Reactive `useControls` (the `Box` folder) — the component re-renders on
 *     every slider change. Best for React-driven UI where state naturally flows
 *     through the component tree. These register into the *global* floating
 *     panel mounted in `_auth.tsx` (`DevLevaPanel`).
 *
 *  2. Dedicated `useCreateStore` + inline `<LevaPanel store={store} />` (the
 *     `Snap` folder) — values are read imperatively via `store.get(...)` from
 *     a render loop or event handler, without re-rendering React. Use this for
 *     canvas / rAF-driven interactions (e.g. the floor-plan editor) where you
 *     can't afford a React render per slider tick.
 *
 * Capture winning parameter sets via the panel's clipboard button, then paste
 * the values back into code as constants.
 */
export function LabScene() {
	// --- Pattern 1: reactive controls (registers into the global panel) ---
	// Note: `button()` controls render in the panel but aren't part of the
	// returned values object (buttons have no value) — that's why `randomize`
	// isn't destructured here.
	const { x, y, size, color, rotation } = useControls("Box", {
		x: 120,
		y: 100,
		size: 80,
		color: "#6366f1",
		rotation: 0,
		randomize: button(() => {
			// Buttons trigger side effects from the panel.
			console.log("[lab] randomize pressed");
		}),
	});

	// --- Pattern 2: isolated store for imperative / loop reads ---
	const store = useCreateStore();
	useControls(
		"Snap",
		{
			snapDist: { value: 10, min: 0, max: 50, step: 1 },
			snapAngle: { value: 15, min: 0, max: 90, step: 5 },
		},
		{ store },
	);
	// Read imperatively anywhere (renderer, handlers) — no React render:
	//   const d = store.get("Snap.snapDist")

	return (
		<PageContainer>
			<div className="flex flex-col gap-4">
				<header>
					<h1 className="text-2xl font-semibold">Prototype Lab</h1>
					<p className="text-muted-foreground text-sm">
						Dev-only sandbox for interaction prototyping with Leva. Tune the
						reactive controls in the floating panel (top-right) and the embedded
						store panel below. Capture winning presets with the panel's
						clipboard button, then paste values into code as constants.
					</p>
				</header>

				<div className="grid gap-4 md:grid-cols-[1fr_320px]">
					{/* Live preview driven by reactive useControls values */}
					<svg
						viewBox="0 0 320 240"
						className="aspect-[4/3] w-full rounded-xl border bg-muted/30"
						role="img"
						aria-label="Prototype box preview"
					>
						<title>Prototype box preview</title>
						<rect
							x={x}
							y={y}
							width={size}
							height={size}
							rx={8}
							fill={color}
							transform={`rotate(${rotation} ${x + size / 2} ${y + size / 2})`}
						/>
					</svg>

					{/* Inline panel scoped to the dedicated store (isolated from the global panel) */}
					<div className="h-full min-h-64 rounded-xl border p-1">
						<LevaPanel
							store={store}
							fill
							titleBar={{ title: "Snap (store)", drag: false, filter: false }}
						/>
					</div>
				</div>

				<p className="text-xs text-muted-foreground">
					Box controls are reactive (re-render on change); Snap controls live in
					an isolated store — read them imperatively via{" "}
					<code>store.get(&quot;Snap.snapDist&quot;)</code>.
				</p>
			</div>
		</PageContainer>
	);
}
