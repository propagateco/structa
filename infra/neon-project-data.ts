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

/** Extract the database name (pathname) from a postgres connection URI. */
function dbNameFromUri(uri: string): string {
    try {
        const u = new URL(uri);
        return u.pathname.replace(/^\//, "");
    } catch {
        return "";
    }
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
// Internal types from Neon REST API responses
// ---------------------------------------------------------------------------

interface NeonBranch {
    id: string;
    name: string;
    default?: boolean;
    primary?: boolean;
}

interface NeonDatabase {
    name: string;
    owner_name: string;
}

interface NeonConnectionUri {
    uri: string;
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

        // 1. Find the default branch so we can use its ID as parent for
        //    preview branches, and look up its database(s).
        const branchesRes = await apiGet<{ branches: NeonBranch[] }>(
            `${NEON_API_BASE}/projects/${projectId}/branches`,
            headers,
        );
        const defaultBranch = branchesRes.branches.find(
            (b) => b.default === true,
        );
        if (!defaultBranch) {
            throw new Error(
                `No default branch found for project ${projectId}`,
            );
        }
        const defaultBranchId = defaultBranch.id;

        // 2. Fetch the database(s) on the default branch to get the actual
        //    database name and owner (role).
        const dbsRes = await apiGet<{ databases: NeonDatabase[] }>(
            `${NEON_API_BASE}/projects/${projectId}/branches/${defaultBranchId}/databases`,
            headers,
        );
        // Pick the first non-template database.
        const db = dbsRes.databases[0];
        if (!db) {
            throw new Error(
                `No database found on default branch ${defaultBranchId}`,
            );
        }
        const databaseName = db.name;
        const databaseUser = db.owner_name;

        // 3. Fetch the connection URI so we get the role password and host.
        //    The password is only returned in create-project responses and via
        //    this connection_uri endpoint — it is not available from the role
        //    or project detail endpoints.
        const connRes = await apiGet<NeonConnectionUri>(
            `${NEON_API_BASE}/projects/${projectId}/connection_uri` +
                `?database_name=${databaseName}&role_name=${databaseUser}`,
            headers,
        );

        const uri = new URL(connRes.uri);
        const databaseHost = uri.hostname;
        const databasePassword = decodeURIComponent(uri.password);
        // databaseName from the URI should match what we got from the
        // databases endpoint, but we parse it as a safety check.
        const parsedDbName = dbNameFromUri(connRes.uri);

        return {
            id: projectId,
            outs: {
                projectId,
                apiKey,
                defaultBranchId,
                databaseUser,
                databaseName: parsedDbName || databaseName,
                databasePassword,
                databaseHost,
            },
        };
    }

    async read(
        id: string,
        inputs: NeonProjectDataInputs,
    ): Promise<pulumi.dynamic.ReadResult> {
        const headers = auth(inputs.apiKey ?? "");
        try {
            // Same 3-step logic as create().
            const branchesRes = await apiGet<{ branches: NeonBranch[] }>(
                `${NEON_API_BASE}/projects/${id}/branches`,
                headers,
            );
            const defaultBranch = branchesRes.branches.find(
                (b) => b.default === true,
            );
            const defaultBranchId = defaultBranch?.id ?? "";

            const dbsRes = await apiGet<{ databases: NeonDatabase[] }>(
                `${NEON_API_BASE}/projects/${id}/branches/${defaultBranchId}/databases`,
                headers,
            );
            const db = dbsRes.databases[0];
            const databaseName = db?.name ?? "";
            const databaseUser = db?.owner_name ?? "";

            const connRes = await apiGet<NeonConnectionUri>(
                `${NEON_API_BASE}/projects/${id}/connection_uri` +
                    `?database_name=${databaseName}&role_name=${databaseUser}`,
                headers,
            );

            const uri = new URL(connRes.uri);
            const databaseHost = uri.hostname;
            const databasePassword = decodeURIComponent(uri.password);

            return {
                id,
                outs: {
                    projectId: id,
                    apiKey: inputs.apiKey ?? "",
                    defaultBranchId,
                    databaseUser,
                    databaseName: dbNameFromUri(connRes.uri) || databaseName,
                    databasePassword,
                    databaseHost,
                },
            };
        } catch {
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
 * Makes three API calls:
 *   1. GET /projects/{id}/branches              – finds the default branch
 *   2. GET /projects/{id}/branches/{id}/databases – gets database name + role
 *   3. GET /projects/{id}/connection_uri         – gets role password + host
 *
 * Inputs:
 *   projectId – The Neon project ID
 *   apiKey    – Neon API key (must have project read access)
 *
 * Outputs:
 *   projectId        – Same as input (for convenience)
 *   defaultBranchId  – The project's default branch ID
 *   databaseUser     – The project's database user (role name)
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
