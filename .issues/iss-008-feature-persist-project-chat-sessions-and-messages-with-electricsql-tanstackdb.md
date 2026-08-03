# Feature: Persist Project Chat Sessions and Messages with ElectricSQL + TanStackDB

**See:** [GitHub Issue #49](https://github.com/propagateco/structa/issues/49)

Status: needs-triage
**Decisions:** governed by [iss-011-chat-map.md](iss-011-chat-map.md) — read before implementing.

## Description
Persist chat sessions and messages for project-scoped chat using ElectricSQL + TanStackDB. Sessions must be scoped by both `workspace_id` and `project_id`, with live sync behavior in the client.

## Acceptance Criteria
- [ ] Chat sessions persist with `workspace_id` and `project_id` associations.
- [ ] Chat messages persist and reload correctly on refresh.
- [ ] Assistant responses stream and reconcile into persisted message content.
- [ ] Live updates sync via Electric shapes/TanStackDB collections.
- [ ] Session titles are auto-generated (from first message heuristic) and stored.

## Tasks
- [ ] Add/confirm DB schema for `chat_sessions` and `chat_messages`.
- [ ] Add Electric shapes for session/message tables.
- [ ] Add TanStackDB collections and queries for sessions/messages.
- [ ] Persist user message on send and assistant message on stream completion/reconciliation.
- [ ] Ensure project-scoped session querying is enforced in data access layer.
- [ ] Add tests for persistence + sync behavior.
- [ ] Update docs with schema and data flow notes.

## Tracer Bullet Reference
Validated by tracer bullets for project streaming + multi-session UX.

## Additional Context
Workspace id is available via `user.workspaceId` in app context.

---

## Labels

`feature`
