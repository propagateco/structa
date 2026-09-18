# Create the Structa capability catalog

Type: task
Map: iss-025-durable-automation-platform-map.md
Status: ready-for-agent
Blocked by: iss-038-cloudflare-conversation-durable-object.md

## Summary

Create the runtime-independent capability boundary shared by the app, Clerk, background agents, APIs,
and MCP adapters.

## Scope

- Define versioned capability metadata and typed input/output contracts.
- Classify capabilities as read, draft, reversible write, or consequential effect.
- Carry principal, workspace/project scope, purpose, idempotency key, and correlation id.
- Centralize authorization, validation, audit creation, and error semantics.
- Keep implementations in the Structa application/domain layer rather than prompts or adapters.
- Start with one read capability and one reversible write capability as tracer bullets.

## Acceptance criteria

- The same capability implementation can be invoked from a UI handler and a Clerk tool adapter.
- Unauthorized scope, invalid input, duplicate idempotency key, and unsupported version are tested.
- No provider-specific or MCP-specific types leak into the capability contract.
