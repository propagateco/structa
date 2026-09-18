# Map: Production Chat Workspace Promotion

Type: wayfinder-map
Status: resolved

## Destination

Promote the validated Sessions Rail option 1 into the production `/app` route as a durable,
workspace-wide chat experience powered by The Clerk backend, with persisted conversations,
history, renameable sessions, and attachments.

## Notes

- **Domain language:** read `CONTEXT.md`; Conversation is the durable object, Session is its navigation label, Workspace is cross-project, and Project context is metadata.
- **Foundation decisions already resolved:** the original chat foundation map (`iss-011-chat-map.md`) resolved durable event storage, the chat persistence schema, the backend run transport, and the Sessions Rail UX prototype (`iss-017`). Reuse those decisions unless a ticket here explicitly reopens one.
- **Chosen product direction:** `/app` replaces the dashboard placeholder; `/app/prototype-chat` and the floating variant switcher are retired after migration; Sessions Rail is the canonical layout.
- **Chosen data direction:** conversations are persisted in the existing backend/database, globally discoverable across projects, and open into full persisted history.
- **Chosen assistant direction:** the production UI uses the existing Clerk backend rather than mock responses.
- **Chosen attachment direction:** attachments are uploaded and persisted; the prototype-only local adapter is not the production contract.
- **Skills:** use `/research` for external API/storage facts, `/grilling` + `/domain-modeling` for product/domain decisions, and `/prototype` when interaction fidelity is the question.
- **Quality:** preserve the existing local checks and authenticated preview validation workflow.

## Decisions so far

- [Chat Suite Foundation](iss-011-chat-map.md) — durable streams, persistence shape, transport, and the initial chat UX foundation are resolved.
- [Chat UX design](iss-017-chat-ux-design.md) — Sessions Rail option 1 is the selected layout direction; the prototype validated session switching, titles, attachments UI, and message rendering.
- [Global conversation query and history contract](iss-022-global-conversation-query-and-history-contract.md) — Recent chats are a global, cursor-paginated user query; new conversations persist on first send, history loads in a recent window, and deletes are hard.
- [Production Clerk runtime boundary](iss-023-production-clerk-runtime-boundary.md) — production `/app` uses an assistant-ui ExternalStore adapter over Electric event folds and the existing Clerk run endpoint; one active run remains the v1 guard.
- [Production `/app` route and context boundary](iss-021-production-app-route-and-context-boundary.md) — `/app` is the new-chat entry, `/app/chat/:conversationId` deep-links conversations, and the project switcher is an optional browse filter.
- [Persisted attachment lifecycle](iss-024-persisted-attachment-lifecycle.md) — attachments use direct presigned S3 uploads, metadata/id references, signed reads, 10×25 MB limits, and pending-object cleanup.

## Not yet specified

Nothing currently remains at decision level for this destination.

## Out of scope

- New Projects or Workspaces CRUD/domain tables; use the existing project/workspace identity model.
- Floor-plan editing, RAG/source citations, voice, and MCP/agent-native exposure.
- Queued or parallel messages within one conversation; v1 retains the one-active-run guard.
