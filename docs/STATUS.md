# Structa Status

**Last Updated:** Thu Jan 22 2026

## Current Phase
**Phase 01: Project Setup (Web & Auth)** is the active phase. We are transforming `packages/web` from a template into the authenticated application shell.

## Phase Summary (The Roadmap)
We are following a granular **Tracer Bullet** strategy. Each phase delivers a specific layer of the stack, tested end-to-end.

| Phase | Name | Status | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **00** | **Discovery** | ✅ **Complete** | Architecture & Plans defined |
| **01** | **Project Setup (Web & Auth)** | ⏳ **In Progress** | Tailwind v4, Shadcn, Better Auth (Email/Google), Protected Routes |
| **02** | **Electric SQL Integration** | 🔮 Planned | Local Electric service, Drizzle schema sync, TanStack Query wiring |
| **03** | **Durable Streams Setup** | 🔮 Planned | Durable Object infrastructure, Yjs provider integration |
| **04** | **Tracer Bullet: The Room** | 🔮 Planned | End-to-end: Draw Room -> Electric Sync -> Durable Stream Save |

## Phase 01 Breakdown (Current)
Based on `specs/plan/01-project-setup.md`:
1.  **Foundation**: Tailwind v4, Shadcn UI setup.
2.  **Auth Backend**: Better Auth server, API routes, middleware.
3.  **UI Components**: Login forms, Account dropdown, App shell.
4.  **Routes**: Landing page, Login pages, Protected Dashboard.

## Known Gaps / Risks
-   **Tailwind v4**: New ecosystem, ensure Shadcn CLI works correctly with CSS-first config.
-   **Electric Integration**: Phase 02 is complex; requires careful orchestration of the sidecar container with the dev server.

## Next Up
Execute **Phase 01: Project Setup**.
-   Install dependencies in `packages/web`.
-   Configure Tailwind v4.
-   Implement Better Auth.
