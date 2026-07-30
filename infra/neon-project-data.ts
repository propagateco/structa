import * as pulumi from "@pulumi/pulumi";

const NEON_API_BASE = "https://console.neon.tech/api/v2";

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

async function apiGet<T = any>(
    url: string,
    headers: AuthHeaders,
): Promise<T> {
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Neon API GET ${url} failed (${res.status}): ${text}`,
        );
    }
    return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface NeonProjectDataInputs {
    projectId: string;
    apiKey: string;
}

export interface NeonProjectDataOutputs {
    projectId: string;
    apiKey: string;
    defaultBranchId: string;
    databaseUser: string;
    databaseName: string;
    databasePassword: string;
    databaseHost: string;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

class NeonProjectDataProvider
    implements pulumi.dynamic.ResourceProvider
{
    async create(
        inputs: NeonProjectDataInputs,
    ): Promise<pulumi.dynamic.CreateResult> {
        const { projectId, apiKey } = inputs;
        const headers = auth(apiKey);

        // Fetch project details from the Neon REST API directly.
        // The Pulumi Terraform provider's getProjectOutput invoke has been
        // observed to fail with an empty gRPC error for new stages, so we
        // bypass it with this direct API call.
        const data = await apiGet<{ project: any }>(
            `${NEON_API_BASE}/projects/${projectId}`,
            headers,
        );

        const project = data.project;

        return {
            id: projectId,
            outs: {
                projectId,
                apiKey,
                defaultBranchId: project.default_branch_id,
                databaseUser: project.database_user,
                databaseName: project.database_name,
                databasePassword: project.database_password,
                databaseHost: project.database_host,
            },
        };
    }

    async read(
        id: string,
        inputs: NeonProjectDataInputs,
    ): Promise<pulumi.dynamic.ReadResult> {
        // On re-read, try to fetch the project again.
        // If the project no longer exists, return empty outputs.
        const headers = auth(inputs.apiKey ?? "");
        try {
            const data = await apiGet<{ project: any }>(
                `${NEON_API_BASE}/projects/${id}`,
                headers,
            );
            const project = data.project;
            return {
                id,
                outs: {
                    projectId: id,
                    apiKey: inputs.apiKey ?? "",
                    defaultBranchId: project.default_branch_id,
                    databaseUser: project.database_user,
                    databaseName: project.database_name,
                    databasePassword: project.database_password,
                    databaseHost: project.database_host,
                },
            };
        } catch {
            // Project not found — empty outs so Pulumi can recreate
            return {
                id,
                outs: {
                    projectId: "",
                    apiKey: "",
                    defaultBranchId: "",
                    databaseUser: "",
                    databaseName: "",
                    databasePassword: "",
                    databaseHost: "",
                },
            };
        }
    }

    async delete(
        id: string,
        props: NeonProjectDataOutputs,
    ): Promise<void> {
        // This is a data-only resource — nothing to delete.
    }
}

// ---------------------------------------------------------------------------
// Resource
// ---------------------------------------------------------------------------

/**
 * Reads Neon project data directly from the Neon REST API.
 *
 * This is a Pulumi dynamic resource that bypasses the Terraform provider's
 * data source to avoid an opaque gRPC invoke error that occurs for new
 * stages with neon.getProjectOutput.
 *
 * Inputs:
 *   projectId – The Neon project ID
 *   apiKey    – Neon API key (must have project read access)
 *
 * Outputs:
 *   projectId        – Same as input (for convenience)
 *   defaultBranchId  – The project's default branch ID
 *   databaseUser     – The project's database user
 *   databaseName     – The project's database name
 *   databasePassword – The project's database password
 *   databaseHost     – The project's database host
 */
export class NeonProjectData extends pulumi.dynamic.Resource {
    public readonly projectId!: pulumi.Output<string>;
    public readonly apiKey!: pulumi.Output<string>;
    public readonly defaultBranchId!: pulumi.Output<string>;
    public readonly databaseUser!: pulumi.Output<string>;
    public readonly databaseName!: pulumi.Output<string>;
    public readonly databasePassword!: pulumi.Output<string>;
    public readonly databaseHost!: pulumi.Output<string>;

    constructor(
        name: string,
        args: NeonProjectDataInputs,
        opts?: pulumi.CustomResourceOptions,
    ) {
        super(
            new NeonProjectDataProvider(),
            name,
            {
                projectId: args.projectId,
                apiKey: args.apiKey,
                defaultBranchId: undefined,
                databaseUser: undefined,
                databaseName: undefined,
                databasePassword: undefined,
                databaseHost: undefined,
            },
            opts,
        );
    }
}
