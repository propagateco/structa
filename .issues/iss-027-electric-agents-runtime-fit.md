# Electric Agents runtime fit

Type: research
Map: iss-025-durable-automation-platform-map.md
Status: resolved

## Question

How well does Electric Agents fit Structa's eventual long-running automation platform: durable agent
entities, web research/scraping, specialist workers, scheduling and wakeups, shared state, human
approval, tool execution, MCP, external observation, deployment, permissions, and failure recovery?

Identify which concerns it solves beyond Durable Streams, its maturity and operational footprint,
where it introduces coupling, and whether Structa can adopt Streams now without foreclosing Agents
later.

## Answer

Electric Agents is directionally well aligned with Structa's eventual automation platform, but should
be piloted later rather than made the current production runtime.

- It adds durable addressable entities, persisted wakes, schedules, spawn/send/observe coordination,
  typed state, shared state, tools, MCP integration, runtime permissions, replay/fork, and React/TanStack
  DB observation on top of Durable Streams.
- It provides useful primitives for specialist workers and long-running research jobs, but web scraping,
  provenance, browser automation, approvals, cost controls, and external side-effect idempotency remain
  Structa responsibilities.
- No dedicated business approval primitive replaces a durable Structa approval record and explicit
  resume/wake boundary.
- The runtime and operational surface are newer than Streams and introduce coupling to
  `@electric-ax/*`, entity manifests, built-in projections, and the Agents server.

Adopting Durable Streams now preserves an Agents-later path if Structa defines its own automation,
job, step, artifact, approval, and capability contracts first. Agents' built-in collections should
remain runtime implementation details rather than Structa's public domain model.
