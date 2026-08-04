# Chat run endpoint & streaming transport

Type: wayfinder-grilling
Map: iss-011-chat-map.md
Status: resolved
Blocked by: iss-013-ai-provider-sdk-research.md, iss-014-durable-stream-architecture-decision.md

## Question

What exactly is `POST /api/chat/run`? Request/response contract, streaming transport (SSE vs
WebSocket vs poll), where it lives (Hono route on `packages/backend` vs TanStack server
function on `packages/web`), how it writes through to the durable store, and how run lifecycle
is wired to the stream.

## Context

- iss-004 minimal scope: "Add `POST /api/chat/run` endpoint using TanStack AI for model
  streaming" + "Write stream chunks to durable stream". Accepts a message, returns streamed
  assistant output.
- Read iss-013's findings (stack choice) and iss-014's decision (durable architecture) first —
  both block this ticket.
- Backend today: Hono routes under `packages/backend/src/api/routes/` (auth, user, storage,
  health, waitlist); tRPC is the client-write path for synced data (see `lib/collections.ts`).
- Multi-session UX (iss-009) and the composer mean the endpoint must accept a session id, not
  just a project id.

## Resolution

Grilled (Q1–Q3), all confirmed by the user.

**Placement — same-origin web proxy → backend, server-to-server.**
- Browser calls `POST /api/chat/run` on the **web platform** (a TanStack file route
  `routes/api/chat/run.ts`, `$.ts`-style like `routes/api/auth/$.ts`); the route relays
  server-to-server to the backend Hono route (`packages/backend/src/api/routes/chat.ts`) with a
  shared internal credential. **Not** the direct `hc` client → `https://api.<domain>/chat/run`.
- Rationale: the web app is self-contained today (tRPC `/api/trpc/$`, auth `/api/auth/$`,
  Electric `/api/users` all same-origin; `lib/api.ts` `hc` client is unused). Cross-subdomain
  cookies are gated to deployed stages (`isDeployedStage` in `packages/web/src/lib/auth.ts`);
  previews (pr-N) use host-only cookies, so a direct browser→api.<domain> call 401s there. The
  proxy keeps SSE + cookies same-origin in every stage.

**History — server-loaded, the client does not pass it.**
- The endpoint loads prior turns by `sessionId` from `chat_messages`/`chat_run_events`
  (SolidType `hydrateTranscript` style) and folds them into the model request; the request body
  has no `history` field.
- The iss-014 409 one-active-run guard guarantees the loaded history is complete → **no client
  caps needed** (no token-cost abuse surface from client-passed history).
- Implication: the minimal persistence schema (`chat_runs` + `chat_messages`) ships **with the
  tracer bullet** — iss-016's schema work is pulled forward.

**Data residency / key policy / model.**
- **US processing accepted for the MVP** — residency is not a tracer-bullet blocker.
- Default model: **OpenAI `gpt-5.6-luna`** (`$0.20`/`$1.20` per 1M tokens, 1.05M context) —
  user decision; gpt-4.1-mini is "quite old". **Supersedes the iss-013 recommendation.**
- **EU-hosted open-weight path**: Scaleway Generative APIs (Paris, GDPR, OpenAI-compatible) /
  Mistral (France) — a one-line swap behind `@tanstack/ai-openai`'s `baseURL`. Keep the model
  construction provider-agnostic (thin adapter; tool schema intact) so models are easy to swap.
  Default to the cheap model for now.
- **MCP / agent-native exposure**: user's stated future direction, **out of scope for v1**; the
  `tool_call`/`tool_result` event schema leaves room. Revisit in a future session.
- Per-user **soft rate cap (~30 runs/hr)** on the provider key; enforceable because history is
  server-loaded.

**Unchanged from iss-013/014 (restated for the build):** Hono route behind
`authenticatedMiddleware` + `zValidator` (the `waitlist.ts` pattern); `streaming: true` +
`streamHandle` in `infra/api.ts` / `api.ts`; SSE `text/event-stream` responses with the
five-event schema (`content`/`tool_call`/`tool_result`/`done`/`error`); write-through to
`chat_run_events` via the iss-014 pipeline. No SSE fast-path in v1 — the POST acks a JSON
`{runId}` (202-style), idempotent per runId, 409 on a concurrent run; Electric delivers the
stream.

Feeds iss-017 (UX). Unblocks the iss-004 streaming build.
