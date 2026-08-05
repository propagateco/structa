# Chat persistence schema & Electric sync design

Type: wayfinder-grilling
Map: iss-011-chat-map.md
Status: resolved
Blocked by: iss-014-durable-stream-architecture-decision.md

## Question

What is the `chat_sessions` / `chat_messages` schema and the ElectricSQL + TanStackDB sync
design? Columns, run-status representation, shapes (workspace + project scoping), collections,
optimistic updates with `txid` confirmation — extending the live `usersCollection` pattern.

## Context

- iss-008 (#49) is the feature: persist sessions scoped by `workspace_id` + `project_id`, live
  sync, auto-titles. iss-005 (titles) and iss-007 (all-chats view) build on it; iss-006
  (resume) needs run status persisted/derived.
- Follow the established pattern: `packages/web/src/lib/collections.ts` (`usersCollection` —
  `electricCollectionOptions`, `snakeCamelMapper`, timestamp parser, `onUpdate` → tRPC
  mutation → `txid`). New tables need Drizzle schema in `packages/core` (see
  `packages/core/src/auth/auth.sql.ts`), Electric shapes (proxy at
  `packages/web/src/lib/electric-proxy.ts`, shape endpoint `routes/api/users.ts`), and
  collection(s).
- Pinned constraint: `project_id` is a text slug (mock projects); `user.workspaceId` is
  nullable text — decide how scoping is enforced in the data access layer and shape params.
- Auto-title heuristic belongs here (or iss-019): first message → title.

## Resolution

Grilled (Q1–Q7), all confirmed by the user. "Durable streams" reconfirmed = **Option A**: the
Postgres `chat_run_events` log + Electric IS the durable stream (not the separate Electric
Durable Streams service) — iss-012/014 stand.

**Tables — text PKs everywhere, client-generated `crypto.randomUUID()`:**

```
chat_sessions
  id              text PK
  user_id         text FK → user.id
  project_id      text NOT NULL              (mock slug, pinned)
  context         ai_chat_context NOT NULL default 'project'
                  (pgEnum: project | editor | mcp | api — future trigger surfaces)
  document_id     text                       (nullable; NO FK yet — no documents table)
  title           text NOT NULL default 'New Chat'   (auto-title heuristic → iss-019)
  message_count   integer NOT NULL default 0         (denormalized, backend-owned)
  last_message_at timestamptz                (nullable)
  created_at / updated_at timestamptz NOT NULL

chat_messages
  id          text PK
  session_id  text FK → chat_sessions.id (cascade delete)
  user_id     text FK → user.id
  role        chat_role NOT NULL          (pgEnum: user | assistant)
  content     text NOT NULL               (assistant = folded text at terminal; user = message)
  run_id      text                        (nullable; assistant rows only)
  created_at  timestamptz NOT NULL        (no updated_at — append-only)
  idx (session_id, created_at), (user_id)

chat_runs
  id            text PK                   (client-generated run_id — iss-014)
  session_id    text FK → chat_sessions.id (cascade delete)
  user_id       text FK → user.id
  status        chat_run_status NOT NULL default 'running'
                (pgEnum: running | complete | error)
  error_code    text                      (nullable)
  error_message text                      (nullable)
  created_at / updated_at timestamptz NOT NULL

chat_run_events                          (the durable stream; insert-only)
  run_id      text → chat_runs.id
  session_id  text FK → chat_sessions.id (denormalized — stream scoping)
  seq         int                        (monotonic per run — the cursor)
  type        chat_event_type NOT NULL   (pgEnum: content | tool_call | tool_result | done | error)
  payload     jsonb NOT NULL             (per-type shape from iss-012 §3)
  created_at  timestamptz NOT NULL
  PK (run_id, seq)
  idx (session_id, seq)
```

Judgment calls: `context` + `document_id` kept for extensibility (user steer); `status`/
`durable_stream_id` dropped from sessions; `session_id` denormalized onto events so the table is
a **session stream** (the Postgres analogue of SolidType's one-stream-per-session); `project_id`
dropped from runs/messages (session-scoped); no message `status` (run row is the state machine);
no message `updated_at`; `type` as pgEnum (payload stays jsonb so payload shapes never migrate).

**Shapes (read path)** — four proxy routes following `routes/api/users.ts` (auth → where →
proxy):
- `/api/chat/sessions`, `/api/chat/messages`, `/api/chat/runs` → `where user_id = '<user>'`
  (user-level; project filtering client-side in `useLiveQuery`).
- `/api/chat/events` → `where session_id = '<sessionId>'` (the session-scoped stream shape)
  **with an ownership pre-check** (`SELECT chat_sessions WHERE id = $1 AND user_id = $2` →
  403/404) — `session_id` is not the auth identity, unlike the `user_id` columns.
- Client: four collections (`chatSessions/Messages/Runs/EventsCollection`) with
  `snakeCamelMapper` + `parsePgTimestamp`; events keyed `` `${run_id}:${seq}` ``.

**Write ownership (write path)** — backend-owned; the client collections are read-only shapes.
- User message: written by the run endpoint, idempotent by client `message_id`.
- Assistant message / runs / events: backend (single-writer, iss-014).
- Sessions: created by the backend on first run (idempotent by client `session_id`).
- The `usersCollection` optimistic + `txid` pattern is reserved for client-owned session
  metadata (title rename, iss-005). The client echoes its own message from local UI state,
  reconciled with the shape row by id.

**Run lifecycle** (`POST /api/chat/run {projectId, sessionId, message, messageId, runId}`):
1. **Guard**: 409 if the session has a `status='running'` run; **stale-run recovery** (~5 min
   `running` → mark `error`).
2. **Start (one tx)**: upsert session (create → 'New Chat'); insert user message
   (`ON CONFLICT DO NOTHING` by `message_id`); insert `chat_runs` `status='running'`.
3. **Stream**: per-chunk `chat_run_events` inserts (in-process `seq++` per run, no timer).
4. **Terminal (second tx)**: `done`/`error` event; `chat_runs.status` + `error_code`/`message`;
   materialize assistant `chat_messages` row (folded text, **iff partial content**);
   `chat_sessions.message_count += 1`, `last_message_at = now`.
5. **Ack = the terminal response** `{runId, status, usage}` — NOT 202-return-early: serverless
   kills the invocation when the response ends, so the Lambda runs the model to completion
   before returning (client already knows `runId`; stream arrives via Electric). Consequences:
   run length ≤ ~120 s Lambda timeout (longer runs killed mid-stream → no terminal event →
   stale-run recovery on next POST); past ~60 s CloudFront may drop the pending response → the
   client treats fetch failure as "check `chat_runs.status`" — the run row, not the ack, is the
   source of truth for completion.
6. **Retry**: same `runId` re-POSTed → return the existing run; new attempt → new `runId` (old
   error run stays as history).

Feeds iss-018 (all-chats), iss-019 (titles). Unblocks iss-008.
