# Add durable job lifecycle

Type: task
Map: iss-025-durable-automation-platform-map.md
Status: ready-for-agent
Blocked by: iss-033-capability-catalog-foundation.md

## Summary

Add the durable job model for capabilities that run asynchronously, wait for approval, produce
artifacts, or coordinate workers.

## Scope

- Define job, step, approval, progress, artifact reference, and audit records in Postgres.
- Implement create, inspect, cancel, retry, approve/reject, and result operations with ownership checks.
- Emit job lifecycle/progress events through the resolved stream boundary.
- Use a Job Durable Object for live coordination and a Cloudflare Workflow for durable execution,
  retries, sleeps, and approval waits.
- Enforce idempotency, timeouts, retry policy, cost/budget metadata, and terminal states.
- Keep execution behind an adapter so AWS workers, Electric Agents, or Cloudflare can implement it.
- Add one fake/local worker for deterministic integration tests.

## Acceptance criteria

- A long-running capability returns a job id immediately.
- Progress and terminal results survive refresh and are queryable independently of chat.
- Approval is explicit and durable; an agent cannot self-approve consequential work.
- Cancellation, retry, duplicate delivery, and worker restart behavior are tested.
