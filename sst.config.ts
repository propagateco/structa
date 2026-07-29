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
// `cloudflare` providers are preloaded by SST v4; `neon` is an external
// provider pinned explicitly below.
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
                cloudflare: '6.15.0',
            },
        };
    },
    async run() {
        // NOTE: SST v4's Function component (function.ts:2756-2775) already creates
        // the required lambda.Permission for Function URLs internally — both the
        // InvokeFunctionUrl and InvokeFunction permissions with invokedViaFunctionUrl.
        // The old v3 $transform workaround is no longer needed and was removed because
        // it caused a 409 ResourceConflictException (concurrent update) — the transform
        // tried to AddPermission at the same time SST was creating the FunctionUrl.
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
