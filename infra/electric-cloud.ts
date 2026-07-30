import * as pulumi from "@pulumi/pulumi";

/**
 * Electric Cloud management API base URL.
 * The dashboard API uses a JSON-RPC style protocol via @orpc/client.
 * Do NOT use api.electric-sql.cloud/v1 — that is the shape proxy, not the
 * management API.
 */
const ELECTRIC_CLOUD_API = "https://dashboard.electric-sql.cloud/api/rpc";

/**
 * Region for Electric Cloud Postgres Sync services.
 * Must be eu-west-1 (eu-west-2 is not supported by Electric Cloud).
 */
const ELECTRIC_REGION = "eu-west-1";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface AuthHeaders {
    Authorization: string;
    "Content-Type": string;
}

function auth(token: string): AuthHeaders {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

/**
 * Custom error to distinguish "resource not found" responses (which arrive
 * as HTTP 200 with {"json":{"defined":true,"code":"NOT_FOUND",…}}) from
 * true HTTP / network failures.
 */
class ObjectNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ObjectNotFoundError";
    }
}

/**
 * Call an Electric Cloud RPC endpoint.
 *
 * The @orpc/client protocol wraps params in {"json": {…}} and unwraps
 * responses from {"json": {…}}.  Errors also arrive as HTTP 200 with a
 * NOT_FOUND / etc. code inside the json envelope.
 */
async function rpcCall<T = Record<string, unknown>>(
    method: string,
    headers: AuthHeaders,
    params: Record<string, unknown>,
): Promise<T> {
    const url = `${ELECTRIC_CLOUD_API}/${method}`;
    const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ json: params }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Electric Cloud API POST ${method} failed (${res.status}): ${text}`,
        );
    }

    const body = (await res.json()) as {
        json?: T & { defined?: boolean; code?: string; status?: number; message?: string };
    };

    // The API returns HTTP 200 even for errors; check the json envelope.
    if (body.json && "code" in body.json && body.json.code === "NOT_FOUND") {
        throw new ObjectNotFoundError(
            body.json.message ?? "Resource not found",
        );
    }

    return body.json as T;
}

// ---------------------------------------------------------------------------
// Inputs & outputs
// ---------------------------------------------------------------------------

export interface ElectricCloudSyncInputs {
    /** Full connection URI of the Neon branch to sync from. */
    databaseUrl?: string;
    /** Neon API key for fetching database credentials. */
    neonApiKey?: string;
    /** Neon project ID for fetching database credentials. */
    neonProjectId?: string;
    /**
     * Endpoint host from the preview branch's Neon endpoint.
     * Used together with neonApiKey + neonProjectId to construct a valid
     * database URL inside the provider.
     */
    endpointHost?: string;
    /** Electric Cloud API token. */
    apiToken: string;
    /** Electric Cloud project ID. */
    projectId?: string;
    /** Deprecated alias for projectId. */
    electricProjectId?: string;
    /** SST stage name (used to name the environment). */
    stage: string;
}

export interface ElectricCloudSyncOutputs {
    /** The Electric service ID (used as the source_id in shape requests). */
    sourceId: string;
    /** The Electric service secret (used as the secret in shape requests). */
    secret: string;
    /** The Electric service ID (same as sourceId). */
    serviceId: string;
    /** The Electric environment ID. */
    environmentId: string;
    /** The Electric environment name. */
    environmentName: string;
    /**
     * API token stored in outputs so it is available during delete/read.
     * The Pulumi state is encrypted, so this is safe to persist.
     */
    apiToken: string;
    /** Project ID stored in outputs for delete/read lifecycle methods. */
    projectId: string;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

class ElectricCloudSyncProvider
    implements pulumi.dynamic.ResourceProvider
{
    /**
     * Wait for a Postgres Sync service to reach the "active" status.
     * Polls every 5 seconds up to a maximum of 60 seconds.
     */
    private async waitForActive(
        serviceId: string,
        environmentId: string,
        token: string,
        timeoutMs = 60_000,
    ): Promise<void> {
        const headers = auth(token);
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            const result = await rpcCall<{
                services: Array<{ id: string; status: string }>;
            }>("services/list", headers, { environmentId });

            const svc = result.services.find((s) => s.id === serviceId);
            if (!svc) {
                throw new Error(
                    `Electric Cloud Postgres service ${serviceId} not found in environment ${environmentId}`,
                );
            }
            if (svc.status === "active") return;
            if (svc.status === "failed") {
                throw new Error(
                    `Electric Cloud Postgres service ${serviceId} entered failed status`,
                );
            }
            await new Promise((r) => setTimeout(r, 5000));
        }

        throw new Error(
            `Electric Cloud Postgres service ${serviceId} did not become active within ${timeoutMs}ms`,
        );
    }

    /** Best-effort service delete (swallows errors for cleanup paths). */
    private async deleteServiceSafe(
        serviceId: string,
        headers: AuthHeaders,
    ): Promise<void> {
        try {
            await rpcCall("services/delete", headers, {
                serviceId,
                forceDelete: true,
            });
        } catch {
            // best effort
        }
    }

    /** Best-effort environment delete (swallows errors for cleanup paths). */
    private async deleteEnvironmentSafe(
        environmentId: string,
        headers: AuthHeaders,
    ): Promise<void> {
        try {
            await rpcCall("environments/delete", headers, {
                environmentId,
            });
        } catch {
            // best effort
        }
    }

    /** Clean up both service and environment after a mid-creation failure. */
    private async cleanup(
        serviceId: string,
        environmentId: string,
        headers: AuthHeaders,
    ): Promise<void> {
        await this.deleteServiceSafe(serviceId, headers);
        await this.deleteEnvironmentSafe(environmentId, headers);
    }

    /**
     * Look up an environment by name in the project, or return null.
     */
    private async findEnvironmentByName(
        projectId: string,
        name: string,
        headers: AuthHeaders,
    ): Promise<string | null> {
        try {
            const result = await rpcCall<{
                environments: Array<{ id: string; name: string }>;
            }>("environments/list", headers, { projectId });
            const match = result.environments.find((e) => e.name === name);
            return match ? match.id : null;
        } catch {
            return null;
        }
    }

    // -- helpers ----------------------------------------------------------

    /**
     * Build a database URL from Neon API data + the preview endpoint host.
     * Called when the pre-constructed databaseUrl contains "undefined".
     *
     * Makes the same three Neon API calls as NeonProjectDataProvider.create()
     * but returns the connection URI re-written to use `endpointHost`.
     */
    private async buildDatabaseUrl(
        apiKey: string,
        neonProjectId: string,
        endpointHost: string,
    ): Promise<string> {
        if (!apiKey || !neonProjectId || !endpointHost) {
            throw new Error(
                `Cannot build database URL: missing credentials ` +
                    `(apiKey=${!!apiKey}, neonProjectId=${!!neonProjectId}, endpointHost=${!!endpointHost})`,
            );
        }

        const headers = {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        } as const;

        // 1. Find the default branch
        const NEON_API = "https://console.neon.tech/api/v2";
        const branchesRes = await fetch(
            `${NEON_API}/projects/${neonProjectId}/branches`,
            { headers },
        );
        if (!branchesRes.ok) {
            throw new Error(
                `Neon API: failed to list branches: ${branchesRes.status} ${await branchesRes.text()}`,
            );
        }
        const branches = (await branchesRes.json()) as {
            branches: Array<{ id: string; default?: boolean; name?: string }>;
        };
        const defaultBranch = branches.branches.find((b) => b.default);
        if (!defaultBranch) {
            throw new Error(
                `Neon API: no default branch found in project ${neonProjectId}`,
            );
        }

        // 2. Get the database name and owner from the default branch
        const dbsRes = await fetch(
            `${NEON_API}/projects/${neonProjectId}/branches/${defaultBranch.id}/databases`,
            { headers },
        );
        if (!dbsRes.ok) {
            throw new Error(
                `Neon API: failed to list databases: ${dbsRes.status} ${await dbsRes.text()}`,
            );
        }
        const dbs = (await dbsRes.json()) as {
            databases: Array<{ name: string; owner_name: string }>;
        };
        const db = dbs.databases[0];
        if (!db) {
            throw new Error(
                `Neon API: no databases found on branch ${defaultBranch.id}`,
            );
        }

        // 3. Get the connection URI for this database/role (for the password)
        const connRes = await fetch(
            `${NEON_API}/projects/${neonProjectId}/connection_uri` +
                `?database_name=${encodeURIComponent(db.name)}` +
                `&role_name=${encodeURIComponent(db.owner_name)}`,
            { headers },
        );
        if (!connRes.ok) {
            throw new Error(
                `Neon API: failed to get connection URI: ${connRes.status} ${await connRes.text()}`,
            );
        }
        const conn = (await connRes.json()) as { uri: string };
        const originalUri = new URL(conn.uri);

        // 4. Build the final URL — use the password and user from the dev
        //    project's connection URI, but the host from the preview endpoint.
        return `postgresql://${db.owner_name}:${encodeURIComponent(originalUri.password)}@${endpointHost}:5432/${db.name}`;
    }

    // -- lifecycle ---------------------------------------------------------

    async create(
        inputs: ElectricCloudSyncInputs,
    ): Promise<pulumi.dynamic.CreateResult> {
        const {
            apiToken,
            projectId,
            stage,
            databaseUrl,
            neonApiKey,
            neonProjectId,
            endpointHost,
        } = inputs;
        const envName = `preview-${stage}`;
        const headers = auth(apiToken);

        // Resolve the database URL. If the pre-built URL contains "undefined"
        // (due to dynamic-resource output timing), construct a valid one
        // from the resolved endpointHost + Neon API credentials.
        const resolvedUrl = databaseUrl && !databaseUrl.includes("undefined")
            ? databaseUrl
            : await this.buildDatabaseUrl(
                  neonApiKey ?? "",
                  neonProjectId ?? "",
                  endpointHost ?? "",
              );

        // 1a. Check if the environment already exists (idempotent create)
        let existingId = await this.findEnvironmentByName(
            projectId,
            envName,
            headers,
        );
        if (existingId) {
            console.log(
                `Electric Cloud: re-using existing environment '${envName}' (${existingId})`,
            );
        }

        // 1b. Create an environment in the Electric Cloud project (or fail
        //     gracefully if the name is reserved but not visible — try a
        //     slightly different name with a suffix).
        let environmentId: string;
        if (existingId) {
            environmentId = existingId;
        } else {
            try {
                const env = await rpcCall<{ environmentId: string }>(
                    "projects/createEnvironment",
                    headers,
                    { projectId, name: envName },
                );
                environmentId = env.environmentId;
            } catch (err) {
                // If the name is reserved but not visible in the listing,
                // create with a unique suffix.
                const msg =
                    err instanceof Error ? err.message : String(err);
                if (msg.includes("ENVIRONMENT_NAME_ALREADY_EXISTS")) {
                    const fallbackName = `${envName}-${Date.now().toString(36)}`;
                    console.log(
                        `Electric Cloud: name '${envName}' reserved; trying '${fallbackName}'`,
                    );
                    const env = await rpcCall<{ environmentId: string }>(
                        "projects/createEnvironment",
                        headers,
                        {
                            projectId,
                            name: fallbackName,
                        },
                    );
                    environmentId = env.environmentId;
                } else {
                    throw new Error(
                        `Failed to create Electric Cloud environment '${envName}': ${msg}`,
                    );
                }
            }
        }

        // 2. Create a Postgres Sync service connected to the Neon branch
        let serviceId: string;
        let sourceSecret: string;
        try {
            const svc = await rpcCall<{ id: string; sourceSecret: string }>(
                "services/postgres/create",
                headers,
                {
                    environmentId,
                    databaseUrl: resolvedUrl,
                    region: ELECTRIC_REGION,
                    scaling: { maxConnections: 5 },
                    poolSize: 5,
                },
            );
            serviceId = svc.id;
            sourceSecret = svc.sourceSecret;
        } catch (err) {
            await this.deleteEnvironmentSafe(environmentId, headers);
            throw new Error(
                `Failed to create Electric Cloud Postgres service: ${err instanceof Error ? err.message : String(err)}`,
            );
        }

        // 3. Wait for the service to become active
        try {
            await this.waitForActive(serviceId, environmentId, apiToken);
        } catch (err) {
            await this.cleanup(serviceId, environmentId, headers);
            throw err;
        }

        // 4. Retrieve the service secret
        let serviceSecret: string;
        try {
            const secretResult = await rpcCall<{ secret: string }>(
                "services/getSecret",
                headers,
                { serviceId },
            );
            serviceSecret = secretResult.secret;
        } catch (err) {
            // Fall back to the sourceSecret returned during creation
            serviceSecret = sourceSecret;
        }

        return {
            id: serviceId,
            outs: {
                sourceId: serviceId,
                secret: serviceSecret,
                serviceId,
                environmentId,
                environmentName: envName,
                // Persist credentials in encrypted state for delete/read
                apiToken,
                projectId,
            },
        };
    }

    async read(
        id: string,
        props: ElectricCloudSyncInputs & Partial<ElectricCloudSyncOutputs>,
    ): Promise<pulumi.dynamic.ReadResult> {
        const environmentId = props.environmentId ?? "";
        const token = props.apiToken ?? "";
        const headers = auth(token);

        // Without an environmentId we cannot list services.
        if (!environmentId) {
            return emptyResult(id);
        }

        try {
            // List services in the environment and find ours by ID.
            const result = await rpcCall<{
                services: Array<{ id: string; status: string }>;
            }>("services/list", headers, { environmentId });

            const svc = result.services.find((s) => s.id === id);
            if (!svc) {
                return emptyResult(id);
            }

            // Try to fetch the secret; keep stored value on failure.
            let secret = props.secret ?? "";
            try {
                const secretResult = await rpcCall<{ secret: string }>(
                    "services/getSecret",
                    headers,
                    { serviceId: id },
                );
                secret = secretResult.secret;
            } catch {
                // keep whatever was stored
            }

            return {
                id,
                outs: {
                    sourceId: id,
                    secret,
                    serviceId: id,
                    environmentId,
                    environmentName: props.stage
                        ? `preview-${props.stage}`
                        : "",
                    apiToken: props.apiToken ?? "",
                    projectId: props.projectId ?? "",
                },
            };
        } catch (err) {
            // Service or environment gone — return empty outs so Pulumi
            // knows to recreate the resource.
            if (err instanceof ObjectNotFoundError) {
                return emptyResult(id);
            }
            throw err;
        }
    }

    async delete(
        id: string,
        props: ElectricCloudSyncOutputs,
    ): Promise<void> {
        const token = props.apiToken ?? "";
        const headers = auth(token);

        // Delete the service first, then the environment.
        // This order is important: the environment cannot be removed while
        // it still contains services.
        const errors: string[] = [];

        if (props.serviceId) {
            try {
                await rpcCall("services/delete", headers, {
                    serviceId: props.serviceId,
                    forceDelete: true,
                });
            } catch (err) {
                if (!(err instanceof ObjectNotFoundError)) {
                    errors.push(
                        `service: ${err instanceof Error ? err.message : String(err)}`,
                    );
                }
            }
        }

        if (props.environmentId) {
            try {
                await rpcCall("environments/delete", headers, {
                    environmentId: props.environmentId,
                });
            } catch (err) {
                if (!(err instanceof ObjectNotFoundError)) {
                    errors.push(
                        `environment: ${err instanceof Error ? err.message : String(err)}`,
                    );
                }
            }
        }

        if (errors.length > 0) {
            throw new Error(
                `Electric Cloud cleanup encountered errors: ${errors.join("; ")}`,
            );
        }
    }
}

/** Convenience: an empty ReadResult (resource no longer exists). */
function emptyResult(id: string): pulumi.dynamic.ReadResult {
    return {
        id,
        outs: {
            sourceId: "",
            secret: "",
            serviceId: "",
            environmentId: "",
            environmentName: "",
            apiToken: "",
            projectId: "",
        },
    };
}

// ---------------------------------------------------------------------------
// Resource
// ---------------------------------------------------------------------------

/**
 * A Pulumi dynamic resource that manages an Electric Cloud Postgres Sync
 * service and its parent environment.
 *
 * Inputs:
 *   databaseUrl – Full connection URI of the Neon branch
 *   apiToken    – Electric Cloud API token
 *   projectId   – Electric Cloud project ID
 *   stage       – SST stage name
 *
 * Outputs:
 *   sourceId        – Service ID (used as source_id for shape requests)
 *   secret          – Service secret (used as auth for shape requests)
 *   serviceId       – Same as sourceId
 *   environmentId   – Electric environment ID
 *   environmentName – Electric environment name (preview-{stage})
 */
export class ElectricCloudSync extends pulumi.dynamic.Resource {
    public readonly sourceId!: pulumi.Output<string>;
    public readonly secret!: pulumi.Output<string>;
    public readonly serviceId!: pulumi.Output<string>;
    public readonly environmentId!: pulumi.Output<string>;
    public readonly environmentName!: pulumi.Output<string>;

    constructor(
        name: string,
        args: {
            databaseUrl?: pulumi.Input<string>;
            neonApiKey?: pulumi.Input<string>;
            neonProjectId?: pulumi.Input<string>;
            endpointHost?: pulumi.Input<string>;
            apiToken: pulumi.Input<string>;
            projectId: pulumi.Input<string>;
            stage: pulumi.Input<string>;
        },
        opts?: pulumi.CustomResourceOptions,
    ) {
        super(
            new ElectricCloudSyncProvider(),
            name,
            {
                databaseUrl: args.databaseUrl ?? "",
                neonApiKey: args.neonApiKey ?? "",
                neonProjectId: args.neonProjectId ?? "",
                endpointHost: args.endpointHost ?? "",
                apiToken: args.apiToken,
                projectId: args.projectId,
                stage: args.stage,
                sourceId: undefined,
                secret: undefined,
                serviceId: undefined,
                environmentId: undefined,
                environmentName: undefined,
                // apiToken and projectId are stored as outputs so they're
                // available in the delete lifecycle method
            },
            opts,
        );
    }
}
