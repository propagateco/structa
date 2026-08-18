# 02 — Production Clerk conversation runs

**What to build:** A user can send a message in a persisted conversation and receive a durable Clerk response with live assistant text, tool activity, terminal status, failure rendering, and appended retry attempts.

**Blocked by:** 01 — Persisted conversations and global Recent chats.

**Status:** ready-for-agent

- [ ] The production assistant-ui ExternalStore adapter sends runs through the same-origin Clerk endpoint.
- [ ] User messages echo immediately and reconcile with authoritative persisted rows.
- [ ] Active conversation events fold by `(run_id, seq)` into assistant bubbles and collapsible tool chips.
- [ ] Server-loaded history reconstructs the conversation without client-passed history.
- [ ] One active run is enforced; failed attempts remain visible and retry appends a new run.
