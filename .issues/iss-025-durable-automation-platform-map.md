# Map: Durable Automation Platform

Type: wayfinder-map
Status: open

## Destination

Define Structa's portable durable automation architecture: chat remains a first-party client, but
long-running agents can plan, scrape, forecast, annotate, and operate on renovation projects through
secured tools that are also invokable from external clients through APIs and MCP.

The map is complete when the runtime, stream/session, domain-tool, authorization, external-invocation,
and migration boundaries are sufficiently decided to produce an implementation plan without locking
Structa's domain logic to one model, cloud, or agent framework.

## Notes

- **Product direction:** the product is the planning, markup, forecasting, and project workspace;
  chat is one interface over those capabilities, not the capability boundary.
- **Portability:** keep model providers, durable execution, stream storage, and cloud hosting behind
  explicit interfaces. Prefer open protocols and self-hostable components where practical.
- **Domain boundary:** agents call audited Structa capabilities; core renovation/project logic must
  not live inside prompts, MCP handlers, or vendor-specific runtime callbacks.
- **Current chat:** `iss-020-production-chat-workspace-map.md` remains the shipping UI map. Its
  Electric SQL event-fold transport is now a decision to revisit, not a constraint on this map.
- **Skills:** use `/research` for runtimes and protocols, `/grilling` + `/domain-modeling` for
  product and trust boundaries, and `/prototype` for approval/agent-progress interactions.
- **Plan, don't do:** this map resolves architecture decisions. Implementation follows as separate
  tickets once the route is clear.

## Decisions so far

- [Electric Streams + TanStack AI fit](iss-026-durable-streams-tanstack-ai-fit.md) — use open Durable
  Streams incrementally for responsive, resumable TanStack AI delivery while retaining Postgres as
  the initial business/history authority.
- [Electric Agents runtime fit](iss-027-electric-agents-runtime-fit.md) — Agents is a promising later
  orchestration runtime; preserve the upgrade path by keeping Structa's domain model independent.
- [Cloudflare durable execution fit](iss-028-cloudflare-durable-execution-fit.md) — Cloudflare offers
  the strongest integrated managed runtime, but its lock-in conflicts with the current AWS-first,
  portable direction.

## Not yet specified

- Human approval and interruption UX for consequential or costly actions.
- Agent memory, project knowledge retrieval, and source/citation boundaries.
- Operational policy for budgets, timeouts, retries, cancellation, observability, and incident
  recovery once a runtime direction is selected.
- Packaging and versioning of Structa capabilities across first-party UI, public API, MCP, and agent
  runtimes.
- Which autonomous workflows form the first tracer bullet after the architecture is selected.

## Out of scope

- Selecting every future specialist agent or autonomous workflow.
- Encoding renovation domain logic directly in an agent framework.
- Committing production to a single LLM provider.
