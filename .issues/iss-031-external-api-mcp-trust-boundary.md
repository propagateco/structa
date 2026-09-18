# External API and MCP trust boundary

Type: wayfinder-grilling
Map: iss-025-durable-automation-platform-map.md
Status: resolved

## Question

How should ChatGPT, Claude, first-party clients, partners, and autonomous agents authenticate and
invoke Structa capabilities through APIs and MCP while preserving workspace/project authorization,
least privilege, approvals, idempotency, rate and cost limits, attachment security, auditability, and
revocation?

## Answer

Structa will expose one canonical, versioned capability catalog through multiple adapters: first-party
UI tools, The Clerk's model tools, authenticated public API endpoints, and MCP. The adapters translate
transport concerns; they do not duplicate domain behavior.

- Every invocation carries a principal, capability version, workspace and optional project scope,
  input, purpose, idempotency key, and correlation/job id.
- Human sessions use the existing authenticated session. External clients use separately revocable
  OAuth/API credentials with explicit workspace/project and capability scopes. Agents receive scoped
  principals rather than inheriting unrestricted owner credentials.
- Capabilities are classified as read, draft, reversible write, or consequential/external write. Read
  and draft operations may be exposed broadly; writes require the caller's matching scope, and
  consequential effects require a durable approval from an authorized human unless policy explicitly
  allows automation.
- MCP exposes typed, discoverable tools with separate read/write permission presentation. It must not
  expose database access or arbitrary code execution. Tools should inspect current state and stable
  entity/artifact ids before mutations, following the Paper and SolidType patterns.
- Long-running work returns a durable job reference immediately. Progress, logs, artifacts, approval
  requests, cancellation, retries, and terminal results are observed through the job/session stream
  and queryable from Postgres. Synchronous tools are reserved for bounded operations.
- External side effects require idempotency keys, replay-safe handlers, timeouts, rate/cost budgets,
  audit records, and explicit compensation or retry policy. At-least-once delivery is expected.
- Attachments and artifacts are referenced by authorized ids, never public or model-provided storage
  URLs. Signed reads and scoped access checks happen at every adapter boundary.
- Credentials, MCP server secrets, and upstream provider keys remain server-side or in the explicitly
  authorized user-controlled client. Revocation invalidates credentials and active job/tool authority.

The public API and MCP contracts therefore target Structa capabilities/jobs, not Electric Agents
entities, Postgres tables, prompts, or provider-specific tool formats. Electric Agents, AWS workers,
Cloudflare runtimes, and browser/local executors can implement the same capability boundary later.
