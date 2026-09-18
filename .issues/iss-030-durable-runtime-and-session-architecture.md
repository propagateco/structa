# Durable runtime and session architecture

Type: wayfinder-grilling
Map: iss-025-durable-automation-platform-map.md
Status: resolved

## Question

Which combination of Postgres/Electric SQL, Electric Durable Streams, Electric Agents, Cloudflare
durable primitives, and Structa-owned abstractions should own conversation streams, long-running job
execution, agent state, scheduling, and recovery?

Resolve the near-term chat transport and the long-term automation runtime separately where useful,
including explicit upgrade and exit seams.

## Answer

Structa adopts a layered, AWS-first architecture with a portable execution boundary:

1. **Postgres is the business authority.** Conversation metadata, project context, capability
   definitions, jobs, approvals, artifacts, principals, audit records, and materialized results remain
   relational records owned by Structa.
2. **Electric SQL is for relational read synchronization.** It serves workspace metadata and other
   queryable projections through authenticated shapes. It is not the token-stream transport.
3. **Electric Durable Streams are the live session transport.** Chat input, TanStack AI chunks, tool
   activity, progress, and resumable collaboration use one addressable stream per conversation/job.
   Same-origin Structa routes own stream credentials and authorization.
4. **The first execution runtime is Structa-owned and AWS/SST-compatible.** Long-running jobs run in
   workers/tasks/services appropriate to their duration, with explicit idempotency, retries,
   cancellation, checkpoints, and durable state. Do not put long work in request-bound Lambda handlers.
5. **Electric Agents is a later runtime adapter, not the domain model.** It may own entity wakeups,
   specialist coordination, and agent loops once piloted, but its entities and built-in collections
   remain an implementation detail behind Structa jobs/capabilities.
6. **Cloudflare remains optional.** Durable Objects/Agents/Workflows are not required for the first
   architecture. A future adapter may use them if managed durable execution outweighs portability and
   AWS coexistence concerns.

The migration seam is a `ConversationStream`/`JobStream`-style Structa boundary with append/read/tail,
offset resume, authorization, and idempotency semantics. The initial implementation can be backed by
Electric Durable Streams; another stream service or an Electric Agents entity can implement it later.
Completed messages and job outputs are materialized to Postgres so reporting and domain queries do not
depend on replaying streams.

This gives the product low-latency chat now, autonomous tools/jobs later, and no vendor-specific
runtime concepts in the public domain or MCP/API contracts.

Hosting constraint from `iss-036`: a self-hosted Durable Streams origin is a continuously available
service while enabled, with deliberate development-stage suspension allowed. Scale-to-zero is not a
normal live-endpoint strategy; resumable offsets cover restarts but do not eliminate startup gaps.

## Superseded direction

The user subsequently chose the lowest-fixed-cost pre-revenue architecture: TanStack DB Query
Collections over Neon APIs, Cloudflare Durable Objects for chat/live job state, Workflows for long-running
execution, R2 for artifacts, and AI Search for retrieval. This supersedes the AWS-first/self-hosted
Electric Streams runtime recommendation while preserving the same Structa-owned capability, job,
artifact, and retrieval interfaces.
