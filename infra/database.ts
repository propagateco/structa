import { RESOURCE_ENVIRONMENT, BRANCH_NAME, PROJECT_NAME } from './dns';
import { secret } from './secret';

// Autoscaling
const autoscalingLimitMinCu = $app.stage === 'production' ? 1 : 0.25;
const autoscalingLimitMaxCu = $app.stage === 'production' ? 2 : 0.25;

// Create Neon provider with API key
const neonProvider = new neon.Provider('NeonProvider', {
    apiKey: secret.NeonApiKey.value,
});

const neonProject = new neon.Project(
    `NeonProject`,
    {
        name: `${PROJECT_NAME}-${RESOURCE_ENVIRONMENT}`,
        pgVersion: 17,
        regionId: 'aws-eu-west-2',
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
    },
    {
        provider: neonProvider,
    }
);

export const database = new sst.Linkable(`Database`, {
    properties: {
        url: neonProject.connectionUri,
    },
});
