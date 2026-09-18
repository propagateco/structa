# Move chat runtime to a Conversation Durable Object

Type: task
Map: iss-025-durable-automation-platform-map.md
Status: in_progress
Blocked by: iss-037-migrate-to-query-collections.md

## Summary

Replace Postgres/Electric token-event delivery with one SQLite-backed Cloudflare Durable Object per
conversation and hibernating WebSockets for low-latency replayable chat.

## Scope

- Configure the data-service Worker, Durable Object binding, SQLite class migration, and tests.
- Route deterministic conversation ids through an EU-jurisdiction namespace where required.
- Persist messages, runs, chunks, tool calls/results, errors, and resume cursors in object SQLite.
- Authenticate and authorize at the Worker boundary before routing to the object.
- Stream TanStack AI/OpenRouter output through hibernating WebSockets.
- Materialize the conversation index and completed transcript/results to Neon.
- Dual-write and validate before removing `chat_run_events` and the existing fold path.

## Acceptance criteria

- First-token delivery is independent of Postgres replication.
- Refresh/reconnect and multi-tab use resume/replay without duplicated turns.
- Object hibernation preserves durable state and does not bill idle compute duration.
- Cross-workspace access fails and Cloudflare bindings never reach public contracts.
- Deploy reconnect, model error, cancellation, and tool events are tested.


## Progress

- Added a compiling `ConversationObject` implementation to `packages/functions`.
- Added SQLite Durable Object binding and Wrangler `new_sqlite_classes` migration.
- Added idempotent message append and ordered history reads.
- Generated Worker environment types and verified the data-service TypeScript build.
- Production Structa routing, authentication, WebSocket hibernation, model execution, Neon materialization, and Cloudflare deployment remain to be implemented.

## Next seam

The object message contract now has a pure validator and tests. The next implementation step is to
replace the placeholder internal bearer token with a short-lived service credential or signed request
from Structa's authenticated API, then wire the web conversation client to the Worker WebSocket. The
Worker must never trust a browser-supplied user/workspace id without verifying it at the edge boundary.


## Location correction

The initial scaffold was placed in `packages/web-template`, which is reference material rather than Structa production code. It was moved to `packages/functions/src/cloudflare`, with a dedicated `wrangler.cloudflare.jsonc` and `tsconfig.cloudflare.json`. The web template was restored unchanged.


## Progress update

- ConversationObject now supports authenticated GET history, POST idempotent message append, and hibernating WebSocket connections with broadcast updates.
- Worker routing validates an internal bearer token when configured and exposes an unauthenticated health endpoint.
- Cloudflare-specific Worker code lives in `packages/functions`, not the web template.
- Next: replace the placeholder internal token with Better Auth/service-to-service verification, add Worker tests, connect `packages/web`, and move model execution/materialization into the object/runtime.
