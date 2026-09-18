# STR-005: Cloudflare Platform Migration

## Objective

Minimize fixed pre-revenue infrastructure cost by removing the Electric Sync dependency, retaining
TanStack DB through Query Collections, and moving real-time chat, durable jobs, file storage, and
retrieval to Cloudflare-managed primitives.

## Target architecture

```text
TanStack Start web app
├── TanStack DB Query Collections
│   └── authenticated Structa APIs → Neon
├── Conversation client
│   └── Worker → Conversation Durable Object (SQLite + hibernating WebSocket)
└── Upload/search client
    └── Worker → R2 → Workflow → AI Search

Cloudflare Worker / Hono API
├── authentication and authorization
├── relational query/mutation endpoints
├── Durable Object routing
├── Workflow triggers and callbacks
├── R2 upload/read authorization
└── capability API and MCP adapters

Neon
├── users, workspaces, projects, permissions
├── conversation and job indexes
├── artifact metadata and audit records
└── materialized terminal results
```

Cloudflare runtime types remain behind Structa-owned interfaces so Durable Object ids, bindings,
Workflow types, R2 objects, and AI Search responses do not enter domain or public API contracts.

## Phase 1: Query Collection parity

1. Add `@tanstack/query-db-collection`.
2. Define authenticated REST/tRPC read endpoints for every existing Electric collection.
3. Replace `usersCollection` with a Query Collection first, preserving optimistic update and rollback.
4. Replace conversation/session, message, and run collections.
5. Use collection `onInsert`/`onUpdate`/`onDelete` handlers for persistence and automatic refetch.
6. Use `writeInsert`/`writeUpdate`/`writeDelete` for later WebSocket-driven incremental updates.
7. Remove txid/Electric confirmation only after each collection has equivalent persistence tests.

Exit criteria: the application has no runtime dependency on Electric shape endpoints, secrets, or
Electric Cloud resources; local, preview, dev, and production use the same collection semantics.

## Phase 2: Conversation Durable Object

1. Add a Cloudflare data-service Worker with a SQLite Durable Object binding and migration.
2. Use one EU-jurisdiction object per conversation, addressed deterministically by conversation id.
3. Persist runs, user/assistant messages, chunks, tool calls/results, errors, and resume cursors in the
   object's SQLite storage.
4. Authenticate at the Worker boundary before routing to an object; initialize each object with its
   immutable Structa conversation/workspace ownership metadata.
5. Use the WebSocket Hibernation API for live text/tool delivery and multi-tab observation.
6. Materialize conversation index metadata and completed messages to Neon for global queries,
   reporting, export, and provider exit.
7. Remove `chat_run_events` and its Electric fold only after reconnect, replay, and dual-write parity.

Exit criteria: first-token streaming does not pass through Postgres replication, chat survives object
hibernation and deployment reconnect, and conversation lists remain queryable from Neon.

## Phase 3: R2 artifact storage

1. Introduce a provider-neutral `ArtifactStore` interface.
2. Implement R2 direct uploads with server-authorized keys, checksums, MIME/size limits, pending state,
   signed reads, and ownership checks.
3. Dual-write/copy new objects during the transition from S3, then backfill existing objects.
4. Preserve canonical artifact metadata in Neon.
5. Replace the current image transformation pipeline only after equivalent derivatives are available.
6. Add pending-upload and orphan cleanup through lifecycle policy or Workflow.

Exit criteria: new uploads and reads use R2, existing files are migrated and verified, and S3 resources
can be removed without broken references.

## Phase 4: AI Search retrieval

1. Introduce a provider-neutral `RetrievalIndex` interface.
2. Trigger document validation/extraction/indexing after R2 upload.
3. Attach immutable workspace/project/document ownership metadata to every indexed item.
4. Enforce tenant filters server-side for every search; the model cannot choose or omit them.
5. Store source files and canonical metadata independently so indexes can be rebuilt elsewhere.
6. Surface citation metadata required by Structa's trust principles.

Exit criteria: uploaded documents are searchable with enforced tenancy and citations, and index rebuild
and provider exit have been tested.

## Phase 5: Durable jobs and external capabilities

1. Keep the versioned Structa capability catalog independent of Cloudflare.
2. Use Job Durable Objects for live state/subscribers and Cloudflare Workflows for multi-step execution,
   retries, sleeps, cancellation, and approval waits.
3. Use Queues for buffered ingestion and fan-out where ordering is not entity-local.
4. Expose the same capability/job contracts through the app, Clerk, REST API, and MCP.
5. Persist approvals, consequential effects, artifacts, and audit records in Neon.

## Stage and testing strategy

All stages use the same adapter types:

- Query Collections always use the same API contracts.
- Local tests use Miniflare/Wrangler Durable Object, Workflow, R2, and Worker bindings.
- Personal/preview stages use isolated Cloudflare resource names or namespaces.
- Production uses EU-restricted Durable Object namespaces where required.

Do not use Electric in production while Query Collections in development; that would create different
consistency, mutation, and failure semantics and allow stage-only bugs.

## Cost posture

- Prefer Workers/Durable Objects/R2 free allocations during pre-revenue development.
- Use WebSocket Hibernation so idle conversations do not accrue duration charges.
- Avoid always-on EC2/Fargate, ALB, NAT Gateway, EFS, and self-hosted sync services.
- Monitor AI Search/model/indexing usage separately because it may dominate storage/runtime cost.

## Rollback and portability

- Neon remains the global business authority throughout migration.
- Terminal conversation/job outputs and artifact metadata are materialized to Neon.
- Original files remain exportable from R2.
- Public API/MCP schemas use Structa ids and contracts, not Cloudflare binding/runtime types.
- Each phase ships behind an adapter boundary and can be rolled back independently.
