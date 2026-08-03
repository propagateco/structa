# Chat persistence schema & Electric sync design

Type: wayfinder-grilling
Map: iss-011-chat-map.md
Status: open
Blocked by: iss-014-durable-stream-architecture-decision.md

## Question

What is the `chat_sessions` / `chat_messages` schema and the ElectricSQL + TanStackDB sync
design? Columns, run-status representation, shapes (workspace + project scoping), collections,
optimistic updates with `txid` confirmation — extending the live `usersCollection` pattern.

## Context

- iss-008 (#49) is the feature: persist sessions scoped by `workspace_id` + `project_id`, live
  sync, auto-titles. iss-005 (titles) and iss-007 (all-chats view) build on it; iss-006
  (resume) needs run status persisted/derived.
- Follow the established pattern: `packages/web/src/lib/collections.ts` (`usersCollection` —
  `electricCollectionOptions`, `snakeCamelMapper`, timestamp parser, `onUpdate` → tRPC
  mutation → `txid`). New tables need Drizzle schema in `packages/core` (see
  `packages/core/src/auth/auth.sql.ts`), Electric shapes (proxy at
  `packages/web/src/lib/electric-proxy.ts`, shape endpoint `routes/api/users.ts`), and
  collection(s).
- Pinned constraint: `project_id` is a text slug (mock projects); `user.workspaceId` is
  nullable text — decide how scoping is enforced in the data access layer and shape params.
- Auto-title heuristic belongs here (or iss-019): first message → title.

## Resolution shape

A written decision: DDL for both tables (columns, indexes, run-status field), which shapes are
published and how scoping filters them, the collection/optimistic-update design, and the
persist-on-stream-complete path (tie-in with iss-014). Close and gist to the map.
Feeds iss-018 (all-chats), iss-019 (titles), and unblocks iss-008.
