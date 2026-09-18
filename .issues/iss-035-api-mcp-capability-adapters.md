# Expose capabilities through API and MCP

Type: task
Map: iss-025-durable-automation-platform-map.md
Status: ready-for-agent
Blocked by: iss-034-durable-job-lifecycle.md, iss-040-cloudflare-ai-search-retrieval.md

## Summary

Expose the canonical Structa capability catalog through authenticated API and MCP adapters for
ChatGPT, Claude, partners, and autonomous agents.

## Scope

- Define external principal credentials and scoped capability/workspace/project permissions.
- Add typed API endpoints for capability discovery, synchronous tools, and durable jobs.
- Add a Streamable HTTP MCP server exposing the same catalog, never database access or arbitrary code.
- Require explicit approval for consequential effects.
- Add rate/cost limits, idempotency, revocation, audit records, and signed artifact access.
- Document external client onboarding and versioning.

## Acceptance criteria

- API and MCP invoke the same application capability implementation.
- Credentials are scoped, revocable, and absent from model prompts and browser payloads.
- Read/draft/write/consequential policies are enforced consistently across adapters.
- Job progress, approval requests, cancellation, and results are observable externally.
- Contract and authorization tests cover valid, expired, revoked, cross-project, and replayed calls.
