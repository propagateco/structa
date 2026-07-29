import { IS_DEPLOYED_STAGE, RESOURCE_ENVIRONMENT, BRANCH_NAME, PROJECT_NAME } from "./dns";
import { secret } from "./secret";
import { NeonProjectData } from "./neon-project-data";

// Autoscaling
const autoscalingLimitMinCu = 0.25;
const autoscalingLimitMaxCu = 0.25;

// Create Neon provider with API key (used for Project/Branch/Endpoint resources)
const neonProvider = new neon.Provider("NeonProvider", {
    apiKey: secret.NeonApiKey.value,
});

// Compute the database connection URL based on the stage.
// For permanent stages (dev, production): create a full Neon project.
// For preview/personal stages: create a branch + endpoint in the dev project.
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

    // Preview/personal stage: look up the shared dev Neon project directly via
    // the Neon REST API (avoids the opaque Pulumi Terraform-provider invoke
    // error that occurs for new stages with neon.getProjectOutput).
    const devProject = new NeonProjectData("NeonProjectData", {
        projectId: secret.NeonProjectId.value,
        apiKey: secret.NeonApiKey.value,
    });

    const branch = new neon.Branch(
        `NeonBranch-${$app.stage}`,
        {
            projectId: devProject.projectId,
            name: `${PROJECT_NAME}-${$app.stage}-branch`,
            parentId: devProject.defaultBranchId,
        },
        { provider: neonProvider },
    );

    const endpoint = new neon.Endpoint(
        `NeonEndpoint-${$app.stage}`,
        {
            projectId: devProject.projectId,
            branchId: branch.id,
            regionId: "aws-eu-west-2",
            type: "read_write",
            autoscalingLimitMinCu,
            autoscalingLimitMaxCu,
            suspendTimeoutSeconds: 300,
        },
        { provider: neonProvider },
    );

    return $interpolate`postgresql://${devProject.databaseUser}:${devProject.databasePassword}@${endpoint.host}:5432/${devProject.databaseName}`;
})();

export const Database = new sst.Linkable("Database", {
    properties: {
        url: databaseUrl,
    },
});
