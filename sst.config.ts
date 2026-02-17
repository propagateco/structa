/// <reference path="./.sst/platform/config.d.ts" />
// NOTE: Production deployment fix (Jan 23, 2026):
// Resolved terraform-provider v0.8.1 403 error by running `sst add neon`
// to regenerate neon provider configuration. Issue was transient Pulumi registry
// availability problem affecting terraform-provider downloads.

// Check if running in CI (GitHub Actions) - OIDC provides credentials directly
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
                    // Skip profile requirement in CI - OIDC provides credentials
                    ...(isCI ? {} : {
                        profile:
                            input.stage === 'production'
                                ? 'structa-production'
                                : 'structa-dev',
                    }),
                    region: 'eu-west-2',
                },
                neon: '0.9.0',
                'aws-native': {
                    version: '1.49.0',
                    region: 'eu-west-2',
                },
            },
        };
    },
    async run() {
        // Transform to add required lambda:InvokeFunction permission for Function URLs
        // See: https://github.com/anomalyco/sst/issues/6198
        $transform(aws.lambda.FunctionUrl, (args, opts, name) => {
            new awsnative.lambda.Permission(`${name}InvokePermission`, {
                action: 'lambda:InvokeFunction',
                functionName: args.functionName,
                principal: '*',
                invokedViaFunctionUrl: true, // Restricts to Function URL invocations only (secure)
            });
        });
        const dns = await import('./infra/dns');
        // GitHub Actions OIDC infrastructure (import early to debug)
        await import('./infra/github');
        await import('./infra/web');
        await import('./infra/api');
        await import('./infra/database');
        await import('./infra/storage');
        const cloudfront = await import('./infra/cloudfront');
        await import('./infra/email');
        return {
            Api: dns.Domain.properties.api,
            Platform: dns.Domain.properties.platform,
            CloudfrontUrl: cloudfront.imageDistribution.url,
        };
    },
});
