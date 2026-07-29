/// <reference path="./.sst/platform/config.d.ts" />
// NOTE: Production deployment fix (Jan 23, 2026):
// Resolved terraform-provider v0.8.1 403 error by running `sst add neon`
// to regenerate neon provider configuration. Issue was transient Pulumi registry
// availability problem affecting terraform-provider downloads.
// Check if running in CI (GitHub Actions) - OIDC provides credentials directly
//
// SST v3 → v4 Migration (Jul 29, 2026):
// Upgraded SST from ^3.17.38 to ^4.17.1. SST v4 ships with Pulumi AWS v7
// (@pulumi/aws@7.12.0), dropping the transitive aws-sdk v2 dep. The `aws` and
// `cloudflare` providers are preloaded by SST v4; `neon` and `aws-native` are
// external providers pinned explicitly below.
//
// One-time migration steps (performed separately):
//   1. Backup state: npx sst state export --stage <stage>
//   2. Run: npx sst refresh --stage <stage>
//   3. Review: npx sst diff --stage <stage>
//   4. Deploy: npx sst deploy --stage <stage>
// See: docs/workflow/DEPLOYMENT.md for full procedure.
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
                neon: '0.9.0',
                // aws-native (AWS Cloud Control API provider) — version bumped
                // alongside SST v4 upgrade. The awsnative.lambda.Permission
                // resource used in the $transform below is compatible with this
                // version.
                'aws-native': {
                    version: '1.73.1',
                    region: 'eu-west-2',
                },
                cloudflare: '6.15.0',
            },
        };
    },
    async run() {
        // Transform to add required lambda:InvokeFunction permission for Function URLs
        // See: https://github.com/anomalyco/sst/issues/6198
        // Reviewed during SST v3→v4 migration: the awsnative.lambda.Permission
        // shape (action, functionName, principal, invokedViaFunctionUrl) is
        // unchanged in aws-native@1.73.1 — no code changes needed.
        $transform(aws.lambda.FunctionUrl, (args, opts, name) => {
            new awsnative.lambda.Permission(`${name}InvokePermission`, {
                action: 'lambda:InvokeFunction',
                functionName: args.functionName,
                principal: '*',
                invokedViaFunctionUrl: true, // Restricts to Function URL invocations only (secure)
            });
        });
        const dns = await import('./infra/dns');
        await import('./infra/github');
        await import('./infra/web');
        await import('./infra/api');
        await import('./infra/database');
        await import('./infra/sync');
        await import('./infra/storage');
        const cloudfront = await import('./infra/cloudfront');
        await import('./infra/email');
        await import('./infra/sns');
        return {
            Api: dns.Domain.properties.api,
            Web: dns.Domain.properties.web,
            CloudfrontUrl: cloudfront.imageDistribution.url,
        };
    },
});
