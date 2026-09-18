# Durable runtime and session architecture

Type: wayfinder-grilling
Map: iss-025-durable-automation-platform-map.md
Status: open
Blocked by: iss-026, iss-027, iss-028, iss-029

## Question

Which combination of Postgres/Electric SQL, Electric Durable Streams, Electric Agents, Cloudflare
durable primitives, and Structa-owned abstractions should own conversation streams, long-running job
execution, agent state, scheduling, and recovery?

Resolve the near-term chat transport and the long-term automation runtime separately where useful,
including explicit upgrade and exit seams.
