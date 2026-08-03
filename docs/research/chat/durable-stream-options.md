# Durable Stream Options for Chat Runs

## Overview

This documents the concrete options for "durable stream" chat output in Structa's stack,
and proposes the event schema the chat issues reference but never define (`content`,
`tool_call`, `tool_result`, `done`, `error`). It is the research input to
[iss-014](../../../.issues/iss-014-durable-stream-architecture-decision.md) (the grilling
ticket that picks the architecture) and is scoped to iss-004 (streaming TB) + iss-006
(resume/reconnect).

**Stack reality (verified in this repo):**
- API = one Hono app (`packages/backend/src/api/api.ts`) served by a single
  `sst.aws.Function` (`infra/api.ts`) — Lambda function URL, **2-minute timeout**,
  **`streaming` NOT enabled today** — fronted by an `sst.aws.Router` (CloudFront) at
  `api.<domain>`. Handler is `hono/aws-lambda` `handle()` (buffered), not `streamHandle()`.
- DB = Neon Postgres 17, logical replication on (`enableLogicalReplication: "yes"`),
  linked to ElectricSQL (`infra/sync.ts`). Backend uses the `postgres` driver.
- Client = TanStack Start + `@tanstack/react-db` + `@electric-sql/client`. Live row sync
  pattern already exists: `packages/web/src/lib/collections.ts` (`usersCollection`, shape →
  `snakeCamelMapper` → timestamp parser → `onUpdate` → tRPC write → `txid` confirm).
- Writes are tRPC for synced data; Hono for everything else. No AI SDK installed (that's
  iss-013).

---

## 1. Transport options compared

Three candidate ways to push assistant output from a Hono/Lambda route to the browser.

| Option | Works in this stack? | Survives refresh / reconnect? | Cost & caveats |
|---|---|---|---|
| **SSE** (`hono/streaming` `streamSSE`) | Yes, but only after enabling Lambda response streaming: `sst.aws.Function({ streaming: true })` + switch handler to `streamHandle()` from `hono/aws-lambda`. Not possible with today's `handle()` + no `streaming` flag. | Native `EventSource` auto-reconnect + `Last-Event-ID`, **but** a Lambda invocation ends when the response ends — the server is gone; nothing to resume from without a store. So SSE alone does NOT give durability. | Capped at **60 s through the Router**: SST `RouterUrlRouteArgs.readTimeout` default 20 s, max 60 s; AWS docs: "CloudFront will end the connection if the complete response from the origin takes longer than 60 seconds to complete." Chat runs can exceed this (function timeout is 120 s). Lambda response streaming also has an internal ~100 KB buffer with **no flush API** — small SSE events arrive in bursts unless padded (SSE comment `: <spaces>`) — documented by AWS Builder Center (Feb 2026). |
| **SSE direct to function URL** | Yes — bypasses the Router; function URL is already public + CORS. | Same as SSE: needs a store to resume from. | Avoids the CloudFront 60 s cap, but the function URL hostname is unstable across deploys, leaks infra, and loses the Router's domain/caching. Only worth it if SSE must run > 60 s. |
| **WebSocket** | **No** on Lambda function URLs (no HTTP 101 upgrade). Requires a separate API Gateway WebSocket API: `$connect` / `$disconnect` / `$default` routes, a connection registry (DynamoDB), and `postToConnection` fan-out. | Reconnect must resubscribe and re-hydrate from scratch; no `Last-Event-ID`. | Whole new subsystem + external state for a **one-way** server→client stream. Rejected. |
| **Long-poll** | Yes, but pointless here. | Trivial (cursor = last seq). | Bounded by the same CloudFront/Lambda timeouts; adds request churn and poll-interval latency. Rejected as the primary transport. |
| **ElectricSQL shape log** (the repo's existing live delivery) | **Already deployed and working** (`collections.ts`). Electric streams row changes from Postgres to the client over HTTP with sub-100 ms latency (Trigger.dev measured sub-100 ms to browsers at 20k updates/s). | Refresh/reconnect/replay is literally the sync engine's job — shapes re-hydrate, rows are the source of truth, ordering and dedupe are built in. | Requires rows in Postgres (which is exactly the durability layer we want anyway). Zero new transport infra. |

**Verdict for a composer that must survive refresh:** SSE and WebSocket are transports, not
durability mechanisms, and in this stack they are the *hard* path (Lambda streaming quirks,
CloudFront 60 s cap, no WS on function URLs). The stack already contains a durable, live,
replayable delivery mechanism: Electric synced Postgres rows. Use that as the delivery
path; treat any SSE as an optional latency fast-path only.

---

## 2. Durability approaches compared

### (a) Persist assistant content incrementally to Postgres; rows are the source of truth; client replays from DB on reconnect (free via Electric)

The client already subscribes to synced tables and gets row-level live updates. Write each
produced chunk to Postgres as it streams; Electric pushes the row to every subscribed client;
on refresh the shape re-hydrates the full run. Ordering + dedupe are the DB/sync engine's
problem, not app code.

Two sub-forms:

- **(a1) Append-only event log** (`chat_run_events`, insert-only) — the natural home for the
  chat event schema (`content`/`tool_call`/`tool_result`/`done`/`error`). Append-only
  inserts are the ideal shape for sync (no conflicts, no updates). Cursor = `seq`. This is
  the "durable stream" the tickets keep referencing.
- **(a2) In-place UPDATE of a `chat_messages.content` column** per chunk — simpler schema,
  but there is no log, no per-tool granularity, and no replayable history of partial states.
  "Resume from last cursor/offset" (iss-006) has nothing to point at.

### (b) Separate event store/log with cursor replay

If hosted in Postgres, (b) IS (a1) — Postgres already gives durability + ordering + Electric
gives delivery + replay. A separate store (Redis / Kafka / DynamoDB / a second DB) adds
infra, a second source of truth, and an extra hop for no benefit at this scale. Rejected as
an extra system.

### (c) SSE-only with session affinity

Session affinity is meaningless on stateless Lambda invocations; a reconnect hits a new
invocation with no memory of the run; CloudFront caps the stream at ~60 s; a refresh loses
everything not yet rendered. Only viable as a **fast-path layered on top of (a)**, never as
the durability mechanism.

### Recommendation

**Adopt (a1): an append-only `chat_run_events` table in the existing Neon Postgres, with
ElectricSQL as the delivery/replay transport.** This is simultaneously the "durable stream"
(iss-004) and the "resume from cursor" mechanism (iss-006) — no new infrastructure. The
Hono run endpoint writes events as it consumes the model stream (coalesced, ~5-10 writes/s);
Electric fans them out live; the client folds events into the rendered message and
re-hydrates on refresh; `seq` is the cursor, `(run_id, seq)` is the dedupe key.

SSE from the Hono route is **optional for v1** (see §7). If measured Electric latency is
unsatisfactory it can be added later **without any schema change**, because the event log is
already the contract — the SSE stream just mirrors it. Rationale for skipping it in v1: it
needs an infra change (`streaming: true` + `streamHandle`), is capped at 60 s through the
Router, and has Lambda's burst-buffering quirk — all for a ~100 ms latency gain over a
mechanism that is already deployed and already does durability for free.

---

## 3. Proposed event schema

### Tables

```
chat_runs
  id            uuid PK
  session_id    uuid  → chat_sessions   (iss-008/009; composer sends session id per iss-015)
  project_id    text                    (mock slug, pinned — no projects table)
  user_id       uuid
  status        'running' | 'complete' | 'error'     ← run lifecycle lives HERE
  error_code    text NULL
  error_message text NULL
  created_at    timestamptz
  updated_at    timestamptz

chat_run_events                          (the durable stream; insert-only)
  run_id        uuid → chat_runs.id
  seq           int                     (monotonic per run — the cursor/offset)
  type          'content' | 'tool_call' | 'tool_result' | 'done' | 'error'
  payload       jsonb                   (shape varies by type, below)
  created_at    timestamptz
  PK (run_id, seq)                      (also the client dedupe key)
```

`seq` assignment must be monotonic per run under concurrency (advisory lock on the run row,
or `SELECT ... FOR UPDATE`/serial counter) — flag for iss-014/iss-016.

### Event payloads

```ts
// content — one incremental text delta of the assistant message
{ type: "content", seq: n, payload: { delta: string } }

// tool_call — a tool invocation started (v1 may have zero tools; schema reserves the slot)
{ type: "tool_call", seq: n, payload: { call_id: string, name: string, arguments: Record<string, unknown> } }

// tool_result — outcome of a tool call; call_id links to the matching tool_call event
{ type: "tool_result", seq: n, payload: { call_id: string, output: unknown } }

// done — terminal, success. optional message_id of the materialized chat_messages row
{ type: "done", seq: n, payload: { message_id?: string } }

// error — terminal, failure
{ type: "error", seq: n, payload: { code: string, message: string, retryable: boolean } }
```

### How chunks merge into a complete assistant message

- **Client**: subscribe to the `chat_run_events` shape for the active run; fold `content`
  deltas in `seq` order into the message text; render `tool_call`/`tool_result` as cards.
  On refresh the shape re-hydrates all events — replay is a fold over the same ordered rows,
  so output is byte-identical and never duplicated. `seq` gaps mean "more coming".
- **Server (materialization)**: on a terminal event (`done`/`error`), fold the same deltas
  and upsert one `chat_messages` row per run (role `assistant`, `content` = folded text,
  `status` = run status). This keeps the session-history/all-chats queries (iss-007/008/009)
  a simple read without folding, and preserves partial content on `error`.

### Where run status lives

On `chat_runs.status`, set by the backend: `running` at run start, `complete`/`error` at the
terminal event. The `done`/`error` events are the in-stream mirrors of that status for
subscribers who only watch the event shape. Status is **not** derived by re-scanning events —
the run row is the state machine (and is what the client shows for `running`/`complete`/
`error`, iss-006).

---

## 4. Run lifecycle

```
POST /api/chat/run { session_id, project_id, message }
  1. Insert chat_runs (status=running); user message → chat_messages (once — idempotency key)
  2. Stream model output; per coalesced batch insert chat_run_events rows
  3. On finish → insert { type:"done" } + set chat_runs.status='complete'
     On failure → insert { type:"error", retryable } + set chat_runs.status='error'
  4. Materialize chat_messages assistant row (folded content) on terminal
Client: run list + events come from the two shapes; retry = re-POST with same idempotency key
        (new run writes its own events; old error run stays as history)
```

Refresh mid-run: the events shape re-hydrates and keeps appending as new inserts arrive —
the "resume from last known cursor" (iss-006) is the sync engine's existing behavior, not
new code. Client-side dedupe = rely on `(run_id, seq)` PK; a rendered-event set keyed by
`seq` makes any SSE hint idempotent too.

---

## 5. AI SDK interaction (brief — iss-013 owns SDK selection)

`streamText` (Vercel AI SDK) returns `textStream` (`AsyncIterable<string>`) and `fullStream`
(typed parts: `text-delta`, `tool-call`, `tool-result`, `finish`, `error`, …), plus
`onChunk`/`onFinish` hooks. The mapping to our schema is 1:1 — consume **one** surface
(consuming `textStream` consumes `fullStream`):

- `text-delta` / `onChunk.textDelta` → `content` event
- `tool-call` → `tool_call` event
- `tool-result` → `tool_result` event
- `finish` / `onFinish` → `done` event + run status `complete`
- thrown error / `error` part → `error` event + run status `error`

The SDK's own SSE helpers (`toDataStreamResponse`, `toUIMessageStream`, `useChat`) are **not
required**: our transport is Postgres + Electric, and our event schema is the wire contract
(decided here, so it survives SDK swaps). If an SSE fast-path is added, we hand-roll
`streamSSE` with our event shape rather than adopting the SDK's UI-stream protocol. Model
provider, SDK choice, key management → iss-013.

---

## 6. Open questions for iss-014 (grilling)

**All six resolved — see [iss-014's Resolution](../../../.issues/iss-014-durable-stream-architecture-decision.md).**
Answers in brief: per-chunk writes (no timer); SSE skipped for v1; materialize on error iff
partial content; terminal events stored as rows (yes); multi-tab = one active run per session,
no per-tab cursor; `seq` = in-process counter (single writer), mechanics to iss-016.

1. **Coalescing policy** for `content` inserts (fixed ~100-200 ms interval vs char-threshold
   vs per-tool-boundary) — drives Neon write volume (autoscaling floor 0.25 CU) against
   perceived latency. Needs a decision or a spike.
2. **SSE fast-path placement**: accept the 60 s CloudFront cap (through the Router, via
   `readTimeout`), or bypass the Router via the function URL (auth/CORS implications) for
   runs up to 120 s? Or skip SSE entirely for v1 (recommended) and revisit with measured
   latency?
3. **Materialize on `error` too** (partial content preserved) — confirm the interrupted-run
   shape in the session history view, and whether a failed run is re-renderable.
4. **Store terminal events** (`done`/`error`) as rows even though they're derivable from run
   status — recommend yes for event-log completeness; confirm no objection.
5. **Multi-tab concurrency** (map fog): shape sync means every tab sees the same events and
   converges; only the composer POSTs. Confirm no per-tab cursor persistence is needed.
6. **`seq` assignment** under concurrency/retries (advisory lock vs serial) — hand to
   iss-016 (persistence schema).

---

## 7. Sources

- AWS Lambda — Response streaming for Lambda functions (function URLs / RESPONSE_STREAM
  invoke mode): https://docs.aws.amazon.com/lambda/latest/dg/configuration-response-streaming.html
- AWS Lambda — Writing response streaming-enabled functions (`awslambda.streamifyResponse`):
  https://docs.aws.amazon.com/lambda/latest/dg/config-rs-write-functions.html
- Hono — AWS Lambda getting started (`streamHandle` for streaming): https://hono.dev/docs/getting-started/aws-lambda
- Hono — Streaming helper (`stream`, `streamText`, `streamSSE`, `writeSSE`):
  https://hono.dev/docs/helpers/streaming (and `hono/streaming/sse.ts` source)
- SST — Function component (`streaming` prop, `streamifyResponse` requirement):
  https://sst.dev/docs/component/aws/function
- SST — AWS Hono streaming example (`streaming: true` + `streamHandle` + curl `--no-buffer`):
  https://sst.dev/docs/examples/aws-hono-stream
- SST — Router component (`RouterUrlRouteArgs.readTimeout`: default 20 s, max 60 s):
  https://sst.dev/docs/component/aws/router
- AWS CloudFront — Origin settings: "CloudFront will end the connection if the complete
  response from the origin takes longer than 60 seconds to complete":
  https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistValuesOrigin.html
- AWS Builder Center — "The Curious Case of SSE Streaming Agent Responses on AWS Lambda"
  (~100 KB internal buffer, no flush API, SSE-comment padding workaround, applies to
  function URLs too), Feb 2026: https://builder.aws.com/content/39iqpehwjnn2TuNmGnHAnsMcHmP/the-curious-case-of-sse-streaming-agent-responses-on-aws-lambda
- Trigger.dev — "How we built a real-time service that handles 20,000 updates/sec"
  (ElectricSQL shape delivery measured sub-100 ms to browsers; Postgres WAL + shapes):
  https://trigger.dev/blog/how-we-built-realtime
- Electric — Postgres Sync / shapes: https://electric.ax/sync/postgres-sync
- Vercel AI SDK — `streamText` reference (`textStream`, `fullStream`, `onChunk`, parts):
  https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text
- Vercel AI SDK — Stream protocols (UI message stream parts, for the iss-013 seam note):
  https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol
- AWS re:Post — CloudFront custom-origin response/keep-alive timeouts (defaults and quota
  increases): https://repost.aws/knowledge-center/cloudfront-custom-origin-response
