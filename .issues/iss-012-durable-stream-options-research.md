# Durable stream options research

Type: wayfinder-research
Map: iss-011-chat-map.md
Status: resolved

## Question

What are the concrete options for "durable stream" chat output in this stack, and what should
the event schema look like? The issues (iss-004, iss-006) require output that survives refresh
and resumes without duplication — but "durable" is undefined today.

## Context

- iss-004 says: "Write stream chunks to durable stream using the SolidType event schema" with
  events `content`, `tool_call`, `tool_result`, `done`, `error` — **that schema does not exist
  anywhere in this repo**; it needs defining.
- iss-006 requires: resume from last known cursor/offset, client-side dedupe on replay, run
  lifecycle (`running`/`complete`/`error`), retry UX.
- The backend is Hono + Postgres (via `postgres` driver) + SST functions. No AI SDK is installed.
  ElectricSQL syncs Postgres tables to the client — so persisted rows are a natural "durable"
  source the client already receives live.
- `docs/core/architecture/ai-clerk/tanstack-ai.md` sketches the vision (streaming, durable
  state) but is not a spec.

## What to produce

Research findings (AFK via /research subagent) covering, at minimum:

1. Streaming transport options from a Hono/SST function: SSE vs WebSocket vs poll. Trade-offs
   for a chat composer that must survive page refresh.
2. How "durable" is achieved in practice: (a) persist assistant content incrementally to
   Postgres as it streams and treat rows as the source of truth (client replays from DB on
   reconnect), (b) a separate event store/log with cursor replay, (c) SSE-only with session
   affinity. Compare with the Electric sync reality (client already gets row-level live updates).
3. A proposed event schema for `content` / `tool_call` / `tool_result` / `done` / `error` —
   shape of each event, how chunks merge into a message, where run status lives.
4. Whether TanStack AI / the Vercel AI SDK's `onChunk`/stream handling changes any of the above
   (overlap with iss-013 — note where, don't duplicate).

Resolution: findings captured as markdown in `docs/research/chat/` (or similar), context
pointer appended here, ticket closed. Feeds iss-014 (architecture decision).

## Resolution

Research findings captured in `docs/research/chat/durable-stream-options.md`. Gist: make
the durable stream an append-only `chat_run_events` table in the existing Neon Postgres
((run_id, seq) PK, seq = cursor), with ElectricSQL as both the live delivery transport and
the refresh/replay/dedupe mechanism — the client already gets sub-100 ms row-level updates
via shapes, so durability is free and SSE/WebSocket become optional latency fast-paths
(SSE is capped at ~60 s through the CloudFront Router and Lambda response streaming has a
no-flush ~100 KB buffer, so it is not a durability mechanism). The event schema
(`content`/`tool_call`/`tool_result`/`done`/`error` as jsonb payloads folded in seq order)
and the run lifecycle (`chat_runs.status` as the state machine) are defined, with open
questions on coalescing, SSE fast-path placement, and `seq` assignment flagged for iss-014.
