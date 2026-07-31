import {
    IS_DEPLOYED_STAGE,
    RESOURCE_ENVIRONMENT,
    BRANCH_NAME,
    PROJECT_NAME,
} from "./dns";
import { secret } from "./secret";

// Autoscaling
const autoscalingLimitMinCu = 0.25;
const autoscalingLimitMaxCu = 0.25;

// Create Neon provider with API key (used for Project/Branch/Endpoint resources)
const neonProvider = new neon.Provider("NeonProvider", {
    apiKey: secret.NeonApiKey.value,
});

// Compute the database connection URL based on the stage.
// For permanent stages (dev, production): create a full Neon project.
// For preview/personal stages: create a branch + endpoint in dev project.
const databaseUrl: $util.Output<string> = (() => {
    if (IS_DEPLOYED_STAGE) {
        const neonProject = new neon.Project(
            `NeonProject`,
            {
                name: `${PROJECT_NAME}-${RESOURCE_ENVIRONMENT}`,
                pgVersion: 17,
                regionId: "aws-eu-west-2",
                orgId: secret.NeonOrgId.value,
                historyRetentionSeconds: 21600,
                branch: {
                    name: BRANCH_NAME,
                    databaseName: `${PROJECT_NAME}-${RESOURCE_ENVIRONMENT}-db`,
                },
                defaultEndpointSettings: {
                    autoscalingLimitMinCu,
                    autoscalingLimitMaxCu,
                },
                enableLogicalReplication: "yes",
            },
            {
                provider: neonProvider,
            },
        );

        return neonProject.connectionUri;
    }

    // Preview/personal stage: create a branch + endpoint in the shared dev
    // Neon project, then rewrite the dev project's connection URI (stored in
    // the NeonConnectionUri secret) to point at this stage's endpoint host.
    //
    // Only the host has to be computed at deploy time — it comes from the real
    // neon.Endpoint resource, whose outputs resolve reliably when SST snapshots
    // linkable properties. The credentials come from a secret, which resolves
    // synchronously at program load. (Pulumi dynamic-resource outputs — like
    // the old NeonProjectData ones — serialize as "undefined" at that point,
    // so the URL built from them was never valid.)
    const branch = new neon.Branch(
        `NeonBranch-${$app.stage}`,
        {
            projectId: secret.NeonProjectId.value,
            name: `${$app.stage}`,
        },
        { provider: neonProvider },
    );

    const endpoint = new neon.Endpoint(
        `NeonEndpoint-${$app.stage}`,
        {
            projectId: secret.NeonProjectId.value,
            branchId: branch.id,
            regionId: "aws-eu-west-2",
            type: "read_write",
            autoscalingLimitMinCu,
            autoscalingLimitMaxCu,
            suspendTimeoutSeconds: 300,
        },
        { provider: neonProvider },
    );

    // The dev project's credentials are valid on every branch of the project;
    // only the compute endpoint differs per stage. Rewrite the secret's URI to
    // use the preview endpoint's host.
    return $util
        .all([secret.NeonConnectionUri.value, endpoint.host])
        .apply(([connectionUri, host]) => {
            const parsed = new URL(connectionUri);
            const port = parsed.port || "5432";
            return `postgresql://${parsed.username}:${encodeURIComponent(parsed.password)}@${host}:${port}${parsed.pathname}${parsed.search}`;
        });
})();

export const Database = new sst.Linkable("Database", {
    properties: {
        url: databaseUrl,
    },
});
