# Chat run endpoint & streaming transport

Type: wayfinder-grilling
Map: iss-011-chat-map.md
Status: open
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

## Resolution shape

A written decision: endpoint contract (path, method, body, stream format), transport,
placement, write-through behavior, error/retry semantics. Close and gist to the map.
Feeds iss-017 (UX), and unblocks the iss-004 build.
