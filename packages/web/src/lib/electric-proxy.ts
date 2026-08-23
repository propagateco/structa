import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";
import { Resource } from "sst";

/**
 * Electric Cloud base URL
 * The source_id is passed as a query parameter, not part of the URL
 */
const ELECTRIC_CLOUD_BASE_URL = "https://api.electric-sql.cloud/v1/shape";

/**
 * Electric Cloud management API base URL (the same @orpc RPC protocol the
 * SST ElectricCloudSync dynamic resource uses). On preview stages the sync
 * source id + secret are created at deploy time and cannot be baked into
 * the SyncEngine link, so we resolve them at runtime via this API.
 */
const ELECTRIC_CLOUD_API = "https://dashboard.electric-sql.cloud/api/rpc";

let cachedSource: string | undefined;
let cachedSecret: string | undefined;

/**
 * Call an Electric Cloud RPC endpoint.
 *
 * The @orpc/client protocol wraps params in {"json": {…}} and unwraps
 * responses from {"json": {…}}. Errors also arrive as HTTP 200 with a
 * NOT_FOUND / etc. code inside the json envelope.
 */
async function rpcCall<T = Record<string, unknown>>(
	method: string,
	token: string,
	params: Record<string, unknown>,
): Promise<T> {
	const res = await fetch(`${ELECTRIC_CLOUD_API}/${method}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ json: params }),
	});

	if (!res.ok) {
		throw new Error(`Electric Cloud API POST ${method} failed (${res.status})`);
	}

	const body = (await res.json()) as {
		json?: T & { code?: string; message?: string };
	};

	if (body.json && "code" in body.json && body.json.code === "NOT_FOUND") {
		throw new Error(body.json.message ?? "Electric Cloud resource not found");
	}

	return body.json as T;
}

/** Clear the module-level credential cache (used by tests). */
export function resetElectricCredentialsCache(): void {
	cachedSource = undefined;
	cachedSecret = undefined;
}

/**
 * Resolve the Electric sync source id + secret for this stage.
 *
 * - Deployed stages (dev, production): the SyncEngine link bakes the static
 *   ElectricSqlSource / ElectricSqlSecret secret values, so use those
 *   directly (no API call).
 * - Preview/personal stages: the source id + secret are created at deploy
 *   time by the ElectricCloudSync dynamic resource, whose outputs cannot be
 *   serialized into the link. Resolve them at runtime from the Electric
 *   Cloud management API using the linked API token. The environment name is
 *   deterministic (`preview-{stage}`), so no extra config is needed.
 *
 * Results are cached for the lifetime of the Lambda container.
 */
async function resolveElectricCredentials(): Promise<{
	source: string;
	secret: string;
}> {
	if (cachedSource && cachedSecret) {
		return { source: cachedSource, secret: cachedSecret };
	}

	// 1. Static link (dev/production).
	const syncEngine = Resource.SyncEngine as typeof Resource.SyncEngine & {
		source?: string;
		secret?: string;
	};
	const staticSource = syncEngine?.source;
	const staticSecret = syncEngine?.secret;
	if (staticSource && staticSecret) {
		cachedSource = staticSource;
		cachedSecret = staticSecret;
		return { source: staticSource, secret: staticSecret };
	}

	// 2. Runtime lookup (preview stages).
	const token = Resource.ElectricCloudApiToken?.value;
	const projectId = Resource.ElectricCloudProjectId?.value;
	if (!token || !projectId) {
		throw new Error(
			`Cannot resolve Electric credentials: no SyncEngine link and no ` +
				`ElectricCloudApiToken/ElectricCloudProjectId. Got: ` +
				JSON.stringify(Resource.SyncEngine),
		);
	}

	// a. Find the environment created for this stage.
	const envName = `preview-${Resource.App.stage}`;
	const envs = await rpcCall<{
		environments: Array<{ id: string; name: string }>;
	}>("environments/list", token, { projectId });
	const env = envs.environments.find((e) => e.name === envName);
	if (!env) {
		throw new Error(
			`Electric Cloud environment '${envName}' not found. It is created ` +
				`during the first deploy of this stage; redeploy if missing.`,
		);
	}

	// b. Find the postgres sync service.
	const svcs = await rpcCall<{
		services: Array<{ id: string }>;
	}>("services/list", token, { environmentId: env.id });
	const service = svcs.services.find((s) => s.id);
	if (!service) {
		throw new Error(
			`No Electric Cloud sync service found in environment '${envName}'.`,
		);
	}

	// c. Fetch the service secret.
	const secretResult = await rpcCall<{ secret: string }>(
		"services/getSecret",
		token,
		{ serviceId: service.id },
	);

	cachedSource = service.id;
	cachedSecret = secretResult.secret;
	return { source: service.id, secret: secretResult.secret };
}

/**
 * Get the Electric source ID (resolved per stage — see
 * resolveElectricCredentials).
 */
export async function getElectricSourceId(): Promise<string> {
	return (await resolveElectricCredentials()).source;
}

/**
 * Get the Electric secret for authentication (resolved per stage — see
 * resolveElectricCredentials).
 */
export async function getElectricSecret(): Promise<string> {
	return (await resolveElectricCredentials()).secret;
}

/**
 * Build the upstream Electric URL with proper parameters
 * Only passes through Electric protocol parameters and sets server-side shape config
 */
export async function buildElectricUpstreamUrl(
	request: Request,
	table: string,
	whereClause?: string,
): Promise<URL> {
	const { source, secret } = await resolveElectricCredentials();
	const requestUrl = new URL(request.url);
	// Use the Electric Cloud base URL
	const originUrl = new URL(ELECTRIC_CLOUD_BASE_URL);

	// Pass through Electric protocol parameters (offset, handle, live, etc.)
	requestUrl.searchParams.forEach((value, key) => {
		if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
			originUrl.searchParams.set(key, value);
		}
	});

	// Set shape definition server-side (security: these must be controlled by server)
	originUrl.searchParams.set("source_id", source);
	originUrl.searchParams.set("secret", secret);
	originUrl.searchParams.set("table", table);

	if (whereClause) {
		originUrl.searchParams.set("where", whereClause);
	}

	console.debug("[electric-proxy] Built URL:", originUrl.toString());

	return originUrl;
}

/**
 * Proxy a request to Electric Cloud and return the response
 * Handles proper header cleanup for browser compatibility
 */
export async function proxyToElectric(originUrl: URL): Promise<Response> {
	const response = await fetch(originUrl);

	// Clean up headers that would break decoding in the browser
	// See: https://github.com/whatwg/fetch/issues/1729
	const headers = new Headers(response.headers);
	headers.delete("content-encoding");
	headers.delete("content-length");

	// Add Vary header for proper cache isolation with cookie-based auth
	headers.set("Vary", "Cookie");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}
