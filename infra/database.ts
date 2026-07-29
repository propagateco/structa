import { IS_DEPLOYED_STAGE, RESOURCE_ENVIRONMENT, BRANCH_NAME, PROJECT_NAME } from "./dns";
import { secret } from "./secret";

// Autoscaling
const autoscalingLimitMinCu = 0.25;
const autoscalingLimitMaxCu = 0.25;

// Create Neon provider with API key
const neonProvider = new neon.Provider("NeonProvider", {
    apiKey: secret.NeonApiKey.value,
});

// For permanent stages (dev, production): create a full Neon project with
// its own branch, endpoint, and database. The neon.Project resource handles
// everything in one resource, and its connectionUri output provides the full
// connection string.
//
// For preview (pr-*) and personal stages: create a branch and endpoint inside
// the shared dev Neon project instead of provisioning a new project. The
// connection URI is built from the endpoint host and the dev project's default
// role and database credentials.
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

    export const Database = new sst.Linkable("Database", {
        properties: {
            url: neonProject.connectionUri,
        },
    });
} else {
    // Look up the shared dev Neon project by ID from secrets
    const devProject = neon.getProjectOutput(
        { id: secret.NeonProjectId.value },
        { provider: neonProvider },
    );

    // Create a branch based on the dev branch
    const branch = new neon.Branch(
        `NeonBranch-${$app.stage}`,
        {
            projectId: devProject.id,
            name: `${PROJECT_NAME}-${$app.stage}-branch`,
            parentId: devProject.defaultBranchId,
        },
        { provider: neonProvider },
    );

    // Create a read/write endpoint for the preview branch
    const endpoint = new neon.Endpoint(
        `NeonEndpoint-${$app.stage}`,
        {
            projectId: devProject.id,
            branchId: branch.id,
            regionId: "aws-eu-west-2",
            type: "read_write",
            autoscalingLimitMinCu,
            autoscalingLimitMaxCu,
            suspendTimeoutSeconds: 300,
        },
        { provider: neonProvider },
    );

    // Build the connection URI from the endpoint host and the dev project's
    // default role/database credentials. Neon branches inherit the default
    // role and database from the parent branch, so the credentials are the
    // same across all branches in the project.
    const connectionUri = $interpolate`postgresql://${devProject.databaseUser}:${devProject.databasePassword}@${endpoint.host}:5432/${devProject.databaseName}`;

    export const Database = new sst.Linkable("Database", {
        properties: {
            url: connectionUri,
        },
    });
}
