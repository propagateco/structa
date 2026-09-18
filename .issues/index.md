# Issues
Draft feature proposals. Push to GitHub when ready.

## Wayfinding

- [Map: The Clerk — Chat Suite Foundation](iss-011-chat-map.md) — decision map for the chat
  suite; its open tickets (scan `.issues/` for `Map: iss-011-chat-map.md`) are the decisions
  to resolve before building.
- [Map: Production Chat Workspace Promotion](iss-020-production-chat-workspace-map.md) — promotes
  Sessions Rail option 1 into the durable, workspace-wide `/app` chat experience.
- [Map: Durable Automation Platform](iss-025-durable-automation-platform-map.md) — defines the
  portable runtime, capability, trust, streaming, API, and MCP boundaries for long-running agents.

### Durable automation implementation backlog

- [Migrate Electric collections to Query Collections](iss-037-migrate-to-query-collections.md) —
  preserve TanStack DB while removing the Electric runtime dependency.
- [Move chat runtime to a Conversation Durable Object](iss-038-cloudflare-conversation-durable-object.md)
  — use SQLite and hibernating WebSockets for durable low-latency chat.
- [Create the Structa capability catalog](iss-033-capability-catalog-foundation.md) — establish the
  shared typed domain operation boundary.
- [Add durable job lifecycle](iss-034-durable-job-lifecycle.md) — support asynchronous work,
  approvals, progress, artifacts, retries, and cancellation.
- [Expose capabilities through API and MCP](iss-035-api-mcp-capability-adapters.md) — make the same
  capabilities available to external clients and agents.
- [Migrate artifacts from S3 to R2](iss-039-migrate-artifacts-from-s3-to-r2.md) — move private uploads
  and generated outputs behind the ArtifactStore boundary.
- [Add tenant-safe retrieval with Cloudflare AI Search](iss-040-cloudflare-ai-search-retrieval.md) —
  index R2 documents with enforced ownership filters and citation-ready results.
- [Decommission Electric Cloud infrastructure](iss-041-decommission-electric-cloud-infrastructure.md) —
  remove the last Electric-backed collection, shape proxies, dynamic sync provisioning, and secrets.
