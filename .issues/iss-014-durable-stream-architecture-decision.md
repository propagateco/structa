# Durable stream architecture decision

Type: wayfinder-grilling
Map: iss-011-chat-map.md
Status: open
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
