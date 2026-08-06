# Map: The Clerk — Chat Suite Foundation

Type: wayfinder-map
Status: open

## Destination

Every architectural decision for Structa's project-scoped AI chat (The Clerk) is resolved
and documented, so the six chat issues can be implemented end-to-end by a build agent:
streamed assistant responses (durable), persisted + Electric-synced sessions/messages,
multi-session UX, editable titles, a workspace-wide all-chats index, and resilient
reconnection — all with workspace/project scoping enforced.

## Notes

- **Domain**: The Clerk — a context-aware renovation Q&A assistant. Read
  `docs/core/overview.md` first (product vision: shared workspace, source citations,
  fast-path chat), then `docs/core/architecture/ai-clerk/tanstack-ai.md` (TanStack AI
  vision — note its OCCT/SharedWorker content is **not** applicable; ignore it).
- **Sync pattern to extend**: `packages/web/src/lib/collections.ts` — the live
  `usersCollection` pattern (Electric shape → `snakeCamelMapper` → timestamp parser →
  `onUpdate` → tRPC mutation → `txid` confirm). Chat collections follow this.
- **Pinned at charting (no ticket)**: project identity stays the mock switcher slugs
  (`Bathroom`, `Kitchen`, `Guest Room` from `use-project-switcher.tsx`); chat tables store
  `project_id` as text, no FK, no `projects` table in this effort. Real projects/workspaces
  tables are a later effort (out of scope below).
- **Stack constraints**: TanStack Router file routes; `_auth` is `ssr:false` (Electric
  requirement) — chat lives under `_auth`; tRPC v11 for writes; Hono backend; shadcn UI;
  `react-markdown` for assistant output; `nav-chats.tsx` exists unwired.
- **Feature backlog**: `.issues/iss-004` (#53 streaming TB) → `iss-009` (#48 multi-session
  TB) → `iss-008` (#49 persistence) → `iss-005` (#52 titles) → `iss-007` (#50 all-chats) →
  `iss-006` (#51 resume). The tickets below resolve the *decisions* those issues depend on.
- **Skills**: `/research` (iss-012, iss-013), `/grilling` + `/domain-modeling` (iss-014,
  iss-015, iss-016, iss-018, iss-019), `/prototype` (iss-017). No `CONTEXT.md` exists yet —
  `/domain-modeling` creates it lazily when The Clerk vocabulary gets settled.
- **Open tickets**: scan `.issues/` for `Map: iss-011-chat-map.md` with `Status: open`.
  Frontier = open, unblocked, unclaimed (currently iss-018). Claim by setting
  `Status: claimed` before working.
- **Quality**: local checks only before commit (`npm run typecheck && npm run check:fix &&
  npm test`); UI verification via agent-browser + bot login.

## Decisions so far

- [Durable stream options research](iss-012-durable-stream-options-research.md) — durable stream =
  append-only `chat_run_events` table ((run_id, seq) PK, seq = cursor); ElectricSQL is live delivery
  + free refresh/replay/dedupe; SSE is an optional latency fast-path, not the durability mechanism
  (~60 s CloudFront cap, Lambda no-flush buffer). Event schema + run lifecycle defined in the findings.
- [AI provider + SDK research](iss-013-ai-provider-sdk-research.md) — **TanStack AI**
  (`@tanstack/ai` + `@tanstack/ai-openai`) on Hono with OpenAI default — on-vision
  for the all-TanStack repo; `chat()` AsyncIterable server-side + `toServerSentEventsResponse`
  SSE, AG-UI chunks mapped to the `content`/`tool_call`/`tool_result`/`done`/`error` schema; key
  as SST secret `OpenAIKey` (with fallback for pr-N previews); SSE via `streamHandle` +
  `streaming: true`. Vercel AI SDK kept as fallback if the Beta bites. Wire keeps the five event
  names — AG-UI is producer-internal behind the mapping. (Default model tier revised in iss-015 →
  gpt-5.6-luna.)
- [Durable stream architecture decision](iss-014-durable-stream-architecture-decision.md) —
  append-only `chat_run_events` ((run_id, seq) PK) in Neon, Electric = live delivery + free
  replay/reconnect; `chat_runs.status` is the run state machine; terminal `done`/`error` events
  stored as rows; SSE skipped for v1 (POST acks runId); per-chunk writes, no coalescing timer;
  assistant message materialized on error iff partial content; one active run per session (409
  guard), no per-tab cursor / SharedWorker; in-process `seq++` (single writer); client-generated
  run_id + idempotent POST; stale-run recovery (~5 min running → error).
- [Chat run endpoint & transport](iss-015-chat-run-endpoint-streaming-transport.md) —
  same-origin **web proxy → backend** (`routes/api/chat/run.ts` file route relays
  server-to-server with a shared internal credential; not direct `hc` → api.<domain> —
  cross-subdomain cookies only on deployed stages, previews 401). **Server-loaded history** by
  sessionId (no client-passed history; 409 guard ⇒ complete ⇒ no caps) — minimal
  `chat_runs`/`chat_messages` schema ships with the tracer bullet (iss-016 pulled forward).
  **Model default: OpenAI gpt-5.6-luna** ($0.20/$1.20 per 1M, 1.05M ctx; supersedes iss-013's
  gpt-4.1-mini). EU-hosted open-weight (Scaleway/Mistral) = one-line swap via adapter baseURL;
  MCP / agent-native exposure = future session, out of scope; US processing OK for MVP; per-user
  soft rate cap (~30 runs/hr).
- [Chat persistence schema & Electric sync](iss-016-chat-persistence-schema-electric-sync-design.md) —
  four tables, text PKs (client-generated uuids): `chat_sessions` (context enum
  project/editor/mcp/api, nullable `document_id` placeholder, title + denormalized
  `message_count`/`last_message_at`), `chat_messages` (role, content, `run_id` on assistant rows
  only, no status/updated_at), `chat_runs` (status running|complete|error + error_code/message),
  `chat_run_events` (PK (run_id, seq), **session_id denormalized** = session-scoped stream, jsonb
  payload, pgEnum type). Shapes: user-level `where user_id` for sessions/messages/runs +
  session-scoped events shape with an ownership pre-check. **Backend-owned writes** (user message
  idempotent by client `message_id`; sessions created on first run; client collections read-only;
  optimistic+txid pattern reserved for iss-005 title rename). Run lifecycle: 409 guard + stale-run
  recovery (~5 min); start in one tx; per-chunk `seq++` writes; terminal = done/error event +
  status + materialize assistant row (iff partial) + `message_count`/`last_message_at`. **Ack is
  the terminal response, not 202-early** (serverless; ~120 s run cap; fetch-failure → check
  `chat_runs.status`). Retry: same runId → existing run; new attempt → new runId.

- [Chat UX design](iss-017-chat-ux-design.md) — **raw per-session events shape hook** (outside
  collections, fold by `(run_id, seq)`); **active-session-only** subscription (tear down on
  switch, reconstruct from collections on return); **fetch promise** drives live run-state,
  `chat_runs` collection is restore/verification; **single bubble per run** with inline
  collapsible tool chips **replayed from durable events**; retry = new run appended below
  (failed bubble stays visible); **no stop button v1** — composer disables while in-flight;
  **New Chat** = local session upserted on first run. Prototype per /prototype on a throwaway
  branch. Feeds iss-018; unblocks iss-004/iss-009.

## Not yet specified

Fog toward the destination — graduates into tickets as the frontier advances:

- **Tool calling for The Clerk** — the durable event schema carries `tool_call` /
  `tool_result` events, but *which* tools (if any) v1 has is unresolved. Decided after the
  streaming foundation lands, when prompt context is real. (MCP / agent-native exposure is a
  later session — iss-015.)
- **Project context for prompts** — what The Clerk knows per project (floor-plan spatial
  data? survey docs? material specs?) and how it's injected. The vision says context-aware
  answers; the chat foundation must leave room without building it now.

## Out of scope

- **Real `projects` / `workspaces` tables + CRUD** — project identity is the mock slugs;
  a real domain model is a separate effort.
- **The full Clerk vision** — survey ingestion, RAG / source citations, material lists,
  sequencing validation (from `docs/core/overview.md`). Future efforts build on this
  chat foundation; the message schema should leave room for attachments/citations later.
- **Floor-plan editing / digital twin integration** with chat.
- **OCCT / CAD-kernel worker architecture** from `tanstack-ai.md`.
- **Multi-modal input / voice**.
