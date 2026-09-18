# Tracer Bullet: Project-Scoped Chat with TanStack AI + Durable Streams

**See:** [GitHub Issue #53](https://github.com/propagateco/structa/issues/53)

Status: needs-triage
**Decisions:** governed by [iss-011-chat-map.md](iss-011-chat-map.md) — read before implementing.

## Goal
Validate a project-scoped chat route using TanStack AI with SolidType-style durable stream output, rendered live in the client.

## Minimal Scope
- Implement `/app/projects/:projectId/chat` route.
- Add pathless `_chat.tsx` layout containing the chat input/composer.
- Add `chat.tsx` child route rendering streamed assistant output.
- Add `POST /api/chat/run` endpoint using TanStack AI for model streaming.
- Write stream chunks to durable stream using the SolidType event schema.
- Subscribe client UI to durable stream and render incoming chunks.
- Happy path only; defer edge/error handling and polish.

## Acceptance Criteria
- [ ] User can send a message from `/app/projects/:projectId/chat` and receive a streamed assistant response.
- [ ] Durable stream output is visible in the client and drives rendered chat updates.
- [ ] Chat input lives in `_chat.tsx` pathless layout, not per-child route.
- [ ] Document implementation learnings and constraints for follow-on phases.

## Related Feature
Unlocks: persistence, multi-session UX, workspace-wide chat index.

## Additional Context
- Use SolidType durable stream event conventions (`content`, `tool_call`, `tool_result`, `done`, `error`).
- Workspace context will come from `user.workspaceId` in follow-up phases.

---

## Labels

`tracer-bullet`
