import * as pulumi from "@pulumi/pulumi";

/**
 * Electric Cloud API base URL.
 * The existing electric-proxy uses https://api.electric-sql.cloud/v1/shape
 * for shape requests. The management API lives under the same origin.
 */
const ELECTRIC_CLOUD_API = "https://api.electric-sql.cloud/v1";

/**
 * Region for Electric Cloud Postgres Sync services.
 * Must match the Neon project region (aws-eu-west-2) for lowest latency.
 */
const ELECTRIC_REGION = "eu-west-2";

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

async function apiPost<T = any>(
    url: string,
    headers: AuthHeaders,
    body: Record<string, unknown>,
): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Electric Cloud API POST ${url} failed (${res.status}): ${text}`,
        );
    }
    return res.json() as Promise<T>;
}

async function apiGet<T = any>(
    url: string,
    headers: AuthHeaders,
): Promise<T> {
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Electric Cloud API GET ${url} failed (${res.status}): ${text}`,
        );
    }
    return res.json() as Promise<T>;
}

async function apiDelete(
    url: string,
    headers: AuthHeaders,
): Promise<void> {
    const res = await fetch(url, { method: "DELETE", headers });
    // Treat 404 as idempotent success (resource already removed)
    if (res.ok || res.status === 404) return;
    const text = await res.text();
    throw new Error(
        `Electric Cloud API DELETE ${url} failed (${res.status}): ${text}`,
    );
}

// ---------------------------------------------------------------------------
// Inputs & outputs
// ---------------------------------------------------------------------------

export interface ElectricCloudSyncInputs {
    /** Full connection URI of the Neon branch to sync from. */
    databaseUrl: string;
    /** Electric Cloud API token. */
    apiToken: string;
    /** Electric Cloud project ID. */
    projectId: string;
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
        token: string,
        timeoutMs = 60_000,
    ): Promise<void> {
        const headers = auth(token);
        const url = `${ELECTRIC_CLOUD_API}/services/postgres/${serviceId}`;
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            const svc = await apiGet<{ status: string }>(url, headers);
            if (svc.status === "active") return;
            if (svc.status === "failed") {
                throw new Error(
                    `Electric Cloud Postgres service ${serviceId} entered failed status`,
                );
            }
            // Wait 5 seconds before polling again
            await new Promise((r) => setTimeout(r, 5000));
        }
        throw new Error(
            `Electric Cloud Postgres service ${serviceId} did not become active within ${timeoutMs}ms`,
        );
    }

    // -- lifecycle ---------------------------------------------------------

    async create(
        inputs: ElectricCloudSyncInputs,
    ): Promise<pulumi.dynamic.CreateResult> {
        const { apiToken, projectId, stage, databaseUrl } = inputs;
        const envName = `preview-${stage}`;
        const headers = auth(apiToken);

        // 1. Create an environment in the Electric Cloud project
        let environmentId: string;
        try {
            const env = await apiPost<{ id: string }>(
                `${ELECTRIC_CLOUD_API}/projects/${projectId}/environments`,
                headers,
                { name: envName },
            );
            environmentId = env.id;
        } catch (err) {
            throw new Error(
                `Failed to create Electric Cloud environment '${envName}': ${err instanceof Error ? err.message : String(err)}`,
            );
        }

        // 2. Create a Postgres Sync service connected to the Neon branch
        let serviceId: string;
        try {
            const svc = await apiPost<{ id: string }>(
                `${ELECTRIC_CLOUD_API}/environments/${environmentId}/services/postgres`,
                headers,
                {
                    database_url: databaseUrl,
                    region: ELECTRIC_REGION,
                },
            );
            serviceId = svc.id;
        } catch (err) {
            // Clean up: delete the environment if service creation fails
            await apiDelete(
                `${ELECTRIC_CLOUD_API}/environments/${environmentId}`,
                headers,
            );
            throw new Error(
                `Failed to create Electric Cloud Postgres service: ${err instanceof Error ? err.message : String(err)}`,
            );
        }

        // 3. Wait for the service to become active
        try {
            await this.waitForActive(serviceId, apiToken);
        } catch (err) {
            // Clean up: delete service and environment
            await apiDelete(
                `${ELECTRIC_CLOUD_API}/services/${serviceId}`,
                headers,
            );
            await apiDelete(
                `${ELECTRIC_CLOUD_API}/environments/${environmentId}`,
                headers,
            );
            throw err;
        }

        // 4. Retrieve the service secret
        let serviceSecret: string;
        try {
            const secretData = await apiGet<{ secret: string }>(
                `${ELECTRIC_CLOUD_API}/services/${serviceId}/secret`,
                headers,
            );
            serviceSecret = secretData.secret;
        } catch (err) {
            // Clean up: delete service and environment
            await apiDelete(
                `${ELECTRIC_CLOUD_API}/services/${serviceId}`,
                headers,
            );
            await apiDelete(
                `${ELECTRIC_CLOUD_API}/environments/${environmentId}`,
                headers,
            );
            throw new Error(
                `Failed to retrieve Electric Cloud service secret: ${err instanceof Error ? err.message : String(err)}`,
            );
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
        inputs: ElectricCloudSyncInputs,
    ): Promise<pulumi.dynamic.ReadResult> {
        // Attempt to read back the current state from the API.
        // If the service no longer exists (404), return undefined outputs
        // so Pulumi treats the resource as deleted.
        const headers = auth(inputs.apiToken ?? "");
        try {
            const svc = await apiGet<{ id: string; status: string }>(
                `${ELECTRIC_CLOUD_API}/services/postgres/${id}`,
                headers,
            );

            // Derive the environment ID from the service parent
            // (the response may include environment_id; if not, we keep the
            // previously stored one from inputs if available).
            let environmentId = (inputs as any).environmentId ?? "";
            let secret = (inputs as any).secret ?? "";

            // Try to fetch the secret
            try {
                const secretData = await apiGet<{ secret: string }>(
                    `${ELECTRIC_CLOUD_API}/services/${id}/secret`,
                    headers,
                );
                secret = secretData.secret;
            } catch {
                // Secret fetch may fail if the service is not active yet;
                // keep whatever was stored.
            }

            return {
                id: svc.id,
                outs: {
                    sourceId: svc.id,
                    secret,
                    serviceId: svc.id,
                    environmentId,
                    environmentName: inputs.stage
                        ? `preview-${inputs.stage}`
                        : "",
                    apiToken: inputs.apiToken ?? "",
                    projectId: inputs.projectId ?? "",
                },
            };
        } catch {
            // Service not found — return empty outs so Pulumi can recreate
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
    }

    async delete(id: string, props: ElectricCloudSyncOutputs): Promise<void> {
        const token = (props as any).apiToken ?? "";
        const headers = auth(token);

        // Delete the service first, then the environment.
        // This order is important: the environment cannot be removed while
        // it still contains services.
        const errors: string[] = [];

        if (props.serviceId) {
            try {
                await apiDelete(
                    `${ELECTRIC_CLOUD_API}/services/${props.serviceId}`,
                    headers,
                );
            } catch (err) {
                errors.push(
                    `service: ${err instanceof Error ? err.message : String(err)}`,
                );
            }
        }

        if (props.environmentId) {
            try {
                await apiDelete(
                    `${ELECTRIC_CLOUD_API}/environments/${props.environmentId}`,
                    headers,
                );
            } catch (err) {
                errors.push(
                    `environment: ${err instanceof Error ? err.message : String(err)}`,
                );
            }
        }

        if (errors.length > 0) {
            throw new Error(
                `Electric Cloud cleanup encountered errors: ${errors.join("; ")}`,
            );
        }
    }
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
            databaseUrl: pulumi.Input<string>;
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
                databaseUrl: args.databaseUrl,
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
