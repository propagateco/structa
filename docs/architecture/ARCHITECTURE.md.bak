# Structa Architecture

## 1. High-Level Layout

Structa is a **local-first** web application designed for UK homeowners to plan renovations. It combines a 2D floor plan editor ("The Canvas") with an AI renovation assistant ("The Clerk").

The system uses a **hybrid data architecture**:
1.  **Structured Data (Electric SQL)**: User profiles, project metadata, property details, and cost/material libraries. Synced via Electric for offline capability and instant reactivity.
2.  **Document Data (Durable Streams)**: Floor plan geometry and spatial metadata stored as Yjs CRDT documents. This enables real-time collaboration and history.
3.  **Intelligence Layer (FloorPlanEngine)**: A dedicated Web Worker that runs the core 2D geometry engine and "Digital Twin" logic, isolating heavy calculations from the UI thread.

### 1.0 Documentation Links

**Related Documentation:**
- [Tech Stack Details & Official Docs →](../stack/TECH_STACK.md)
- [Development Practices →](../development/)
- [Testing Philosophy →](../development/TESTING.md)
- [Git Workflow →](../workflow/GIT_WORKFLOW.md)

---

### 1.1 Tech Stack (Summary)

-   **Frontend**: TanStack Start (React), Tailwind CSS v4, Shadcn UI.
-   **State/Sync**:
    -   **Electric SQL**: For relational data (PostgreSQL sync).
    -   **Yjs**: For floor plan documents (CRDTs).
    -   **Durable Streams**: For document storage and real-time broadcast.
-   **Engine**: Custom 2D Geometry Engine (TypeScript) running in a Web Worker.
-   **Backend/Infra**: SST (AWS Lambda, Durable Objects), Drizzle ORM, PostgreSQL.
-   **AI**: TanStack AI (orchestration), Large Language Models (The Clerk).

## 2. Directory Structure & Responsibilities

The monorepo follows a clear separation of concerns:

### `packages/web` (The Application)
-   **Role**: Consumer-facing UI and application wiring.
-   **Key Components**:
    -   `routes/`: TanStack Start file-based routing.
    -   `components/canvas/`: 2D editing canvas (SVG/HTML5 Canvas).
    -   `components/clerk/`: AI chat interface.
    -   `workers/`: The `FloorPlanEngine` worker entry point.
-   **State**: Local-first stores, Yjs providers.

### `packages/core` (Business Logic)
-   **Role**: Pure, environment-agnostic domain logic.
-   **Key Modules**:
    -   `geometry/`: 2D math, polygon operations, snapping logic.
    -   `regulations/`: UK Building Regulations (Part L, P, B) rules engine.
    -   `materials/`: Material estimation algorithms.
    -   `schema/`: Drizzle schema definitions and Zod validators.
-   **Constraint**: Must run in both Node.js (tests/backend) and Web Workers.

### `packages/backend` (API & Services)
-   **Role**: Server-side operations that cannot be local-first.
-   **Responsibilities**:
    -   Authentication (Better Auth).
    -   AI Proxy/Orchestration (LLM calls).
    -   Third-party integrations (e.g., fetching market material prices).

## 3. Data Flow & State Management

### 3.1 The "Digital Twin" Data Model
The floor plan is not just lines on a page; it is a database of spatial containers.

1.  **User Action**: User draws a wall on the Canvas.
2.  **Local Mutation**: Yjs document is updated (optimistic update).
    -   `Y.Array` stores geometry points.
    -   `Y.Map` stores metadata (height: 2400mm, material: "brick").
3.  **Engine Validation**: The `FloorPlanEngine` worker observes the Yjs doc.
    -   Detects closed polygons ("Rooms").
    -   Calculates areas and volumes in real-time.
    -   Updates "Derived State" (e.g., total floor area) back to the UI.
4.  **Sync**: Changes flow to Durable Streams -> Other clients.
5.  **AI Observation**: "The Clerk" queries the Engine state to answer questions (e.g., "How much paint for this room?").

### 3.2 Hybrid Material Lists
Material lists are generated via a two-step pipeline:
1.  **Deterministic**: The Engine counts explicit objects (15 sockets, 3 radiators, 45m² plasterboard).
2.  **Probabilistic (AI)**: The Clerk estimates implicit items (pipework routing, waste removal) based on the deterministic context.

## 4. Key Architectural Decisions

| Decision | Context | Rationale |
| :--- | :--- | :--- |
| **Snap-Only Constraints** | 2D Geometry | Avoids complex constraint solvers. Snapping ensures "good enough" accuracy for renovation estimates without CAD complexity. |
| **Metadata in Features** | Data Model | Spatial data (ceiling height, wall type) is stored *on* the geometry features, not in a separate DB, ensuring the Digital Twin is always in sync with the visual plan. |
| **Worker-Based Engine** | Performance | Running geometry/calculation logic in a Web Worker keeps the UI buttery smooth (60fps) even during heavy AI analysis or complex plan updates. |
| **Persistent Refs** | Identification | Use `stref:v1:...` IDs for walls/fixtures. Allows AI and material lists to reference objects reliably even as geometry changes. |
| **Progressive Capture** | UX | Don't force users to input all data upfront. Allow defaults (Global Property Settings) -> Overrides (Room Level) -> Specifics (Wall Level). |
| **2D-First (Pre-3D)** | Scope | Focus entirely on a high-quality 2D editor first. 3D (OCCT) is explicitly deferred to Phase 2 to minimize initial bundle size and complexity. |
