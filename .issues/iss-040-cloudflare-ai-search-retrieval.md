# Add tenant-safe retrieval with Cloudflare AI Search

Type: task
Map: iss-025-durable-automation-platform-map.md
Status: ready-for-agent
Blocked by: iss-039-migrate-artifacts-from-s3-to-r2.md

## Summary

Index validated R2 documents in Cloudflare AI Search behind a provider-neutral RetrievalIndex and
return citation-ready results to The Clerk, jobs, API, and MCP clients.

## Scope

- Define index, delete, status, search, and rebuild contracts.
- Trigger validation, extraction, and indexing after artifact binding.
- Store immutable workspace/project/document ownership metadata on indexed content.
- Enforce tenant filters server-side for every query.
- Return source/citation metadata required by Structa's trust principles.
- Retain source files and canonical Neon metadata so the index can be rebuilt elsewhere.

## Acceptance criteria

- Cross-workspace retrieval is impossible even when a caller supplies malicious filters.
- Index status and failures are observable and retryable.
- Clerk answers can cite stable artifact/page/section references.
- Index rebuild and provider exit are tested.
