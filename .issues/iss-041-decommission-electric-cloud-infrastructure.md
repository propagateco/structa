# Decommission Electric Cloud infrastructure

Type: task
Map: iss-025-durable-automation-platform-map.md
Status: needs-triage
Blocked by: iss-037-migrate-to-query-collections.md, iss-038-cloudflare-conversation-durable-object.md

## Summary

Remove the remaining Electric Cloud runtime dependency — the last Electric-backed chat collection,
the non-chat collection inventory still using `electricCollectionOptions`, the shape proxy routes,
and the sync provisioning/secrets — so no local, preview, dev, or production path talks to Electric
Cloud or an Electric sync engine. This is the teardown half of [STR-005](../.plan/STR-005-cloudflare-platform-migration.md)
Phase 1; the Conversation Durable Object runtime ([iss-038](iss-038-cloudflare-conversation-durable-object.md))
already replaced token-event delivery in production.

## Motivation

STR-005 targets minimal fixed pre-revenue infrastructure cost. Electric Cloud is the last third-party
sync dependency: it adds a Caddy/edge dev requirement, a dynamic cloud provisioning path in preview
stages (`ElectricCloudSync`), four SST secrets, a production shape proxy, and a Postgres publication
that replicates every chat/workspace table. With chat now running on the Cloudflare data service
(merged via #74/#75 to dev and production), the remaining value of the Electric fold is zero while
its operational cost and moving parts remain.

## Current state (post #74/#75)

- Production chat runs through the Conversation Durable Object; runs and conversation metadata are
  materialized to Neon. `chat_run_events` is superseded and no longer produced by new chat runs.
- Iss-037 migrated users/profile, conversation sessions, chat messages, and chat runs to Query
  Collections with authenticated API reads and tRPC mutation persistence.
- Still Electric-backed:
  - `chat_run_events` collection (only written by the old runtime path).
  - Non-chat collection inventory (`workspaces`, `projects`, settings) that may still use
    `electricCollectionOptions` in `packages/web/src/lib/collections.ts`.
  - Shape proxy routes: `packages/web/src/lib/electric-proxy.ts`,
    `routes/api/users.ts` and `routes/api/chat/shape.ts` proxy paths.
  - `ElectricCloudSync` dynamic resource for preview/personal stages (`infra/electric-cloud.ts`,
    `infra/sync.ts` dynamic path).
  - Secrets `ElectricSqlSource`, `ElectricSqlSecret`, `ElectricCloudApiToken`,
    `ElectricCloudProjectId` (`infra/secret.ts` + SST stores).
  - `electric-sql` dependency and Caddy/edge dev requirements.

## Scope

- Migrate the remaining non-chat collections to Query Collections (completing `iss-037` inventory).
- Remove `chat_run_events` collection once the Conversation Durable Object dual-write/validation
  period is closed (`iss-038` exit criteria).
- Remove `electricCollectionOptions` usage, the Electric client wiring, `electric-proxy.ts`, and the
  shape proxy routes in `routes/api/users.ts` and `routes/api/chat/shape.ts`.
- Remove the `ElectricCloudSync` dynamic provisioning path and the sync engine link
  (`infra/sync.ts`, `infra/electric-cloud.ts`).
- Remove `ElectricSqlSource`, `ElectricSqlSecret`, `ElectricCloudApiToken`, `ElectricCloudProjectId`
  from `infra/secret.ts` and from all SST stages (project fallback + `structa/dev`, `structa/production`).
- Drop `electric-sql` from `package.json` and remove Caddy/edge dev requirements.
- After removal, drop the Electric publication/replication slots from Postgres and document the
  rollback path in case the Durable Object runtime is reverted.
- Run a full local/personal/preview/dev suite with Electric fully removed to prove parity.

## Non-Goals

- Not replacing Electric with any other sync engine (self-hosted sync is an explicit STR-005 anti-goal).
- Not changing Query Collection semantics or the `DbClient`/`QueryClient` integration shape.
- Not removing the Cloudflare data service or Conversation Durable Object implementation.

## Acceptance criteria

- No runtime, test, or CI path references Electric Cloud, Electric shape endpoints, or Electric secrets.
- `grep -ri "electric" packages/ infra/ sst.config.ts` returns only documentation and historical refs.
- Local dev, personal/preview stages, dev, and production all pass with the sync engine removed.
- Postgres publication/replication slots are dropped and the rollback steps are captured in this
  issue or a linked doc.
- The four Electric secrets are unset on every stage including the project fallback.

## Testing plan

- Collection consumers: verify normalized live queries, optimistic update/delete rollback, and
  server-computed field reconciliation still pass (existing iss-037 tests).
- E2E: create/send/receive chat on a personal stage and PR preview with no Electric resources in the
  stage state (`sst state list --stage <stage>` shows no ElectricCloudSync).
- Dev + production deploys stay green on CI after the teardown PR.

## Labels

`infrastructure` `backend` `web` `tools`