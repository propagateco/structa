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
| Phase | Focus | Status | Spec File |
| :--- | :--- | :--- | :--- |
| **01** | **Project Setup (Web & Auth)** | **Active** | See sub-phases below |
| 02 | Electric SQL Integration | Pending | (not yet created) |
| 03 | Durable Streams Setup | Pending | (not yet created) |
| 04 | Tracer Bullet: The Room | Pending | (not yet created) |

### Phase 01 Sub-Phases

| Sub-Phase | Name | Status | Spec File | Duration |
|-----------|------|--------|-----------|----------|
| 01.1 | Foundation & Tailwind v4 Setup | **Ready** | `01-foundation-tailwind.md` | 45-60 min |
| 01.2 | Authentication Backend | Pending | `02-authentication-backend.md` | 60-90 min |
| 01.3 | UI Components | Pending | `03-ui-components.md` | 90-120 min |
| 01.4 | Routes & Protected Pages | Pending | `04-routes-protected-pages.md` | 60-90 min |
| 01.5 | Testing & Validation | Pending | `05-testing-validation.md` | 30-45 min |

## 4. Current Focus: Phase 01.1
**Goal:** Set up Tailwind v4 with CSS-first configuration, Shadcn component library, and teal/cyan brand theme.
**Spec File:** `specs/plan/01-foundation-tailwind.md`
