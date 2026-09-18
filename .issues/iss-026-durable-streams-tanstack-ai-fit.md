# Electric Streams + TanStack AI fit

Type: research
Map: iss-025-durable-automation-platform-map.md
Status: resolved

## Question

How well does Electric Durable Streams' TanStack AI transport satisfy Structa's current conversation
requirements: low-latency text/tool streaming, durable replay, resume after refresh, multi-tab
observation, history hydration, authentication, attachment references, deployment on SST/AWS, and
self-hosting or provider portability?

Compare the proposed stream/session boundary with the current Postgres + Electric SQL event-fold
implementation and identify the smallest safe migration seam.

## Answer

Electric Durable Streams with `@durable-streams/tanstack-ai-transport` is the recommended chat
delivery layer. It directly carries ordered TanStack AI text and tool chunks, supports resumable
offsets and multi-client observation, and removes Postgres WAL/Electric SQL replication from the
interactive token path.

- Keep Postgres authoritative for conversation metadata, ownership, reporting, and initially for
  materialized completed-message history.
- Keep uploads in private S3-compatible storage and place authorized attachment references in stream
  messages; Streams is not the attachment store.
- Authorize session ownership in same-origin send/read proxy routes; never expose upstream stream
  credentials in the browser.
- The smallest migration tees the existing TanStack AI response stream into a Durable Stream,
  replaces the browser's `chat_run_events` shape with `durableStreamConnection()`, and retains the
  current Postgres writes until the transport is proven.
- Hydrate initial history from Postgres plus a current stream offset, then subscribe from that offset.
- Treat idempotency, stream retention/410 recovery, version pinning, and persistent stream hosting as
  explicit production concerns.

The protocol is open, HTTP-based, self-hostable, and substantially more portable than a cloud-specific
agent runtime. The integration is relatively young, so adoption should be incremental rather than an
immediate event-store rewrite.
