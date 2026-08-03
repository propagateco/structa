# Feature: Durable Stream Resume and Reconnection for Chat Runs

**See:** [GitHub Issue #51](https://github.com/propagateco/structa/issues/51)

Status: needs-triage
**Decisions:** governed by [iss-011-chat-map.md](iss-011-chat-map.md) — read before implementing.

## Description
Add resilience for chat streaming so users can recover cleanly across refreshes/reconnects and continue in-flight runs without duplicated output.

## Acceptance Criteria
- [ ] Refresh during an active run resumes durable stream consumption.
- [ ] Reconnection does not duplicate message chunks or final content.
- [ ] Run lifecycle state is visible (`running`, `complete`, `error`).
- [ ] Failed runs surface actionable retry UX.

## Tasks
- [ ] Implement durable stream resume from last known cursor/offset.
- [ ] Add client-side deduplication strategy for chunk replay.
- [ ] Persist/derive run status in session/message model.
- [ ] Add UI indicators for run states and retry action.
- [ ] Add tests for reconnect + dedupe scenarios.

## Tracer Bullet Reference
Follows project chat streaming tracer bullet.

## Additional Context
Use SolidType durable stream event schema and conventions.

---

## Labels

`feature`
