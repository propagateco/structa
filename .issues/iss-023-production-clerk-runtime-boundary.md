# Production Clerk runtime boundary

Type: wayfinder-grilling
Map: iss-020-production-chat-workspace-map.md
Status: resolved

## Question

How does the promoted Sessions Rail UI connect to the existing Clerk backend and resolved `iss-015` run transport while preserving durable streaming, retries, tool events, project context, and full-history reconstruction?

## Resolution shape

A written decision mapping the production runtime/adapter boundary, request and response ownership, project-context injection, run lifecycle, and the mock-runtime retirement plan.

## Answer

The production `/app` chat keeps assistant-ui's rendering model but replaces the mock adapter with
a production `ExternalStoreRuntime` adapter backed by the persisted conversation collections and
the active conversation's event fold.

- **Runtime boundary:** the web UI owns the assistant-ui adapter and presentation state. The
  same-origin `/api/chat/run` route remains the browser entry point and proxies server-to-server
  to the Clerk backend according to `iss-015`. The backend owns authorization, history loading,
  message/run/event writes, model execution, and terminal lifecycle.
- **Send:** `onNew` creates client `sessionId`, `messageId`, and `runId` values where needed,
  renders an adapter-local user echo immediately, and POSTs the run request with the
  conversation-owned project context. The backend is authoritative; persisted collection rows
  reconcile the local echo by `messageId` and the run by `runId`.
- **History:** the client never sends conversation history. The backend loads the authoritative
  history by conversation/session id. The UI initially loads the recent message window defined by
  `iss-022` and requests older pages on demand.
- **Live run state:** the UI subscribes to the active conversation's Electric event shape only.
  It folds `(run_id, seq)` events into assistant bubbles, tool-call/tool-result state, terminal
  status, and errors. No direct SSE stream is needed for the UI; the POST returns the resolved
  acknowledgement contract and Electric is the live/recovery path.
- **Tools:** `tool_call` and `tool_result` events replay as the existing collapsible tool chips,
  including running and error states. The concrete v1 tool set remains a later decision.
- **Failures and retry:** failed bubbles remain visible. Retry creates a new `runId` for the same
  user message and appends a new attempt; the failed attempt is retained in history.
- **Concurrency:** retain the resolved `iss-014`/`iss-015` one-active-run guard. The composer is
  disabled while a run is active; queued messages and parallel runs are explicitly deferred so
  they do not silently conflict with the persisted run state machine.
- **Project context:** a conversation owns its project context. Reopening it uses that context even
  when the user is browsing another project in the global workspace.
- **Migration:** replace `/app` with Sessions Rail immediately, remove the prototype route,
  floating variant switcher, and mock runtime after the production adapter lands. There is no
  permanent mock/demo route in the production product.
