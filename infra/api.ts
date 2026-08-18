import { domain, IS_DEPLOYED_STAGE, Stage, Domain, dnsAdapter } from './dns';
import { Database } from './database';
import { bucket, optimisedBucket, bucketRegion, optimisedBucketRegion } from './storage';
import { cdn } from './cloudfront';
import { secret } from './secret';

const api = new sst.aws.Function('Api', {
    url: {
        cors: {
            allowCredentials: true,
        },
    },
    link: [
        Domain,
        Stage,
        Database,
        bucket,
        optimisedBucket,
        cdn,
        secret.GoogleClientId,
        secret.GoogleClientSecret,
        secret.StripeSecretKey,
        secret.StripeWebhookSecret,
        secret.StripeClientId,
        secret.StripePublishableKey,
        secret.EncryptionKey,
        secret.ExpoToken,
        secret.ExpoProjectId,
        secret.ExpoOwner,
        secret.BetterAuthSecret,
        secret.OpenRouterKey,
    ],
    handler: 'packages/backend/src/api/api.handler',
    timeout: '2 minutes',
    permissions: [
        {
            actions: ['*'],
            resources: ['*'],
        },
    ],
    environment: {
        ENCRYPTION_KEY: secret.EncryptionKey.value,
        NODE_ENV: $dev ? 'development' : 'production',
        BETTER_AUTH_SECRET: secret.BetterAuthSecret.value,
        OPENROUTER_API_KEY: secret.OpenRouterKey.value,
        // Pin S3Client region to each bucket's actual region so presigned
        // URLs are signed against the correct regional endpoint. Without
        // this, the SDK uses the Lambda's AWS_REGION (eu-west-2) which
        // mismatches buckets created in us-east-1 → CORS-busting 301s.
        STORAGE_BUCKET_REGION: bucketRegion,
        OPTIMISED_STORAGE_BUCKET_REGION: optimisedBucketRegion,
    },
});

export const apiRouter = new sst.aws.Router('ApiRouter', {
    routes: {
        '/*': api.url,
    },
    domain: IS_DEPLOYED_STAGE
        ? {
              name: 'api.' + domain,
              dns: dnsAdapter,
          }
        : undefined,
});
