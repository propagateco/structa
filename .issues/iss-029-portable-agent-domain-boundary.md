# Portable agent and domain boundary

Type: wayfinder-grilling
Map: iss-025-durable-automation-platform-map.md
Status: resolved

## Question

What is the stable boundary between Structa's domain capabilities and any agent/runtime layer so the
same planning, markup, forecasting, document, and project actions can be invoked safely from the app,
background agents, public APIs, and MCP without duplicating logic or coupling it to one vendor?

Define the vocabulary and contracts for capabilities, jobs, artifacts, agent sessions, principals,
approvals, effects, progress, and audit records.

## Answer

Structa will expose both short-lived **tools** and durable **jobs** through one capability boundary.

- A **capability** is a versioned, audited domain operation owned by Structa. Its implementation lives
  in the domain/application layer, not in a prompt, MCP server, or vendor runtime callback.
- A **tool** is the invocation shape for a capability that can complete quickly. Tools are available
  to the app, The Clerk, external APIs, MCP clients, and autonomous agents through adapters.
- A **job** is the durable execution form for a capability that may take time, wait for input, fan out,
  scrape sources, produce artifacts, or have consequential side effects. It exposes status, progress,
  result/artifact references, approval state, cancellation, retries, and an audit trail.
- Tools may start, inspect, approve, cancel, or retrieve a job. A caller must not need to know whether
  an implementation is local, queued, or agent-backed; the capability contract defines the boundary.
- **Artifacts** are durable project outputs or source evidence referenced by id and authorization,
  stored outside prompts and streams where appropriate.
- **Principals** represent the authenticated human, external client, or agent identity. Every capability
  invocation carries principal, workspace/project scope, purpose, and idempotency information.
- **Approvals** are durable domain records for consequential effects. An LLM tool call is never approval
  by itself; a job pauses until an authorized principal explicitly approves or rejects it.
- **Effects** are classified as read, draft, reversible write, or consequential/external write. Policy
  determines which effects can run autonomously and which require approval.
- **Progress and audit records** are durable and separately queryable from chat presentation. Chat is one
  observer and command surface, not the source of truth for execution state.

This boundary keeps the domain portable across OpenRouter, Bedrock, Electric Agents, Cloudflare, AWS,
the first-party app, public APIs, and MCP. Electric Durable Streams can carry progress and collaboration
now; a later Electric Agents runtime can execute jobs without becoming the public domain model.
