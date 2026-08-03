# AI provider + SDK research

Type: wayfinder-research
Map: iss-011-chat-map.md
Status: resolved

## Question

Which AI stack should The Clerk's `POST /api/chat/run` endpoint use — a framework SDK or raw
provider HTTP — and which model provider? The issues (iss-004) say "TanStack AI" but nothing
AI-related is installed anywhere yet.

## Context

- Backend is Hono + SST functions; **no** `ai` / `@ai-sdk/*` / provider SDK is installed in any
  package. `docs/core/architecture/ai-clerk/tanstack-ai.md` names OpenAI (gpt-4o, gpt-4.1-mini)
  primary, Anthropic + Gemini as alternatives — but that's a vision doc, not a decision.
- iss-004's minimal scope: `POST /api/chat/run` using "TanStack AI for model streaming" with
  chunked stream output. (Note: "TanStack AI" may conflate TanStack Start with the Vercel AI
  SDK — resolve the actual library name in findings.)
- Realities: agent dev workflow has no local dev server (CI previews only); provider keys live
  in SST config/secrets; the app is TanStack Start (server functions available on `packages/web`).

## What to produce

Research findings (AFK via /research subagent) covering, at minimum:

1. Recommended library: Vercel AI SDK (`ai` + `@ai-sdk/<provider>`) vs TanStack Start server
   functions vs raw provider HTTP from Hono. Criteria: streaming ergonomics, SSE support,
   tool-calling support (future), docs quality, compatibility with this monorepo.
2. Provider recommendation: OpenAI / Anthropic / Gemini for a cost-sensitive UK home-renovation
   Q&A assistant (answer quality vs cost vs latency). Model + context-window guidance.
3. Key management pattern with SST: where the API key lives, how it's referenced from the
   backend function, dev vs prod stages, and the bot-user test path.
4. A minimal `POST /api/chat/run` shape that this stack implies (request/response contract,
   stream format) — enough to hand to iss-015 without re-reading docs.

Resolution: findings captured as markdown in `docs/research/chat/`, context pointer appended
here, ticket closed. Feeds iss-015 (run endpoint) and iss-014 (streaming choice).

## Resolution

Research findings captured in `docs/research/chat/ai-provider-sdk.md`. Gist: use **TanStack AI**
(`@tanstack/ai` + `@tanstack/ai-openai`) with OpenAI `gpt-4.1-mini` ($0.40/$1.60 per 1M, 1M
context) on the Hono backend — the on-vision choice for an all-TanStack repo (the issues
literally say "TanStack AI"). The framework-agnostic core runs on Hono: `chat()` returns an
`AsyncIterable<StreamChunk>` (AG-UI chunks) for server-side `for await`, and
`toServerSentEventsResponse(stream)` frames SSE on any Node backend; AG-UI chunk types map
directly onto the iss-012 `content`/`tool_call`/`tool_result`/`done`/`error` schema. Trade-off:
`@tanstack/ai` is Beta (v0.42) with no SST-maintained Lambda-streaming example — the Vercel AI
SDK (`ai` + `@ai-sdk/openai`) stays as the pragmatic fallback if that bites (flag in iss-015).
Key lives as an SST secret (`OpenAIKey`, `--fallback` value for `pr-N` previews); the endpoint
streams SSE via `streamHandle` + `streaming: true`. Wire vocabulary is decided: the five event
names (`content`/`tool_call`/`tool_result`/`done`/`error`) stay — AG-UI is producer-internal
behind the mapping function, so a future SDK/provider swap touches only that function. Open
questions for iss-015: placement/proxy path, history trust, SSE fast-path shape, and UK
data-residency stance.
