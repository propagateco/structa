import { secret } from './secret';

export const SyncEngine = new sst.Linkable('SyncEngine', {
    properties: {
        source: secret.ElectricSqlSource.value,
        secret: secret.ElectricSqlSecret.value,
    },
});
