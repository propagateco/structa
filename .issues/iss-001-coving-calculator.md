# Interactive Coving Calculator with SVG Diagrams

## Summary

Create a standalone tool page for calculating crown molding/coving compound angles with fully interactive SVG diagrams. Users can adjust angles by dragging SVG elements directly or using shadcn UI controls, with real-time visual feedback in both 2D technical and 3D perspective views.

---

## Motivation

When installing crown molding, users need to calculate compound miter and bevel angles based on:
- **Spring angle** (how the molding sits against the wall)
- **Wall/corner angle** (the angle between walls at the corner)

The Clerk currently provides mathematical formulas, but visual learners struggle to understand the relationship between these angles. An interactive calculator with visual diagrams will:

1. **Reduce errors** - Users see exactly what each angle represents
2. **Improve comprehension** - Visual feedback shows how changing one parameter affects the cut
3. **Enable self-service** - Users can experiment with angles without asking The Clerk
4. **Support all skill levels** - DIYers and tradespeople alike benefit from visual guidance

---

## Goals

- Create a standalone `/tools/coving-calculator` route
- Implement 4 interactive SVG diagrams (Wall Angle, Spring Angle, Miter Angle, Bevel Angle)
- Support both direct SVG manipulation (drag) AND slider/input controls
- Toggle between 2D technical and 3D perspective views
- Show calculated angles prominently with expandable saw setup instructions
- Reusable calculator component that can later be embedded in Clerk chat or floor plan editor

---

## Non-Goals

- Integration with floor plan editor (future enhancement)
- Clerk chat embedding (future enhancement)
- Mobile-first design (desktop-optimized for v1, functional on mobile)
- Vaulted ceiling calculations (Phase 2)
- Saving/sharing calculations (future enhancement)

---

## Technical Approach

### Architecture Overview

```
packages/web/src/
├── routes/tools/coving-calculator/           # Route folder
│   ├── page.tsx                               # Route page
│   └── _components/                           # Feature-specific components (co-located)
│       ├── CovingCalculator.tsx               # Main orchestrator component
│       ├── CalculatorControls.tsx             # Input controls (sliders, inputs, radios)
│       ├── DiagramContainer.tsx               # View toggle + SVG container
│       ├── diagrams/                          # Diagram components
│       │   ├── WallAngleDiagram.tsx           # Interactive wall corner diagram
│       │   ├── SpringAngleDiagram.tsx         # Molding cross-section diagram
│       │   ├── MiterAngleDiagram.tsx          # Saw miter setting diagram
│       │   ├── BevelAngleDiagram.tsx          # Saw bevel setting diagram
│       │   └── Corner3DView.tsx               # 3D perspective of corner
│       ├── CalculatorOutput.tsx               # Results display
│       └── SawSetupInstructions.tsx           # Expandable instructions
│
├── components/                                # Shared components (reusable across app)
│   ├── ui/                                    # shadcn components
│   └── diagrams/                              # Shared diagram components
│       ├── AngleArc.tsx                       # Reusable angle arc renderer
│       ├── DraggableHandle.tsx                # Draggable control point
│       ├── DimensionLabel.tsx                 # Measurement labels
│       └── MoldingProfile.tsx                 # Crown molding cross-section shape
│
├── hooks/                                     # Shared hooks (reusable across app)
│   └── useSvgDrag.ts                          # SVG drag handling (general purpose)
│
└── routes/tools/coving-calculator/
    └── _hooks/                                # Feature-specific hooks (co-located)
        └── useAngleCalculator.ts              # Core calculation logic
```

### Component Breakdown

#### 1. CovingCalculator.tsx (Main Orchestrator)

**Responsibilities:**
- Manages state for all angles (spring, wall, miter, bevel)
- Coordinates between controls and diagrams
- Handles bidirectional sync between drag and controls

**State:**
```typescript
interface CalculatorState {
  // Inputs
  springAngle: number;      // 0-90°, default 38
  wallAngle: number;        // 0-180°, default 90
  
  // Calculated outputs
  miterAngle: number;       // Derived from spring + wall
  bevelAngle: number;       // Derived from spring + wall
  
  // UI state
  viewMode: '2d' | '3d';
  cornerType: 'inside' | 'outside';
  cornerSide: 'left' | 'right';
  springPreset: '38' | '45' | 'custom';
}
```

#### 2. CalculatorControls.tsx (Input Controls)

**Components Used:**
- `Slider` from shadcn - For wall angle (0-180°) and custom spring angle
- `Input` (existing) - For precise numeric entry
- `RadioGroup` (to add) - For inside/outside corner, left/right piece
- `Select` (to add) - For spring angle preset (38°, 45°, custom)
- `Label` (existing) - For all control labels

**Layout:**
```
┌─────────────────────────────────────────┐
│ Spring Angle                             │
│ ○ 38° (38/52 Crown)  ○ 45° (45/45 Crown) │
│ ○ Custom: [____]° [===|====] 0-90       │
├─────────────────────────────────────────┤
│ Wall / Corner Angle                      │
│ [____]° [=====|=========] 0-180          │
├─────────────────────────────────────────┤
│ Corner Type                              │
│ ○ Inside Corner   ○ Outside Corner       │
├─────────────────────────────────────────┤
│ Piece Side                               │
│ ○ Left Piece   ○ Right Piece             │
└─────────────────────────────────────────┘
```

#### 3. DiagramContainer.tsx (View Toggle + SVG Container)

**Features:**
- Toggle switch for 2D/3D view modes
- Responsive SVG container (maintains aspect ratio)
- SVG coordinate system with viewBox
- Handles pointer events for drag interactions

**Layout:**
```
┌─────────────────────────────────────────┐
│ View: [2D Technical] | [3D Perspective]  │
├─────────────────────────────────────────┤
│                                         │
│         ┌───────────────────┐           │
│         │                   │           │
│         │   SVG Diagram     │           │
│         │   (interactive)   │           │
│         │                   │           │
│         └───────────────────┘           │
│                                         │
└─────────────────────────────────────────┘
```

#### 4. Interactive SVG Diagrams

##### 4a. WallAngleDiagram.tsx (2D Technical)

**Visual Elements:**
- Two walls meeting at a corner (from top-down view)
- Angle arc showing wall angle
- Draggable handle on one wall to adjust angle
- Dimension label showing angle value

**Interaction:**
- User drags wall endpoint → updates wall angle
- Slider changes → wall rotates to match

**SVG Structure:**
```svg
<svg viewBox="0 0 200 200">
  <!-- Fixed wall (horizontal) -->
  <line x1="100" y1="100" x2="200" y2="100" class="wall" />
  
  <!-- Rotating wall -->
  <g transform={`rotate(${wallAngle}, 100, 100)`}>
    <line x1="100" y1="100" x2="200" y2="100" class="wall" />
    <DraggableHandle cx="200" cy="100" onDrag={handleWallDrag} />
  </g>
  
  <!-- Angle arc -->
  <AngleArc center={[100,100]} radius={30} angle={wallAngle} />
  
  <!-- Label -->
  <DimensionLabel position={[130, 70]} value={`${wallAngle}°`} />
</svg>
```

##### 4b. SpringAngleDiagram.tsx (2D Technical)

**Visual Elements:**
- Cross-section of wall and ceiling
- Crown molding profile at spring angle
- Angle arc showing spring angle
- Draggable handle on molding to adjust angle

**Interaction:**
- User drags molding profile → updates spring angle
- Slider changes → molding rotates to match

**SVG Structure:**
```svg
<svg viewBox="0 0 200 200">
  <!-- Wall (vertical) -->
  <line x1="50" y1="200" x2="50" y2="50" class="wall" />
  
  <!-- Ceiling (horizontal) -->
  <line x1="50" y1="50" x2="200" y2="50" class="ceiling" />
  
  <!-- Crown molding profile -->
  <g transform={`rotate(${-springAngle}, 50, 50)`}>
    <MoldingProfile />
    <DraggableHandle cx="120" cy="50" onDrag={handleSpringDrag} />
  </g>
  
  <!-- Spring angle arc -->
  <AngleArc center={[50,50]} radius={40} angle={springAngle} label="Spring" />
</svg>
```

##### 4c. MiterAngleDiagram.tsx (2D Technical)

**Visual Elements:**
- Top-down view of saw table
- Molding piece on table
- Cut line at miter angle
- Angle indicator showing miter setting

**Interaction:**
- Read-only (calculated from spring + wall)
- Highlights when user hovers to show "this is what you set on your saw"

##### 4d. BevelAngleDiagram.tsx (2D Technical)

**Visual Elements:**
- Side view of saw blade
- Blade tilted at bevel angle
- Angle indicator showing bevel setting

**Interaction:**
- Read-only (calculated from spring + wall)
- Highlights when user hovers to show "this is what you tilt on your saw"

##### 4e. Corner3DView.tsx (3D Perspective)

**Visual Elements:**
- 3D isometric view of corner
- Two crown molding pieces meeting
- Shows actual cut angles in context
- Both pieces color-coded (left/right)

**Interaction:**
- User can rotate view (drag background)
- Hover on pieces to see their specific angles
- Syncs with wall/spring angle changes

**Technical Approach:**
- Use SVG `transform` with `matrix()` for 3D projection
- Or consider using Three.js/React Three Fiber for better 3D (Phase 2)
- For v1, use pre-calculated isometric projection

#### 5. CalculatorOutput.tsx (Results Display)

**Layout:**
```
┌─────────────────────────────────────────┐
│ CALCULATED ANGLES                        │
│                                         │
│  ┌─────────────┐   ┌─────────────┐      │
│  │   MITER     │   │   BEVEL     │      │
│  │   31.6°     │   │   33.9°     │      │
│  │             │   │             │      │
│  │   [Diagram] │   │   [Diagram] │      │
│  └─────────────┘   └─────────────┘      │
│                                         │
│  ▼ Saw Setup Instructions               │
│  ─────────────────────────────────      │
│  1. Set miter angle to 31.6°           │
│  2. Set bevel angle to 33.9°           │
│  3. Place molding flat on table...      │
│  [Expand for full instructions]         │
└─────────────────────────────────────────┘
```

#### 6. SawSetupInstructions.tsx (Expandable)

**Content:**
- Step-by-step saw setup based on corner type and piece side
- Visual indicator of which way to swing miter
- Visual indicator of bevel direction
- Piece orientation (top against fence vs table)
- Common pitfalls to avoid

---

## shadcn Components Required

### Already Installed
- `Input` ✅ - Numeric input for precise angle entry
- `Label` ✅ - Form labels
- `Button` ✅ - Action buttons
- `Card` ✅ - Container for diagrams
- `Tabs` ✅ - Potentially for view switching

### Need to Install

Following the [ui.md](../docs/core/design/ui.md) installation pattern:

```bash
cd packages/web
npx shadcn@latest add slider
npx shadcn@latest add radio-group
npx shadcn@latest add select
npx shadcn@latest add switch
```

Or install multiple at once:
```bash
cd packages/web
npx shadcn@latest add slider radio-group select switch
```

### Check Community Registries First

Before building custom diagram/animation components, check the [shadcn Registry Directory](https://ui.shadcn.com/docs/directory) for existing solutions:

| Need | Registry to Check |
|------|-------------------|
| SVG Animations | `@magicui`, `@motion-primitives`, `@animate-ui` |
| Interactive Diagrams | Search "diagram" or "canvas" in directory |
| Drag Interactions | `@dnd-kit` or similar |

If suitable components exist, prefer adding from community registry:
```bash
cd packages/web
npx shadcn@latest add @[registry]/[component]
```

### Components to Add
| Component | Purpose |
|-----------|---------|
| `Slider` | Wall angle (0-180°), custom spring angle (0-90°) |
| `RadioGroup` | Inside/outside corner, left/right piece |
| `Select` | Spring angle preset dropdown |
| `Switch` | 2D/3D view toggle (alternative to tabs) |

---

## Shared SVG Components

> **Location**: `packages/web/src/components/diagrams/`
> 
> These are reusable components that could be used by other features (floor plan editor, other calculators, etc.). Following the [ui.md](../docs/core/design/ui.md) pattern for custom component location.

### AngleArc.tsx
Reusable component for rendering angle arcs on diagrams.

```typescript
interface AngleArcProps {
  center: [number, number];
  radius: number;
  startAngle?: number;  // Default 0
  endAngle: number;
  label?: string;
  color?: string;
  dashed?: boolean;
}

// Renders a path element with arc
```

### DraggableHandle.tsx
Reusable draggable control point for SVG interactions.

```typescript
interface DraggableHandleProps {
  cx: number;
  cy: number;
  onDrag: (delta: { dx: number; dy: number }, position: { x: number; y: number }) => void;
  constrain?: 'horizontal' | 'vertical' | 'circular' | 'angular';
  centerPoint?: [number, number];  // For circular/angular constraints
}

// Uses pointer events, converts SVG coordinates to angle changes
```

### DimensionLabel.tsx
Displays measurement labels on diagrams.

```typescript
interface DimensionLabelProps {
  position: [number, number];
  value: string;
  unit?: '°' | 'mm' | 'm';
  fontSize?: number;
}

// Text element with background for readability
```

### MoldingProfile.tsx
SVG path for crown molding cross-section shape.

```typescript
interface MoldingProfileProps {
  width?: number;
  height?: number;
  style?: 'simple' | 'ogee' | 'cove';
}

// Path element representing molding profile
```

---

## Hooks

### useAngleCalculator.ts (Feature-Specific)
> **Location**: `packages/web/src/routes/tools/coving-calculator/_hooks/useAngleCalculator.ts`

Core calculation logic using formulas from `docs/research/maths/coving_calculations.md`.

```typescript
interface UseAngleCalculatorOptions {
  springAngle: number;
  wallAngle: number;
}

interface AngleCalculatorResult {
  miterAngle: number;
  bevelAngle: number;
  isValid: boolean;
  warnings?: string[];
}

function useAngleCalculator(options: UseAngleCalculatorOptions): AngleCalculatorResult {
  // Uses formulas:
  // miter = arctan(cos(spring) × tan(wall/2))
  // bevel = arcsin(sin(spring) × sin(wall/2))
}
```

### useSvgDrag.ts (Shared Hook)
> **Location**: `packages/web/src/hooks/useSvgDrag.ts`

Handles SVG drag interactions with coordinate conversion. This is a general-purpose hook that can be reused by any feature needing SVG drag interactions (floor plan editor, other calculators, etc.).

```typescript
interface UseSvgDragOptions {
  svgRef: React.RefObject<SVGSVGElement>;
  onDragStart?: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  onDragEnd?: () => void;
  constrain?: DragConstraint;
}

type DragConstraint = 
  | { type: 'horizontal' }
  | { type: 'vertical' }
  | { type: 'circular'; center: [number, number] }
  | { type: 'angular'; center: [number, number]; minAngle: number; maxAngle: number };

function useSvgDrag(options: UseSvgDragOptions): {
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
}
```

---

## User Flow

### Primary Flow: Drag to Adjust

1. User lands on `/tools/coving-calculator`
2. Sees default values (90° wall, 38° spring)
3. Sees calculated results (31.6° miter, 33.9° bevel)
4. **Drags wall in Wall Angle diagram** to their actual wall angle
5. Sees all diagrams update in real-time
6. Notes the miter and bevel angles for cutting

### Alternative Flow: Slider/Input

1. User lands on `/tools/coving-calculator`
2. Enters wall angle in input field (e.g., "135")
3. Selects spring angle preset (45°)
4. Sees calculated results immediately
5. Uses slider to fine-tune wall angle
6. Expands saw setup instructions for cutting guidance

### Edge Case: Custom Spring Angle

1. User has non-standard molding
2. Selects "Custom" spring angle preset
3. Uses slider OR input to enter exact spring angle
4. Drags molding profile in Spring Angle diagram to visually match their molding
5. Gets precise calculated results

---

## Implementation Phases

### Phase 1: Core Calculator (Estimated: 3-4 days)
- [ ] Create route `packages/web/src/routes/tools/coving-calculator/page.tsx`
- [ ] Install required shadcn components:
  ```bash
  cd packages/web && npx shadcn@latest add slider radio-group select
  ```
- [ ] Build `CovingCalculator.tsx` with state management
- [ ] Build `CalculatorControls.tsx` with all inputs
- [ ] Implement `useAngleCalculator.ts` hook with formulas (feature-specific location)
- [ ] Build `CalculatorOutput.tsx` with angle display
- [ ] Add basic styling and layout

### Phase 2: 2D Diagrams (Estimated: 4-5 days)
- [ ] Create `packages/web/src/components/diagrams/` folder for shared diagram components
- [ ] Build shared SVG components:
  - `AngleArc.tsx`
  - `DimensionLabel.tsx`
  - `MoldingProfile.tsx`
- [ ] Build `WallAngleDiagram.tsx` (static first)
- [ ] Build `SpringAngleDiagram.tsx` (static first)
- [ ] Build `MiterAngleDiagram.tsx` (read-only, calculated)
- [ ] Build `BevelAngleDiagram.tsx` (read-only, calculated)
- [ ] Connect diagrams to state (update on slider changes)

### Phase 3: Drag Interactions (Estimated: 2-3 days)
- [ ] Implement `useSvgDrag.ts` hook in shared hooks folder (`packages/web/src/hooks/`)
- [ ] Build `DraggableHandle.tsx` component in shared diagram components
- [ ] Add drag to WallAngleDiagram
- [ ] Add drag to SpringAngleDiagram
- [ ] Implement bidirectional sync (drag ↔ slider)

### Phase 4: 3D View (Estimated: 2-3 days)
- [ ] Build `Corner3DView.tsx` with isometric projection
- [ ] Add view toggle (2D/3D)
- [ ] Sync 3D view with angle changes
- [ ] Add hover interactions on 3D pieces

### Phase 5: Polish & Instructions (Estimated: 2 days)
- [ ] Build `SawSetupInstructions.tsx` with expandable content
- [ ] Add tooltips explaining each angle
- [ ] Add keyboard accessibility for inputs
- [ ] Add responsive layout for tablet/mobile
- [ ] Add loading states and error handling

---

## Acceptance Criteria

### Must Have (MVP)
- [ ] User can input wall angle (0-180°) via slider and numeric input
- [ ] User can select spring angle preset (38°, 45°) or enter custom value
- [ ] User can select corner type (inside/outside)
- [ ] User can select piece side (left/right)
- [ ] Calculated miter and bevel angles display correctly
- [ ] Wall Angle diagram shows walls at correct angle
- [ ] Spring Angle diagram shows molding at correct angle
- [ ] All diagrams update in real-time as inputs change
- [ ] Formulas are accurate to ±0.1° (verified against reference tables)

### Should Have
- [ ] User can drag wall in diagram to adjust angle
- [ ] User can drag molding in diagram to adjust spring angle
- [ ] Draggable controls sync with slider/input values
- [ ] 3D perspective view available as alternative to 2D
- [ ] Expandable saw setup instructions based on corner type and piece side
- [ ] Tooltips on hover explain what each angle represents

### Nice to Have
- [ ] User can rotate 3D view
- [ ] Copy-to-clipboard for calculated angles
- [ ] Print-friendly output
- [ ] URL params for sharing specific calculations
- [ ] Save recent calculations (localStorage)

---

## Testing Requirements

### Unit Tests
- [ ] `useAngleCalculator` hook: Verify formulas against reference table values
- [ ] Angle conversion utilities: degrees ↔ radians
- [ ] Input validation: Clamp values to valid ranges

### Integration Tests
- [ ] Slider change → diagram updates → calculated angles change
- [ ] Input change → diagram updates → calculated angles change
- [ ] Drag interaction → state updates → controls sync

### Visual Regression Tests
- [ ] Snapshot tests for each diagram at common angles (45°, 90°, 135°)
- [ ] Snapshot tests for 3D view at common angles

### Accessibility Tests
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader announcements for angle changes
- [ ] Focus management for draggable elements

---

## Design Assets Needed

- Crown molding profile SVG (simple ogee style)
- Saw diagram icons (miter saw, bevel tilt indicator)
- Color scheme for wall/ceiling/molding differentiation

---

## Open Questions

1. **3D Library**: Should we use pure SVG for 3D isometric or consider React Three Fiber for better 3D support? (Recommend: Pure SVG for v1, evaluate R3F if 3D becomes core feature)

2. **Mobile Gestures**: On mobile, should drag interactions use touch events with larger hit areas? (Recommend: Yes, 44px minimum touch targets)

3. **Preset Molding Profiles**: Should we include preset molding profiles from common manufacturers? (Recommend: Phase 2 feature)

---

## Related Documents

- [Coving Calculations Math Reference](../docs/research/maths/coving_calculations.md)
- [UI Components Guide](../docs/core/design/ui.md) - shadcn installation patterns, component locations
- [blocklayer.com Crown Molding Calculator](https://www.blocklayer.com/crown-molding) - Inspiration
- [svg.guide](https://www.svg.guide/) - Interactive SVG patterns inspiration
- [shadcn/ui Components](https://ui.shadcn.com/docs/components) - UI primitives
- [shadcn Registry Directory](https://ui.shadcn.com/docs/directory) - Check for existing diagram/animation components

---

## Labels

`enhancement` `frontend` `tools` `interactive-diagrams` `svg` `calculator`
