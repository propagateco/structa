# Tracer Bullet: Project Chat Multi-Session UX (Create + Switch Sessions)

**See:** [GitHub Issue #48](https://github.com/propagateco/structa/issues/48)

Status: needs-triage
**Decisions:** governed by [iss-011-chat-map.md](iss-011-chat-map.md) — read before implementing.

## Goal
Validate multi-conversation UX within a single project chat surface before persistence work lands.

## Minimal Scope
- Add a sessions sidebar/panel on `/app/projects/:projectId/chat`.
- Implement create-new-session interaction (in-memory is acceptable for tracer bullet).
- Implement session switching interaction and active-session state.
- Ensure selected session drives which stream/messages are shown.
- Keep to happy path; no deep persistence/error recovery yet.

## Acceptance Criteria
- [ ] User can create a new chat session in the project chat UI.
- [ ] User can switch between sessions in the sidebar/panel.
- [ ] Active session selection controls displayed streamed output.
- [ ] Document UX/state learnings for persistence phase.

## Related Feature
Unlocks: persisted sessions/messages and all-chats view.

## Additional Context
This tracer bullet should follow and build on the project chat streaming tracer bullet.

---

## Labels

`tracer-bullet`
