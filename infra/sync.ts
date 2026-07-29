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
        databaseUrl: Database.properties.url,
        apiToken: secret.ElectricCloudApiToken.value,
        projectId: secret.ElectricCloudProjectId.value,
        stage: $app.stage,
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
