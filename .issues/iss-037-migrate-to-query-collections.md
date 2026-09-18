# Migrate Electric collections to Query Collections

Type: task
Map: iss-025-durable-automation-platform-map.md
Status: in_progress

## Summary

Replace Electric-backed TanStack DB collections with Query Collections and authenticated Structa API
reads while preserving normalized live queries, optimistic mutations, rollback, pagination, and cache
reconciliation.

## Scope

- Inventory and replace users, sessions, messages, runs, and remaining Electric collections.
- Add `@tanstack/query-db-collection` and stable query keys/business scopes.
- Integrate the Query Collection adapter with the app's shared `QueryClient`/`DbClient` rather than
  constructing a collection without its required query dependency.
- Add authenticated read endpoints backed by Neon and existing services.
- Preserve collection mutation handlers through API/tRPC persistence.
- Replace txid confirmation with API success, direct writes, and targeted refetch/invalidation.
- Use the same adapter and consistency semantics in local, personal, preview, dev, and production.
- Remove Electric shape proxies, dynamic cloud provisioning, secrets, dependencies, and Caddy-only
  development requirements after parity is proven.

## Acceptance criteria

- Existing collection consumers continue using TanStack DB live queries.
- Optimistic update/delete rollback and server-computed field reconciliation are tested.
- Cross-tab/device freshness has an explicit refetch or push strategy per collection.
- No runtime or CI path depends on Electric Cloud or an Electric Sync engine.
- Electric publication/replication slot cleanup and rollback are documented before removal.

## Implementation note

The first tracer attempt exposed a compatibility seam: the current Query Collection package requires
an explicit `QueryClient`, and its writable collection types differ from the current `@tanstack/react-db`
version. The migration must first establish a typed shared `DbClient`/`QueryClient` integration and
preserve existing `selectUserSchema` types before replacing production collections. The incomplete
tracer was reverted so the branch remains green.


## Progress

- The shared `QueryClient`/Query Collection compatibility seam is established.
- The users/profile collection is migrated as the tracer: it reads from an authenticated Neon API endpoint and preserves optimistic `onUpdate` persistence through tRPC.
- Existing chat collections remain Electric-backed until equivalent authenticated API endpoints and Query Collection read/mutation semantics are implemented.


## Progress update

- Users/profile, conversation sessions, chat messages, and chat runs now have authenticated API read endpoints or proxies and Query Collection definitions.
- The remaining Electric-backed chat component is the active `chat_run_events` collection; it will be replaced by the Conversation Durable Object runtime in `iss-038`.
- Electric shape infrastructure can be removed after `iss-038` and the remaining non-chat collection inventory are migrated.
