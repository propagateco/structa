/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: 'structa',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            protect: ['production'].includes(input?.stage),
            home: 'aws',
            providers: {
                aws: {
                    profile:
                        input.stage === 'production'
                            ? 'structa-production'
                            : 'structa-dev',
                    region: 'eu-west-2',
                },
                neon: '0.9.0',
            },
        };
    },
    async run() {
        const dns = await import('./infra/dns');
        await import('./infra/api');
        const database = await import('./infra/database');
        await import('./infra/storage');
        const cloudfront = await import('./infra/cloudfront');
        await import('./infra/app');
        await import('./infra/email');
        return {
            Api: dns.Domain.properties.api,
            Platform: dns.Domain.properties.platform,
            DatabaseUrl: database.database.properties.url,
            CloudfrontUrl: cloudfront.imageDistribution.url,
        };
    },
});
