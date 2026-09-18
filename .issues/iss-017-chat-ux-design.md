# Chat UX design

Type: wayfinder-prototype
Map: iss-011-chat-map.md
Status: resolved
Blocked by: iss-015-chat-run-endpoint-streaming-transport.md

## Question

What should the project chat surface look and behave like? Raise fidelity with a rough
prototype: composer placement (pathless `_chat.tsx` layout per iss-004), sessions sidebar with
create/switch (iss-009), active-session state driving displayed output, message rendering
(react-markdown), run-state indicators + retry (iss-006), and wiring the existing `nav-chats.tsx`.

## Context

- iss-004 acceptance: chat input lives in a pathless `_chat.tsx` layout, not per-child route;
  route is `/app/projects/:projectId/chat`.
- iss-009 (multi-session TB): sessions sidebar/panel, create-new-session, switching, active
  session controls output. In-memory sessions acceptable for the TB.
- iss-006 adds run-state indicators (`running`/`complete`/`error`) and retry UX.
- Existing pieces: `nav-chats.tsx` (generic chat list sidebar, unwired), sidebar "New Chat" →
  `/app` item, mock `ProjectSwitcher`, `react-markdown` for assistant output, `sonner` for
  toasts, `vaul` for overlays.
- The endpoint contract (iss-015) must exist to prototype against; blocked by it.

## Resolution

Prototype (per /prototype skill) + written decisions on layout, sessions state model, and
message rendering. Asset: throwaway branch (pointer appended on capture).

**Sessions state model**
- Events subscribe via a **raw per-session shape hook** (`where session_id = $1` +
  `params[1]`, ownership pre-check per iss-016) — outside the TanStack DB collection model —
  folded by `(run_id, seq)` into the active run's bubble. `chat_sessions` / `chat_messages` /
  `chat_runs` are static user-level collections (`useLiveQuery`).
- **Active-session-only**: one events subscription follows the active session; tear down on
  switch (abort-on-unmount); returning reconstructs the finished run from the collections +
  replayed events.
- **Run-state source of truth**: the fetch promise while live (ack = terminal, iss-015); the
  `chat_runs` collection is the restore/verification layer (reload, tab restore, fetch failure,
  stale-run recovery).
- **New Chat** = a local client-generated session row; the backend upserts it on first run;
  empty sessions never persist (the sidebar lists only persisted sessions).

**Message rendering**
- One assistant bubble per run. `content` events stream into a single react-markdown bubble;
  `tool_call` / `tool_result` pairs render as inline collapsible chips; `done` reconciles with
  the materialized row (iss-016); `error` → error surface + retry.
- Tool chips **replay from durable events** — they persist in history (the reasoning trail),
  not just while streaming.

**Run-state + retry (iss-006)**
- **No stop button in v1**; the composer disables while a run is in-flight (the 409 guard
  bounds the window); navigating away lets the run complete server-side and materialize.
- Retry = a **new run** (new `runId`, iss-016); the failed attempt stays visible with its error
  state + partial content; the new bubble appends below.

**Assumptions (standard)**: composer fixed at bottom in the pathless `_chat.tsx` layout
(iss-004); sidebar left with sessions (title + `last_message_at` desc) + New Chat at top; Enter
sends / Shift+Enter newline; optimistic user echo reconciled by client `message_id` (iss-016);
failed bubble shows `run.error_message` + retry; `nav-chats.tsx` becomes the sessions list.

**Reference validation** (electric-sql/electric-ai-chat + examples/tanstack-db-web-starter):
DB-as-stream confirmed (rows, no SSE); fire-and-forget rejected (serverless kills the
invocation — terminal-ack stands); parameterized shape `where` (`$1 = ANY(...)` +
`params[n]`) adopted for the chat shape proxies; HTTP/2 multiplexing note for shape latency
(prod fine; dev benefit).

Feeds iss-018 (all-chats). Unblocks iss-004/iss-009.
