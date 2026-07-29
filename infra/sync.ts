import { IS_DEPLOYED_STAGE } from './dns';
import { secret } from './secret';
import { ElectricCloudSync } from './electric-cloud';
import { Database } from './database';

// SyncEngine properties. Assigned conditionally below.
let syncSource: $util.Output<string>;
let syncSecret: $util.Output<string>;

// For permanent stages (dev, production): use the existing manually
// provisioned Electric Cloud credentials stored as SST secrets.
//
// For preview (pr-*) and personal stages: provision an Electric Cloud
// environment + Postgres Sync service dynamically via the Electric Cloud
// API, connected to the preview Neon branch URL.
if (IS_DEPLOYED_STAGE) {
    syncSource = secret.ElectricSqlSource.value;
    syncSecret = secret.ElectricSqlSecret.value;
} else {
    // Provision an Electric Cloud environment and Postgres Sync service
    // for this preview stage, connected to its Neon branch.
    const sync = new ElectricCloudSync('ElectricCloudSync', {
        databaseUrl: Database.properties.url,
        apiToken: secret.ElectricCloudApiToken.value,
        projectId: secret.ElectricCloudProjectId.value,
        stage: $app.stage,
    });

    syncSource = sync.sourceId;
    syncSecret = sync.secret;
}

export const SyncEngine = new sst.Linkable('SyncEngine', {
    properties: {
        source: syncSource,
        secret: syncSecret,
    },
});
