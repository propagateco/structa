# Feature: Editable Chat Session Titles

**See:** [GitHub Issue #52](https://github.com/propagateco/structa/issues/52)

Status: needs-triage
**Decisions:** governed by [iss-011-chat-map.md](iss-011-chat-map.md) — read before implementing.

## Description
Allow users to rename chat sessions after auto-generated title creation, with updates synced and reflected throughout project and all-chats views.

## Acceptance Criteria
- [ ] User can edit a chat session title inline.
- [ ] Title changes persist to DB and sync to clients.
- [ ] Updated titles render in both project chat sidebar and workspace all-chats index.

## Tasks
- [ ] Add inline title edit UI and validation rules.
- [ ] Add update mutation for session title.
- [ ] Wire optimistic UI update and Electric reconciliation.
- [ ] Add tests for title editing and sync propagation.

## Tracer Bullet Reference
Depends on persistence feature foundation.

## Additional Context
Default title remains auto-generated from initial user message; user edit overrides it.

---

## Labels

`feature`
