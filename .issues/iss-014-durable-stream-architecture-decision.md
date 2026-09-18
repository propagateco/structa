# Durable stream architecture decision

Type: wayfinder-grilling
Map: iss-011-chat-map.md
Status: resolved
Blocked by: iss-012-durable-stream-options-research.md

## Question

What is the durable-stream architecture for chat runs? Concretely: where do streamed chunks
live, how does a refresh/resume replay without duplicating output, what is the run lifecycle
(`running`/`complete`/`error`), and what does the event schema (`content` / `tool_call` /
`tool_result` / `done` / `error`) look like?

## Context

- Read iss-012's findings first (its resolution is the input to this decision).
- iss-004 (streaming TB) and iss-006 (resume/reconnect) both hinge on this: iss-006 requires
  "resume from last known cursor/offset" and "client-side deduplication strategy for chunk
  replay".
- The client already receives live row updates via ElectricSQL — if assistant content is
  written to `chat_messages` incrementally, the DB *is* the durable stream, and replay on
  refresh is free. The decision is whether that's sufficient or a separate event log is needed.
- Pinned constraint: `project_id` is a mock slug (no projects table); `user.workspaceId` is
  nullable text on the user row.

## Resolution shape

A written decision (grilling, one question at a time): the chosen architecture, the event
schema, the resume/dedupe semantics, and the run-state model. Recorded as a resolution
comment on this ticket; close it; append a gist line to the map's "Decisions so far".
Feeds iss-015 (endpoint), iss-016 (persistence schema).

## Resolution

Grilled one question at a time with the user (2026-08-03); all seven confirmed. Research
input: `docs/research/chat/durable-stream-options.md` (iss-012).

1. **Core architecture — (a1): append-only `chat_run_events` table in Neon Postgres, ElectricSQL
   as live delivery + replay/reconnect.** PK `(run_id, seq)` is ordering + client dedupe. Client
   subscribes to the shape, folds `content` deltas in `seq` order; refresh/replay re-hydrates
   from the shape — byte-identical, never duplicated. Rejected (a2) in-place `chat_messages`
   content updates (no log, no per-tool granularity, nothing for iss-006's cursor).
2. **Run lifecycle state model.** `chat_runs.status` (`running`|`complete`|`error`) is the
   single source of truth, set by the backend — never derived by re-scanning events. Terminal
   `done`/`error` events are ALSO stored as `chat_run_events` rows (event-log completeness; the
   shape is self-describing; matches Electric's Durable Sessions stop/error chunks).
3. **SSE fast-path — skipped for v1.** POST `/api/chat/run` acks with `runId`; live delivery
   rides Electric (already deployed, sub-100 ms). Reversible with zero schema change — SSE
   would just mirror the event log.
4. **Write cadence — per chunk, no coalescing timer.** Each streamed chunk is its own
   `chat_run_events` row, `seq++` per chunk (matches SolidType reference + Electric Durable
   Sessions; the sync engine absorbs write volume). Batching is a future tuning only if the
   Lambda→Neon per-append round-trip ever costs.
5. **Materialize on error — yes, iff partial content.** Assistant `chat_messages` row
   materialized on `error` too (folded text, `status: 'error'`); no assistant row when the run
   failed before producing any content (the `chat_runs` row records it; retry affordance hangs
   off the user message).
6. **Multi-tab — one active run per session, no per-tab cursor, no SharedWorker.** Backend
   rejects POST while a `running` run exists for the session (409 "Run already in progress");
   client composer locks from the shared shape. All tabs converge via the shape. (Replaces the
   vision doc's SharedWorker idea — map out of scope.)
7. **`seq` assignment — in-process `seq++` counter in the run's write loop.** Single-writer
   invariant: one active run per session; retry after failure = new `runId`; `(run_id, seq)` PK
   is the dedupe/net (duplicate insert fails loudly). Schema mechanics (int vs bigint, PK
   constraints) → iss-016.

**Transferable patterns adopted** (from SolidType reference + Electric Durable Sessions):

- **Client-generated `run_id`** — client creates it and subscribes to the events shape before
  POST returns; rendering starts the instant rows land; enables an idempotent POST (retried
  POST with an existing `runId` returns the existing run, not a second one).
- **Stale-run recovery** — any run still `running` past ~5 min is marked `error` on the next
  POST (Lambda crash resilience). Feeds iss-006 (resume/reconnect).
- **`seq` per run** (not per message) — simple cursor model.
