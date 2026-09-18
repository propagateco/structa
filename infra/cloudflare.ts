/**
 * Cloudflare Worker runtime for conversations and future durable jobs.
 *
 * SST owns the Worker deployment and Durable Object migrations. The Worker is
 * intentionally separate from the AWS web/API stack so Cloudflare can hibernate
 * idle conversation objects and scale the edge runtime independently.
 *
 * The Worker links Neon (for run materialization), OpenRouter (model
 * execution), and the shared DataServiceToken used for service relays
 * (`Authorization: Bearer`) and browser capability-ticket verification.
 * `OPENROUTER_MODEL` is intentionally not pinned here — the Durable Object
 * falls back to `deepseek/deepseek-v4-flash-0731` unless overridden at build
 * time.
 */
import { Database } from './database';
import { secret } from './secret';

export const dataService = new sst.cloudflare.Worker('DataService', {
    handler: 'packages/functions/src/cloudflare/index.ts',
    url: true,
    compatibility: {
        date: '2026-09-09',
        flags: ['nodejs_compat'],
    },
    link: [
        Database,
        secret.DataServiceToken,
        secret.OpenRouterApiKey,
    ],
    // NOTE: no `environment` block here. Env vars on a Cloudflare Worker are
    // stored/returned as plain_text (the Workers API echoes their values).
    // Secrets + the Database URL flow through the `link`s above as
    // `SST_RESOURCE_*` secret_text bindings, read via `getInternalToken` /
    // `getOpenRouterApiKey` / `getDatabaseUrl` in
    // `packages/functions/src/cloudflare/env.ts`.
    migrations: [
        {
            tag: 'v1-conversations',
            newSqliteClasses: ['ConversationObject'],
        },
    ],
    transform: {
        worker: (args) => {
            args.bindings = $resolve(args.bindings).apply((bindings) => [
                ...bindings,
                {
                    name: 'CONVERSATIONS',
                    type: 'durable_object_namespace',
                    className: 'ConversationObject',
                },
            ]);
        },
    },
});