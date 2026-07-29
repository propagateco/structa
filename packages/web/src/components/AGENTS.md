# Components — Agent Guide

Convention reminders for agents creating or editing components in this tree.

For repo-wide rules, shadcn install steps, and component locations, see the
parent [`packages/web/AGENTS.md`](../../../AGENTS.md) and
[docs/design/UI.md](../../../../docs/design/UI.md).

## Where new components go

| Type | Path |
|------|------|
| shadcn primitives | `ui/` (via `npx shadcn@latest add <name>`) |
| App/shared components | this directory (`./`) or a themed subfolder (`auth/`, `layout/`, `landing/`, …) |
| Dev-only prototyping helpers | `dev/` |
| Prototype scenes (Leva) | `../../lab/` |

## Prototyping interactions with Leva (dev-only)

When asked to prototype an interaction — drawing, snapping, gestures, a new
canvas behaviour, tuning physics/maths constants — reach for
[Leva](https://github.com/pmndrs/leva) rather than hard-coding constants. It
makes sweeping parameter changes instant, which makes finding good ideas easy.

The plumbing already exists and is dev-only by construction (leva never ships
to prod — verified via `npm run build`):

- **Global floating panel** — `dev/dev-leva.tsx` (`DevLevaPanel`). Mounted once
  in `routes/_auth.tsx`. Leva's store is global, so any `useControls(...)` hook
  used anywhere in the tree registers its folder into this single panel. You do
  **not** need to mount anything per-component.
- **Sandbox route** — `routes/_auth/app/lab.tsx` (`/app/lab`). Dev-only
  (`beforeLoad` redirects to `/app` when `!import.meta.env.DEV`); lazy-loads
  its scene behind the same DEV guard so the import is dead-coded in prod.
- **Reference scene** — `lab/lab-scene.tsx`. Copy this file as the starting
  point for a new prototype.

### How to add a new prototype when instructed

1. **Build the scene** at `packages/web/src/lab/<name>-scene.tsx`, modelled on
   `lab/lab-scene.tsx`. Export a named component (e.g. `WallDrawingScene`).
2. **Wire the route** in `routes/_auth/app/lab.tsx`: import the new scene lazily
   behind the `import.meta.env.DEV` guard and render it (or swap the default
   `LabScene` for the new one). Keep the DEV guard — never let leva become
   statically reachable in prod.
3. **Colocate `useControls`** next to the interaction you're tuning. Pick the
   pattern that fits:

   ```ts
   // Reactive — re-renders on change. Best for React-driven UI.
   // Registers into the global DevLevaPanel automatically.
   const { snapDist, snapAngle } = useControls("Drawing", {
     snapDist: { value: 10, min: 0, max: 50, step: 1 },
     snapAngle: { value: 15, min: 0, max: 90, step: 5 },
     reset: button(() => reset()),          // button() has no return value
   }, { collapsed: true });

   // Imperative — for canvas / rAF loops where you can't render React per tick.
   const store = useCreateStore();
   useControls("Snap", { snapDist: { value: 10, min: 0, max: 50 } }, { store });
   // read inside the loop:  const d = store.get("Snap.snapDist")
   // and mount an inline panel:  <LevaPanel store={store} fill />
   ```

4. **Capture winners** with Leva's clipboard button (JSON export), then paste
   the values back into code as named constants.
5. **Verify** `npm run typecheck` and `npx biome check` pass, and that
   `npm run build` still emits no `leva` chunk (the DEV-guarded lazy import is
   what keeps it out — don't hoist `import("leva")` to module top-level).

### Do / Don't

- ✅ Gate every leva import behind `import.meta.env.DEV` (ternary at the
  `lazy(...)` call site, not just at render time).
- ✅ Keep prototypes behind auth via the `_auth` layout (they share the
  `DevLevaPanel`).
- ❌ Don't `import("leva")` unconditionally — it leaks into the prod bundle.
- ❌ Don't add a second global `<Leva />`; there is already one in `_auth.tsx`.
  Use a scoped `<LevaPanel store={store} />` only when you need an isolated
  panel for a specific scene.
- ❌ Don't ship prototype constants to prod — promote them to real config once
  settled and remove the `useControls` call.