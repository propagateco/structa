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
- **Current shipped chat:** `iss-020-production-chat-workspace-map.md` remains the shipping UI map.
  The production run path uses a Cloudflare Worker and per-conversation Durable Object; the DO's
  SQLite stores active transcript/run/event state and streams ordered events over WebSocket with
  replay. Neon remains authoritative for user-owned conversation metadata and materialized message/run
  history. Electric SQL, Electric Cloud, and Neon `chat_run_events` are retired; do not treat the old
  event-fold design as current architecture.
- **Scope of that choice:** Cloudflare Durable Objects are adopted for the shipped chat execution and
  live-stream path. This is not yet a decision to move all future durable jobs or agent orchestration
  to Cloudflare, nor a decision that the current implementation is the desired portability boundary.
- **Migration/exit seam:** keep business capabilities, authorization, and persisted conversation
  records outside the DO implementation. The current DO SQLite transcript/event log is operational
  execution state; replacing or migrating it must preserve active-run recovery, replay, and Neon
  materialization semantics.
- **Skills:** use `/research` for runtimes and protocols, `/grilling` + `/domain-modeling` for
  product and trust boundaries, and `/prototype` for approval/agent-progress interactions.
- **Plan, don't do:** this map resolves architecture decisions. Implementation follows as separate
  tickets once the route is clear.

## Decisions so far

- **Shipped chat baseline (implementation decision):** Cloudflare Durable Objects execute chat runs
  and provide per-conversation SQLite state, WebSocket streaming, and event replay; Neon stores
  conversation metadata and materialized messages/runs. This supersedes the proposed Electric
  Durable Streams chat transport in [iss-026](iss-026-durable-streams-tanstack-ai-fit.md); that
  research remains historical, not a pending migration requirement.
- [Electric Agents runtime fit](iss-027-electric-agents-runtime-fit.md) — Agents is a promising later
  orchestration candidate, not a selected runtime; preserve options by keeping Structa's domain model
  independent.
- [Cloudflare durable execution fit](iss-028-cloudflare-durable-execution-fit.md) — Cloudflare offers
  the strongest integrated managed runtime, but the earlier AWS-first recommendation is superseded
  for chat execution by the shipped DO implementation. Its suitability for broader automation is
  still an open strategic question.

## Not yet specified

- Human approval and interruption UX for consequential or costly actions.
- Agent memory, project knowledge retrieval, and source/citation boundaries.
- The portable domain-capability boundary that lets first-party chat, APIs, MCP, and future runtimes
  invoke the same audited business operations.
- Whether long-running non-chat automation should use Cloudflare Workflows/Queues, AWS primitives, a
  portable runtime, or a combination; decide an exit/migration contract before expanding DO-specific
  coupling.
- Operational policy for budgets, timeouts, retries, cancellation, observability, and incident
  recovery for both the existing chat runtime and future automation.
- Packaging and versioning of Structa capabilities across first-party UI, public API, MCP, and agent
  runtimes.
- Which autonomous workflows form the first tracer bullet after the architecture is selected.

## Next wayfinding sequence

1. Resolve [iss-029](iss-029-portable-agent-domain-boundary.md): define the portable capability,
   principal, effect, artifact, job, approval, progress, and audit vocabulary before selecting a
   general-purpose agent runtime.
2. Revisit [iss-030](iss-030-durable-runtime-and-session-architecture.md) for non-chat automation only;
   treat the shipped Cloudflare DO + Neon chat architecture above as the existing baseline, not an
   unresolved chat transport choice.
3. Resolve [iss-031](iss-031-external-api-mcp-trust-boundary.md) using the capability and runtime
   boundaries from the first two decisions.
4. Select one autonomous-workflow tracer bullet and create implementation tickets only after these
   boundaries are settled.

## Out of scope

- Selecting every future specialist agent or autonomous workflow.
- Encoding renovation domain logic directly in an agent framework.
- Committing production to a single LLM provider.
