# Development Plan - Overview

## 1. North Stars
1.  **Tracer Bullets**: Validate each layer (Auth, Sync, Streams) with a minimal vertical slice before building features.
2.  **Local-First Speed**: Interactions must be instant (60fps). Sync happens in the background.
3.  **Vertical Integration**: AI and Editor share a live brain (The Engine).

## 2. Pinned Decisions (Immutable)
| Category | Decision | Rationale |
| :--- | :--- | :--- |
| **Stack** | TanStack Start + Electric SQL | Best-in-class for local-first React apps with SSR support. |
| **Auth** | Better Auth (Email/Google) | Secure, passwordless, easy integration with Drizzle. |
| **Styling** | Tailwind v4 + Shadcn | Modern, performance-focused, accessible components. |
| **State** | Yjs + Durable Streams | Proven pattern for real-time collaboration. |

## 3. Phase Overview (The Roadmap)
| Phase | Focus | Status |
| :--- | :--- | :--- |
| **01** | **Project Setup (Web & Auth)** | **Active** |
| 02 | Electric SQL Integration | Pending |
| 03 | Durable Streams Setup | Pending |
| 04 | Tracer Bullet: The Room | Pending |

## 4. Current Focus: Phase 01
**Goal:** Transform `packages/web` into a fully authenticated app with Tailwind v4 and Shadcn.
**Spec File:** `specs/plan/01-project-setup.md`
