/// <reference path="./.sst/platform/config.d.ts" />
// In CI (GitHub Actions), OIDC provides credentials directly via
// configure-aws-credentials — no local profile. Outside CI, pick the
// correct named profile for the target account.
const isCI = process.env.GITHUB_ACTIONS === 'true';
export default $config({
    app(input) {
        return {
            name: 'structa',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            protect: ['production'].includes(input?.stage),
            home: 'aws',
            providers: {
                aws: {
                    ...(isCI
                        ? {}
                        : {
                              profile:
                                  input.stage === 'production'
                                      ? 'structa-production'
                                      : 'structa-dev',
                          }),
                    region: 'eu-west-2',
                },
                neon: '0.13.0',
                cloudflare: '6.15.0',
            },
        };
    },
    async run() {
        await import('./infra/github');
        const web = await import('./infra/web');
        const api = await import('./infra/api');
        await import('./infra/database');
        await import('./infra/sync');
        await import('./infra/storage');
        const cloudfront = await import('./infra/cloudfront');
        await import('./infra/email');
        await import('./infra/sns');
        return {
            Api: api.apiRouter.url,
            Web: web.app.url,
            CloudfrontUrl: cloudfront.imageDistribution.url,
        };
    },
});
