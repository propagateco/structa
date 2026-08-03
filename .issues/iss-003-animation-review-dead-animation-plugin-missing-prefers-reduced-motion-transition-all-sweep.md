# Animation review: dead animation plugin, missing prefers-reduced-motion, transition: all sweep

**See:** [GitHub Issue #59](https://github.com/propagateco/structa/issues/59)

Status: needs-triage

## Why

A read-only animation/motion review of `packages/web/src` flagged **three feel-breaking regressions** and several smaller craft issues. The most severe: the `animate-in` / `fade-in-0` / `zoom-in-95` / `slide-in-from-*` utilities used by `dialog.tsx`, `alert-dialog.tsx`, `dropdown-menu.tsx`, `tooltip.tsx`, and `sheet.tsx` generate **zero styles** because `tailwindcss-animate` is not registered as a plugin — modals, dropdowns, and tooltips currently open with no animation at all. On top of that, there is **no `prefers-reduced-motion` handling anywhere in `src`**, and `transition: all` (an escalation trigger) is on frequently-touched elements like `Button`, `InputOTP`, and `Tabs`.

Reviewed against the ten non-negotiable animation standards (justified motion, frequency-appropriate, responsive easing, sub-300ms UI, origin/physicality, interruptibility, GPU-only, accessibility, asymmetric timing, cohesion). See `packages/web/.agents/skills/review-animations/STANDARDS.md` for the precise curve/duration tables cited below.

---

## Goal

Bring motion across `packages/web/src` up to the craft bar so that:

1. Overlays (modal, dialog, dropdown, tooltip, sheet) actually animate — the v4 Tailwind setup currently ships **no transform/opacity transition** for these.
2. `prefers-reduced-motion` is honored repo-wide (gentler, not zero — keep opacity/color, drop movement).
3. `transition: all` is replaced with scoped property lists on every frequently-touched element.
4. Hover timing/easing matches usage frequency (150ms color hover, `ease` not `ease-in-out`).
5. Hover motion is gated behind `(hover: hover) and (pointer: fine)` so touch tap doesn't fire false hovers.

This is **not** an attempt to add new delightful motion — it's a regression-fix and cohesion pass.

---

## Scope — findings by impact tier

### Tier 1 — Feel-breaking regressions (Block)

#### 1.1 `tailwindcss-animate` plugin not registered → overlays snap in with no motion

`packages/web/src/styles/app.css:1-2`:

```css
@import 'tailwindcss';
@plugin "@tailwindcss/typography";
```

The `animate-in` / `animate-out` / `fade-in-0` / `zoom-in-95` / `slide-in-from-*` / `slide-out-to-*` classes used in:

- `src/components/ui/dialog.tsx:22,39`
- `src/components/ui/alert-dialog.tsx:18,37`
- `src/components/ui/dropdown-menu.tsx:70,89` (origin pattern via `origin-[--radix-dropdown-menu-content-transform-origin]` is correct ✅)
- `src/components/ui/tooltip.tsx:21`
- `src/components/ui/sheet.tsx:24,34`

silently generate nothing. Verified: `grep -rn "@plugin\|@import" packages/web/src/styles/` shows only `tailwindcss` and `@tailwindcss/typography`; `tailwindcss-animate` is installed in `node_modules` but never wired in.

**Fix options** (pick one):
- (a) `@plugin "tailwindcss-animate";` under Tailwind v4 (verify it still resolves; it's a v3 plugin).
- (b) Migrate to `tw-animate-css` (v4-native replacement, same class names).
- (c) Hand-roll `@starting-style` blocks for the few overlays that need entry animation.

**Verify**: open a dialog/dropdown/tooltip in the browser, watch DevTools → Animations panel, and confirm a transform/opacity animation now fires (today it does not).

#### 1.2 No `prefers-reduced-motion` handling anywhere

Zero matches in `src` for `prefers-reduced-motion`, `useReducedMotion`, `@media (hover: hover) and (pointer: fine)`, or `@starting-style`. Every animation ignores OS preference — `shake` (`app.css:620`), `caret-blink` (`app.css:598`), `slideIn` (`app.css:583`), `hover-lift` (`app.css:564`), dropdown (`app.css:858`), and all the Radix overlays.

**Fix**:
- Add a global `@media (prefers-reduced-motion: reduce) { … }` block in `app.css` that drops `transform`/`slide` while keeping opacity/color.
- Add `useReducedMotion()` from `motion/react` into `animated-background.tsx` `motion.div` and any other `motion.*` element.

#### 1.3 `transition: all` on frequently-touched elements

Escalation trigger per STANDARDS (animates unintended properties, pushes some off the GPU). Sites:

| File:line | Now | Should be |
| --- | --- | --- |
| `app.css:559` `.auth-button` | `transition-all duration-200` | `transition-[background-color,color,border-color,box-shadow] duration-200` |
| `components/ui/LogoShowcase.tsx:142` | `transition-all duration-1000 ease-in-out` | `transition-[opacity,filter] duration-1000 cubic-bezier(0.77,0,0.175,1)` |
| `components/ui/DiagonalPattern.tsx:22` | `transition-all ease-out` (with inline `filter: blur(4px)`) | `transition-[opacity,filter] ease-out` |
| `components/layout/DiagonalPatternCard.tsx:40,44` | `transition-all duration-500 ease-in-out [filter:blur(8px)]…` | `transition-[opacity,filter] duration-400 ease-out` |
| `components/ui/input-otp.tsx:42,56` | `transition-all` on each OTP cell | `transition-[border-color,box-shadow,background-color,color]` |
| `components/auth/input-otp.tsx:42` | `transition-all` | scope as above |
| `components/ui/tabs.tsx:32,82` | `transition-all` on tab triggers | `transition-[color,background-color,box-shadow]` |
| `components/ui/icons.tsx:6` | `transition-all duration-500 ease-in-out` | `transition-colors duration-150 ease` |
| `components/layout/typography.tsx:58` | `transition-all duration-150` | scope to the actually-changing properties |
| `components/auth/auth-drawer.tsx:239` `ViewContainer` | `transition-all duration-300 ease-in-out` with `max-h-[2000px]↔max-h-0` | animate `transform, opacity` instead; collapse via `grid-template-rows: 1fr↔0fr` or `clip-path: inset(…)` rather than `max-height` |

---

### Tier 2 — Missed simplifications

#### 2.1 Hover-driven magic-move indicator in `animated-background.tsx`

`src/components/ui/animated-background.tsx:53-84` — when `enableHover` is set, a spring background hops to the hovered item on every `onMouseEnter`. Tens/day interaction = reduce. `theme-toggle.tsx:84` correctly sets `enableHover={false}` ✅ — extend that pattern; only move the indicator on `onClick`/active state.

#### 2.2 Long hover durations on icons/labels

- `components/ui/icons.tsx:6` — 500ms is far too slow for an icon hover.
- `components/ui/button.tsx:9` — 300ms color hover is sluggish for tens-to-100+/day presses.
- `components/ui/logo.tsx:6` — 300ms color hover on the wordmark.

Pull down to **150ms**.

---

### Tier 3 — Performance

#### 3.1 Sidebar collapse animates layout properties

`src/components/ui/sidebar.tsx`:

- `:251` `transition-[width] duration-200 ease-linear`
- `:261` `transition-[left,right,width] duration-200 ease-linear`
- `:327` `transition-all ease-linear` (← also Tier 1.3)
- `:472` `transition-[margin,opacity] duration-200 ease-linear`
- `:545` `transition-[width,height,padding]`
- `:642` `transition-transform` ✅ (already correct)

Animating `width`/`padding`/`margin`/`left`/`right` triggers full layout recalc every frame. Where structurally feasible, animate via `transform: translateX()` on a fixed-width strip instead of changing `width`. At minimum replace `ease-linear` with `cubic-bezier(0.4, 0, 0.2, 1)` so the motion doesn't feel clinical.

#### 3.2 `auth-drawer.tsx` `ViewContainer` collapses `max-h-[2000px] ↔ max-h-0`

`src/components/auth/auth-drawer.tsx:235-251`. Animating `max-height` janks on tall content. Prefer `grid-template-rows: 1fr ↔ 0fr` or `clip-path: inset(…)`.

---

### Tier 4 — Interruptibility & timing

#### 4.1 Keyframes where transitions belong

- `app.css:583-596` — `.testimonial-enter` uses `@keyframes slideIn`. Keyframes restart from zero on rapid add; transitions retarget from current state (STANDARDS, Interruptibility). Convert to a CSS transition + `@starting-style`.

#### 4.2 `.fade-dropdown` is enter-only

`app.css:858-875` — `.fade-dropdown` animates open but `close` is instant (jarring cohesion finding). Either animate both (Radix `data-[state]` transitions) or accept instant for both. Also uses built-in `ease-out`-equivalent (`cubic-bezier(0.4, 0, 0.2, 1)`) — keep or upgrade to `cubic-bezier(0.23, 1, 0.32, 1)`.

#### 4.3 Sheet uses `ease-in-out` for entering

`src/components/ui/sheet.tsx:34`:

```css
"fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 …"
```

Entering an element should start fast and settle (`ease-out`); `ease-in-out` delays the moment of reveal. Per STANDARDS, prefer iOS drawer curve `cubic-bezier(0.32, 0.72, 0, 1)`.

---

### Tier 5 — Origin, physicality & cohesion

#### 5.1 Origin pattern is already correct ✅

- `dropdown-menu.tsx:70,89` uses `origin-[--radix-dropdown-menu-content-transform-origin]` (scale from trigger, not center).
- `dialog.tsx` modal uses centered transform-origin — modal exempt per STANDARDS.

No change needed; preserve this during Tier 1.1.

#### 5.2 Hover easing rules violated repeatedly

Per STANDARDS, hover/color changes use `ease`. The codebase uses `ease-in-out`/`ease-linear` instead in:

- `components/ui/button.tsx:9` (`ease-in-out`)
- `components/ui/logo.tsx:6` (implicit `ease`)
- `components/ui/link.tsx:13,72,76,102,135`
- `components/uploads/image-overlay.tsx:45,57,67` (`ease-in-out`)
- `components/nav/project-switcher.tsx:168,174` (`ease-in-out`)
- `components/ui/tabs.tsx:32,82`
- `components/auth/input-otp.tsx:42`
- `components/ui/form.tsx:97` (`ease-linear`)
- `routes/_login/login/index.tsx:40` (`ease-in-out`)
- `routes/_auth/_onboarding.tsx:76` (`ease-in-out`)

Symptoms are subtle but accumulate as "feels slightly behind the cursor." Swap to `ease` (color/hover) or `ease-out` (entering).

#### 5.3 `DiagonalPatternCard.tsx:40,44` crosshair reveal uses `ease-in-out` for entering on hover

Should be `ease-out` — enters should snap forward, settle back.

---

### Tier 6 — Accessibility

#### 6.1 No `(hover: hover) and (pointer: fine)` gating

Ungated `:hover` motion leaves the element in `:hover` state on touch until the user taps elsewhere — false hovers appear/disappear spuriously. Sites:

- `components/ui/link.tsx:72,76,102` (arrow nudge on `group-hover`)
- `components/nav/project-switcher.tsx:168,174` (settings icons)
- `components/uploads/image-overlay.tsx:57,67` (overlay buttons)
- `components/ui/button.tsx:97` (`after:scale-x` underline)
- `LogoShowcase` hover (if applicable)

Wrap these in a hover-fine media query (or wrap in CSS `@media (hover: hover) and (pointer: fine) { … }` block).

---

## Cohesion notes

- The custom CSS block at `app.css:554-642` defines `hover-lift`, `button-scale`, `testimonial-enter`, `animate-shake` — initial scan found **no references** in `*.tsx`/`*.ts`. Likely dead CSS; confirm with `grep -rn 'hover-lift\|button-scale\|testimonial-enter\|animate-shake' packages/web/src` before deleting, then remove to shrink the broken-pattern surface.
- Spring config in `theme-toggle.tsx:78-82` (`{ type: 'spring', bounce: 0, duration: 0.2 }`) is correct and crisp — use as the reference for any future indicator transition. ✅
- `auth-drawer.tsx` file-level doc comment says "fade+slide" but the implementation also includes `max-h` morphing. Either fix the comment or fix the implementation to match (Tier 3.2).

---

## Proposed implementation waves

Ship in this order; each is independently shippable.

### Wave 1 — Block fixes (highest impact, smallest diff)

- [ ] Register the animation plugin in `app.css` (one line). Verify in the browser that dialog/dropdown/tooltip open with `scale(0.95)+opacity:0 → scale(1)+opacity:1`. If `tailwindcss-animate` breaks under v4, fall back to `tw-animate-css` or hand-rolled `@starting-style`.
- [ ] Add global `@media (prefers-reduced-motion: reduce) { … }` block in `app.css` (drop transform/slide, keep opacity/color).
- [ ] Add `useReducedMotion()` guard in `animated-background.tsx` `motion.div`.

### Wave 2 — `transition: all` sweep (Tier 1.3)

- [ ] `app.css:559` `.auth-button`
- [ ] `components/ui/LogoShowcase.tsx:142`
- [ ] `components/ui/DiagonalPattern.tsx:22`
- [ ] `components/layout/DiagonalPatternCard.tsx:40,44`
- [ ] `components/ui/input-otp.tsx:42,56` + `components/auth/input-otp.tsx:42`
- [ ] `components/ui/tabs.tsx:32,82`
- [ ] `components/ui/icons.tsx:6`
- [ ] `components/layout/typography.tsx:58`
- [ ] `components/auth/auth-drawer.tsx:239` (ViewContainer — also covers Tier 3.2)

### Wave 3 — Hover timing/easing (Tier 2.2 + Tier 5.2)

- [ ] `button.tsx:9` — 300ms → 150ms, `ease-in-out` → `ease`
- [ ] `logo.tsx:6` — 300ms → 150ms
- [ ] `icons.tsx:6` — 500ms → 150ms (already scoped by Wave 2)
- [ ] All `link.tsx` hovers, `image-overlay.tsx`, `project-switcher.tsx`, `tabs.tsx`, `input-otp.tsx`, `form.tsx:97`, `_login/index.tsx:40`, `_onboarding.tsx:76` — swap to `ease`, 150ms.

### Wave 4 — Interruptibility & timing (Tier 4)

- [ ] `app.css:583-596` `testimonial-enter` — keyframes → transition + `@starting-style`
- [ ] `app.css:858-875` `.fade-dropdown` — add exit animation or accept instant both
- [ ] `sheet.tsx:34` — `ease-in-out` → `cubic-bezier(0.32, 0.72, 0, 1)`, verify 250/300ms asymmetric durations

### Wave 5 — Sidebar layout-property animation (Tier 3.1)

- [ ] Replace `ease-linear` with `cubic-bezier(0.4, 0, 0.2, 1)` on lines 251/261/327/472
- [ ] Refactor `width` animation to `transform: translateX()` where structurally feasible
- [ ] Fix `:327` `transition-all` (also Wave 2)

### Wave 6 — Hover gating (Tier 6)

- [ ] Wrap `group-hover` transforms in `@media (hover: hover) and (pointer: fine)` for `link.tsx`, `project-switcher.tsx`, `image-overlay.tsx`, `button.tsx` `after:scale-x`.

### Wave 7 — Dead CSS cleanup (Cohesion notes)

- [ ] Confirm `hover-lift` / `button-scale` / `testimonial-enter` / `animate-shake` unused → delete from `app.css:554-642`
- [ ] Reconcile `auth-drawer.tsx` doc comment with implementation

---

## Verification

- `npm run typecheck` — must pass (no type regressions).
- `npm run check:fix` — Biome lint/format clean.
- Manual (use `@dev-browser` agent as needed):
  - Open a Dialog → confirm `scale(0.95)+opacity:0 → scale(1)+opacity:1` over ~200ms (not instant).
  - Open a Dropdown → confirm scales from the trigger origin (`--radix-dropdown-menu-content-transform-origin`), not center.
  - Hover a Button → confirm 150ms color transition with `ease` (no lag).
  - Toggle OS "Reduce motion" → confirm overlays fade without sliding, transforms dropped but opacity/color preserved.
  - Touch-tap a `PageLink` (or simulate via devtools "No hovering" device) → confirm no false hover state lingers.
  - DevTools → Animations panel: confirm no animation fires when no plugin is registered before the fix; confirm animation fires after.

---

## Acceptance criteria

- [ ] Overlays (dialog, dropdown, tooltip, sheet) visibly animate open — confirmed via DevTools Animations panel.
- [ ] `prefers-reduced-motion: reduce` reduces all `transform`/`translate` motion to opacity-only across `packages/web/src`.
- [ ] No remaining `transition: all` in any `*.tsx` component under `src/components/ui/` or `src/components/auth/`.
- [ ] No `ease-in-out`/`ease-linear` on hover/color changes repo-wide; hover durations ≤ 150ms.
- [ ] Hover motion gated behind `(hover: hover) and (pointer: fine)`.
- [ ] `npm run typecheck` + `npm run check:fix` clean.

---

## Labels

`bug` `polish` `refactor`
