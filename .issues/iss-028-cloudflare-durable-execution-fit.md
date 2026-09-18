# Cloudflare durable execution fit

Type: research
Map: iss-025-durable-automation-platform-map.md
Status: resolved

## Question

Compare Cloudflare Durable Objects, Workflows, Queues, and Agents SDK with Electric Durable Streams
and Electric Agents for Structa's long-running, stateful automation use cases. Cover execution and
state semantics, real-time client delivery, timers/retries, regional placement and data residency,
SST/AWS coexistence, portability, operational burden, and migration/exit costs.

## Answer

Cloudflare provides a strong managed combination, but it should not be Structa's default platform
while AWS/SST coexistence and runtime portability remain priorities.

- Durable Objects are strongly consistent stateful actors with WebSocket support, but they are not by
  themselves a durable multi-step workflow engine.
- Workflows provide persisted steps, retries, sleeps, and waits for external events or approvals; they
  are the strongest Cloudflare primitive for long-running execution.
- Queues provide at-least-once handoff, retries, delays, and DLQs, not orchestration.
- Cloudflare Agents combines Durable Objects, real-time sessions, schedules, queues, and optional
  Workflows into the most integrated managed agent experience of the options reviewed.
- That convenience creates substantial coupling to Workers bindings, Durable Object storage,
  Workflows history, Wrangler, and Cloudflare deployment semantics.

Recommended posture: remain AWS/SST-first, use open Durable Streams for chat/progress/replay, and use
AWS execution primitives or a portable runtime behind Structa interfaces. Reconsider Cloudflare
Agents + Workflows only if reducing operational work becomes more important than portability and
Cloudflare is adopted as a strategic execution platform.
