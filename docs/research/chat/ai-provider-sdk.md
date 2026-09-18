# AI Provider + SDK Selection for The Clerk

Research for [iss-013](../../../.issues/iss-013-ai-provider-sdk-research.md). Decides the AI
stack for the `POST /api/chat/run` endpoint: framework SDK vs raw provider HTTP, and which
model provider. Companion research: [durable-stream-options.md](./durable-stream-options.md)
(iss-012) — read it first; this file assumes the durable stream is a Postgres event table
delivered by Electric, with SSE only as an optional latency fast-path.

## Overview

The Clerk is a cost-sensitive, UK-facing home-renovation Q&A assistant. Its only AI surface
today is a chat run: accept a message (plus project/session scoping), stream assistant output
back, and persist the run per the iss-012 event schema. Nothing AI-related is installed in any
package (`packages/backend/package.json` has Hono, zod, postgres, sst — no `ai`/`@ai-sdk/*`).
The endpoint lives in the Hono+SST backend (the map pins "Hono backend"; tRPC is the client-write
path, not the AI path).

Two framing facts shaped the decision:

1. **"TanStack AI" is no longer a conflation — it is a real, shipping product** (`@tanstack/ai`,
   Beta, AG-UI wire protocol), so the iss-004 wording is satisfiable literally. It just isn't the
   only option, and the vision doc's *agent-loop / OCCT / SharedWorker* content is out of scope
   (the map says ignore it).
2. **The durable-stream architecture is already decided** (iss-012): `chat_run_events` in Neon +
   Electric is the source of truth; SSE is a fast-path only. So this ticket picks the *producer*
   — the SDK that turns a provider stream into the `content`/`tool_call`/`tool_result`/`done`/
   `error` events — and both candidate SDKs map to that schema trivially.

## Options compared

| | Vercel AI SDK (`ai` + `@ai-sdk/openai`) | TanStack AI (`@tanstack/ai` + `@tanstack/ai-openai`) | Raw provider HTTP from Hono |
|---|---|---|---|
| Status | **Stable v7** (`ai` 7.0.x, `@ai-sdk/openai` 4.x); ~19.7M weekly downloads | **Beta v0.42** (alpha Dec 2025, beta 2026); AG-UI-compliant both directions since May 2026 | N/A |
| Streaming | `streamText()` → typed event stream; SSE via `toDataStreamResponse` or manual framing | `chat()` → AG-UI event stream; SSE via `toServerSentEventsResponse` | You frame SSE yourself with `hono/streaming` |
| Tool calling (future) | Mature: multi-step tools, MCP, approval, strict schemas | Good: isomorphic tools, approval interrupts; younger, fewer battle-tested edges | None — hand-rolled schema validation + loop |
| Docs quality | Excellent (ai-sdk.dev, huge ecosystem) | Good but young; recent wire-format migration (AG-UI) churned APIs | Provider docs only |
| Hono/Lambda fit | **SST ships an official example** (`aws-lambda-ai-stream`: `streamText` + `streamHandle` + `streaming: true`) | Works on Hono (generic `toServerSentEventsResponse`); no SST reference example | Most control, most work |
| Provider swap (OpenAI→Anthropic→Gemini) | One-line (`openai()` → `anthropic()`/`google()`) | One-line (adapter swap); AG-UI keeps the wire stable | Rewrite the HTTP layer per provider |
| Client hooks | `useChat` (React etc.) | `useChat` + TanStack Start integration + devtools | None |
| Relevance to the client here | **Low** — the durable stream means the client reads Electric rows, not the SDK's chat state | Same | Same |

## Recommendation

### Library: TanStack AI (`@tanstack/ai` + `@tanstack/ai-openai`)

Use TanStack AI on the Hono backend as the streaming producer. It is the on-vision choice for
this repo — the issues literally say "TanStack AI", and the app is all-TanStack (Start + Query).
The framework-agnostic core runs on any Node backend, Hono included: `chat()` returns an
`AsyncIterable<StreamChunk>` you `for await` over server-side, and
`toServerSentEventsResponse(stream)` frames it as SSE ("Any backend that returns the TanStack AI
SSE format works — Fastify, Hono, or any other Node.js framework").

- **Durable-stream fit (iss-012)**: `chat()` exposes the raw AG-UI event stream server-side,
  which is exactly the producer the event-table design wants — iterate chunks, map to
  `content`/`tool_call`/`tool_result`/`done`/`error`, write to `chat_run_events`. SSE to the
  client (`toServerSentEventsResponse`) is optional; durability never depends on it.
- **AG-UI wire protocol**: open standard, both directions since May 2026; chunk types map
  directly onto the iss-012 schema — `TEXT_MESSAGE_CONTENT` (delta) → `content`, `TOOL_CALL_*` /
  `TOOL_RESULT` → `tool_call`/`tool_result`, `RUN_FINISHED` → `done`, `RUN_ERROR` → `error`.
  No lock-in: adapter swap (OpenAI / OpenRouter / Anthropic / Gemini) is one line.
- **Stack coherence**: no Vercel `ai` package in a TanStack shop; sibling `useChat` / TanStack
  Start integration / devtools exist for later client-side work (low relevance now — the
  durable stream means the client reads Electric rows, not SDK chat state).
- **Tool calling**: isomorphic tools with approval interrupts cover The Clerk's later tools
  (iss-011 "tool calling" fog); the surface is younger and less battle-tested than the AI SDK's,
  but tool/token economics are provider-side, identical either way.
- **Beta status is the trade-off**: `@tanstack/ai` is pre-1.0 (v0.42) and went through a
  breaking AG-UI wire migration; there is no SST-maintained Lambda-streaming example like the
  Vercel AI SDK has. Mitigate: pin the version and keep the event-mapping layer thin (~one
  function) so a future SDK swap stays cheap.

Vercel AI SDK (`ai` + `@ai-sdk/openai`) remains the pragmatic fallback if the beta risk bites:
`streamText()` is stable v7, has an official SST Lambda-streaming example (`aws-lambda-ai-stream`),
and the same repo changes below apply — only the event-mapping layer differs. The two are
drop-in-equivalent for this tracer bullet; don't re-litigate unless the beta blocks something
concrete (flag it in iss-015).

### Provider: OpenAI, model `gpt-5.6-luna`

Default: **OpenAI `gpt-5.6-luna`** — `$0.20`/`$1.20` per 1M input/output tokens, 1.05M-token
context, tool use + multi-step workflows, no reasoning step (fast first token). Chosen in the
iss-015 grilling (user: "won't be using GPT 4.1 mini as it's quite old"); cheaper than
gpt-4.1-mini ($0.40/$1.60) on both axes with a larger window. Cached input `$0.02`/1M
(prompt caching) once prompts stabilize. Prompts >272K input tokens bill at 2× input / 1.5×
output — keep context small, as below.

| Provider · model | $ input / 1M | $ output / 1M | Context | Notes |
|---|---|---|---|---|
| **OpenAI gpt-5.6-luna** ⭐ | 0.20 | 1.20 | 1.05M | Default; cheapest capable 1M+ window |
| OpenAI gpt-5.6-terra | 2.00 | 12.00 | 1.05M | Heavier tier for later safety-critical answers |
| OpenAI gpt-5.6-sol | 5.00 | 30.00 | 1.05M | Top tier; per-question escalation only |
| OpenAI gpt-4.1-mini | 0.40 | 1.60 | 1M | Old gen; superseded — do not default to this |
| Google Gemini 3 Flash | 0.50 | 3.00 | 1M | Great alt; thinking control |
| Anthropic Claude Haiku 4.5 | 1.00 | 5.00 | 200K | Higher per-answer quality; ~3× output cost |

(Prices from the OpenAI pricing table after the 2026-07-30 price cut.)

Reasoning:
- **Cost**: at ~1k input + ~300 output tokens/request, gpt-5.6-luna ≈ `$0.00056`/turn — free at
  consumer SaaS volumes, so the real axes are answer quality and latency, not absolute cost.
  Choose the model tier for UX, not pennies.
- **Context window**: 1.05M tokens is headroom, not a target. Keep per-request context small
  (last ~10–20 messages + system prompt + injected project context); the iss-014 409
  one-active-run guard guarantees the server-loaded history is complete, so **no client caps are
  needed**. Use the big window later when project-context RAG lands (survey docs, floor-plan
  data) and lean on prompt caching (cached input `$0.02`/1M) once prompts stabilize.
- **Latency**: interactive chat wants first token < ~1 s — avoid reasoning/thinking-on defaults.
  Escalate per-question later to gpt-5.6-terra/sol, Claude Haiku/Sonnet, or Gemini 3 Flash if
  renovation-safety answers need more care; keep gpt-5.6-luna as the router default.
- **Provider swap (EU path)**: gpt-5.6-luna is the default, **not a lock-in** — the
  `@tanstack/ai-openai` adapter takes a base URL, so EU-hosted open-weight providers (Scaleway
  Generative APIs — Paris, GDPR, OpenAI-compatible, "switch from OpenAI in one line of code";
  Mistral — France) are a drop-in swap when UK/EU data residency becomes a requirement. MVP
  stance (iss-015): **US processing accepted**; revisit residency in a grilling when it matters.
- **MCP / agent-native exposure**: user's stated direction, **out of scope for v1** — the
  `tool_call`/`tool_result` event schema leaves room; revisit in a future session.

## Key management with SST

Follow the repo's existing secret pattern (`infra/secret.ts`, `infra/api.ts`):

1. **Declare** the secret in `infra/secret.ts` (alongside the existing `sst.Secret` instances):
   ```ts
   OpenAIKey: new sst.Secret("OpenAIKey"),
   ```
   (Add `AnthropicKey`/`GeminiKey` only when actually needed — the SDK swap is one line, so keep
   one key to start.)
2. **Link** it to the API function in `infra/api.ts` and surface as an env var (the
   `BetterAuthSecret` pattern):
   ```ts
   link: [ /* ...existing..., */ secret.OpenAIKey ],
   environment: { /* ...existing..., */ OPENAI_KEY: secret.OpenAIKey.value },
   ```
   Linking alone is enough for `Resource.OpenAIKey.value`; the env var is belt-and-braces and
   matches how the SDK is usually configured.
3. **Reference** it in the chat route via SST v4's `sst:resource` binding — same as
   `packages/core/src/utils/encryption.ts:15` and `packages/web/src/lib/auth.ts:25`:
   ```ts
    // @tanstack/ai-openai adapter — construct the model from the linked secret
    const { text } = openaiText("gpt-5.6-luna", { apiKey: Resource.OpenAIKey.value });
   ```
4. **Set per stage**:
   ```bash
   npx sst secret set OpenAIKey sk-dev-...              # personal/dev stage
   npx sst secret set OpenAIKey sk-prod-... --stage production
   ```
   Secrets are per-stage (SSM `SecureString`). Dev and production get explicit values.
5. **Preview stages (the CI + bot-user path)**: ephemeral `pr-N` stages must not each be
   provisioned manually. Set a **fallback** value, inherited by every stage in the same AWS
   account/region:
   ```bash
   npx sst secret set OpenAIKey sk-dev-... --fallback
   ```
   Then every `pr-N` preview gets the dev key automatically, so agent-browser + bot-login testing
   (docs/core/development/worktrees.md) works with zero per-PR setup. Never rely on the fallback
   for `production` — that stage gets its own explicit value.
6. **Hygiene**: the key stays server-side in the backend function only — never in the web bundle,
   never in the browser. Matches docs/core/workflow/git_workflow.md (never commit secrets).

## Minimal `POST /api/chat/run` contract

**Placement**: Hono route in `packages/backend/src/api/routes/chat.ts`, mounted in `api.ts`
(`.route("/chat/run", ChatRoute)`), behind `authenticatedMiddleware`
(`packages/backend/src/api/middleware.ts`) + `zValidator` (the `waitlist.ts` pattern). The Hono
path is `/chat/run` on the api domain (routes mount at `/` today); the browser-facing
`/api/chat/run` is the web-platform proxy naming used in the issues — whether the client calls
`https://api.<domain>/chat/run` directly (the existing `hc` client, `VITE_API_URL`) or a web-side
proxy route is iss-015's placement call.

**Request** (JSON, zod-validated):
```jsonc
{
  "projectId": "bathroom",   // mock slug (pinned in iss-011; text, no FK)
  "sessionId": "uuid",        // required — multi-session UX + composer (iss-009)
  "message": "Can I fit a wet room in a 1.8 m wide bathroom?",
  "history": [                // optional for the tracer bullet; see open questions
    { "role": "user" | "assistant", "content": "..." }
  ]
}
```

**Response**: `text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`, served
via Lambda response streaming (see repo changes below). SSE is the **fast-path only** — every
event is also written to `chat_run_events` per iss-012, and the client's durable view comes from
Electric. Because Lambda response streaming has a no-flush ~100 KB buffer and the CloudFront
Router caps SSE around ~60 s, the endpoint must flush periodically and must not treat the SSE
connection as the durability mechanism.

**Event schema** (SSE `data:` frames — the iss-012 chat event schema; the names are ours, not
AG-UI's — see the resolved question 3 below):
```jsonc
{"type":"content","delta":"... "}                    // streamed text deltas
{"type":"tool_call","name":"...","args":{...}}       // future tools
{"type":"tool_result","name":"...","output":{...}}
{"type":"done","runId":"...","usage":{...}}
{"type":"error","message":"..."}
```

**SDK → event mapping** (thin, ~one function):
- TanStack AI (decided): AG-UI `TEXT_MESSAGE_CONTENT` (delta) → `content`, `TOOL_CALL_*` →
  `tool_call`, `TOOL_RESULT` → `tool_result`, `RUN_FINISHED` → `done`, `RUN_ERROR` → `error`.
- Vercel AI SDK (fallback only): `streamText()` parts → `text-delta` → `content`, `tool-call` →
  `tool_call`, `tool-result` → `tool_result`, `finish` → `done`, `error` → `error`.

**Errors**: pre-stream auth/validation failures return JSON `401`/`400` (existing `api.ts`
`onError` conventions). Once the stream has started, errors are emitted as `error` events then
the stream closes — the `onError` hook can't overwrite an already-sent response.

**Write-through**: the endpoint emits SSE and hands each event to the durable-write pipeline.
Run lifecycle (`running`/`complete`/`error`) and `seq` assignment are iss-014's decision; the
contract leaves a `writeEvent(event, seq)` hook in place.

### Repo changes this contract implies

- `infra/api.ts`: add `streaming: true` to the `Api` Function (`sst.aws.Function`; default
  `false`). Existing buffered JSON routes are unaffected.
- `packages/backend/src/api/api.ts`: export `streamHandle(routes)` from `hono/aws-lambda`
  instead of `handle(routes)` (the streaming-aware adapter for `InvokeWithResponseStream`).
- `packages/backend`: add deps `@tanstack/ai` + `@tanstack/ai-openai` (+ other `@tanstack/ai-*`
  adapters — Anthropic/Gemini — when alternates are wired; adapter swap is one line).
- `infra/secret.ts` + `infra/api.ts`: `OpenAIKey` secret (above).

## Open questions for iss-015 (grilling) — all resolved

1. **Placement/proxy** — **resolved** (iss-015): same-origin **web proxy → backend** — the
   browser calls `POST /api/chat/run` on the web platform and a TanStack file route
   (`routes/api/chat/run.ts`, `$.ts`-style like `routes/api/auth/$.ts`) relays server-to-server
   to the backend Hono route with a shared internal credential. Not the direct `hc` client →
   `api.<domain>`: cross-subdomain cookies exist only on deployed stages, and previews use
   host-only cookies, so direct browser→api.<domain> calls 401 there. SSE + cookies stay
   same-origin in every stage.
2. **History trust** — **resolved** (iss-015): the endpoint **loads prior turns by `sessionId`**
   from `chat_messages`/`chat_run_events` (SolidType `hydrateTranscript` style); the client does
   **not** pass `history`. The iss-014 409 one-active-run guard guarantees the loaded history is
   complete, so no client-side caps are needed. Implies the minimal persistence schema ships
   with the tracer bullet (iss-016 pulled forward).
3. ~~**SDK ratification + wire vocabulary**~~ — **resolved**: TanStack AI (`@tanstack/ai` +
   `@tanstack/ai-openai`) is decided (Recommendation above), and the wire keeps **our five event
   names** (`content`/`tool_call`/`tool_result`/`done`/`error` from iss-012) rather than adopting
   AG-UI chunk names. AG-UI is producer-internal: the mapping function translates AG-UI chunks to
   these five, so a future SDK/provider swap touches only that function — the DB schema and
   client rendering never change. (AG-UI is also more granular than the UI needs —
   `TEXT_STARTED`/`TEXT_DELTA`/`TEXT_COMPLETE`, `THINKING_*`, `TOOL_CALL_STARTED`/`ACCEPTED`/
   `EXECUTED` — and storing raw chunk types would leak a young, versioned protocol into the
   long-lived `seq`-cursor table.)
4. **SSE fast-path shape** — **resolved** (iss-014): SSE is **skipped for v1** — the POST acks
   the runId and Electric delivers the stream. Revisit a fast-path only if first-token latency
   measured in the build demands it.
5. **Data residency / key policy** — **resolved** (iss-015): **US processing accepted for the
   MVP** (not a tracer-bullet blocker); default model **gpt-5.6-luna** (user: gpt-4.1-mini is
   old), with EU-hosted open-weight (Scaleway/Mistral) a one-line swap via the adapter `baseURL`;
   **per-user soft rate cap (~30 runs/hr)** on the provider key — enforceable because history is
   server-loaded. MCP / agent-native exposure = future session, out of scope.
