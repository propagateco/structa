import { IS_DEPLOYED_STAGE } from './dns';
import { secret } from './secret';
import { ElectricCloudSync } from './electric-cloud';
import { Database } from './database';

// Compute the SyncEngine properties based on the stage.
// For permanent stages (dev, production): use existing static secrets.
// For preview/personal stages: provision dynamic Electric Cloud resources.
const { syncSource, syncSecret } = (() => {
    if (IS_DEPLOYED_STAGE) {
        return {
            syncSource: secret.ElectricSqlSource.value,
            syncSecret: secret.ElectricSqlSecret.value,
        };
    }

    const sync = new ElectricCloudSync('ElectricCloudSync', {
        // Pass the endpoint host (resolves correctly) and Neon credentials,
        // so the provider can construct a valid database URL by fetching
        // user / password / database name from the Neon API directly.
        // This bypasses dynamic-resource output timing issues (the URL
        // constructed from devProject outputs would contain "undefined").
        endpointHost: Database.properties.url.apply((url) => {
            try {
                return new URL(url).hostname;
            } catch {
                return "";
            }
        }),
        neonApiKey: secret.NeonApiKey.value,
        neonProjectId: secret.NeonProjectId.value,
        apiToken: secret.ElectricCloudApiToken.value,
        projectId: secret.ElectricCloudProjectId.value,
        stage: $app.stage,
    }, {
        dependsOn: [Database],
    });

    return {
        syncSource: sync.sourceId,
        syncSecret: sync.secret,
    };
})();

export const SyncEngine = new sst.Linkable('SyncEngine', {
    properties: {
        source: syncSource,
        secret: syncSecret,
    },
});
