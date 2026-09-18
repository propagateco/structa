import type { ConversationObject } from "./durable-objects/conversation-object";

/**
 * Environment contract for the DataService worker. Kept explicit and
 * self-contained instead of relying on SST-generated `Cloudflare.Env`
 * augmentation so the worker typechecks standalone.
 *
 * Secrets are NOT set as plain `environment` vars (Cloudflare stores those as
 * `plain_text` and returns the values from its API). Instead they arrive via
 * SST `link` bindings named `SST_RESOURCE_*` (Cloudflare `secret_text`),
 * serialized as JSON. Use the helper accessors below to read them.
 */
export interface DataServiceEnv {
	/** Durable Object binding (SST `transform.worker` adds it to the Worker). */
	CONVERSATIONS: DurableObjectNamespace<ConversationObject>;
	/** SST link binding — JSON `{ type, url }` (secret_text). */
	SST_RESOURCE_Database?: string;
	/** SST link binding — JSON `{ type, value }` (secret_text). */
	SST_RESOURCE_DataServiceToken?: string;
	/** SST link binding — JSON `{ type, value }` (secret_text). */
	SST_RESOURCE_OpenRouterApiKey?: string;
	/** Optional model override; defaults to `deepseek/deepseek-v4-flash-0731`. */
	OPENROUTER_MODEL?: string;
}

function parseBinding<T>(raw: string | undefined): T | undefined {
	if (!raw) return undefined;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return undefined;
	}
}

/** Neon connection string for materializing run results. */
export function getDatabaseUrl(env: DataServiceEnv): string | undefined {
	return parseBinding<{ url?: string }>(env.SST_RESOURCE_Database)?.url;
}

/** Shared secret between service-to-service calls and ticket verification. */
export function getInternalToken(env: DataServiceEnv): string | undefined {
	return parseBinding<{ value?: string }>(env.SST_RESOURCE_DataServiceToken)
		?.value;
}

/** OpenRouter API key used by the run adapter. */
export function getOpenRouterApiKey(env: DataServiceEnv): string | undefined {
	return parseBinding<{ value?: string }>(env.SST_RESOURCE_OpenRouterApiKey)
		?.value;
}

/** Model override or the default flash model. */
export function getModel(env: DataServiceEnv): string {
	return env.OPENROUTER_MODEL ?? "deepseek/deepseek-v4-flash-0731";
}
