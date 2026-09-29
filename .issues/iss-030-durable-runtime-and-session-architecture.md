# Durable runtime and session architecture

Type: wayfinder-grilling
Map: iss-025-durable-automation-platform-map.md
Status: open
Blocked by: iss-029

## Question

Given that chat execution and live replay currently run in Cloudflare Durable Objects while Neon owns
conversation metadata and materialized history, what runtime boundary should support **future
non-chat, long-running automation**? Compare Cloudflare Workflows/Queues, AWS primitives, portable
runtimes, and Structa-owned abstractions for agent state, scheduling, and recovery.

Do not reopen the shipped chat transport decision unless a concrete failure or requirement demands it.
Resolve automation separately, including explicit upgrade, interoperability, and exit/migration seams.
