import { Domain, domain, Stage, dnsAdapter } from './dns';
import { apiRouter } from './api';
import { Database } from './database';
import { authEmail, notifyEmail } from './email';
import { bucket, optimisedBucket, bucketRegion, optimisedBucketRegion } from './storage';
import { cdn } from './cloudfront';
import { secret } from './secret';
import { SyncEngine } from './sync';

export const app = new sst.aws.TanStackStart('Web', {
    path: 'packages/web',
    // SST Console autodeploy container caps the Node V8 heap at ~2GB by
    // default, which the Nitro/SSR bundle pass exceeds (framer-motion + the
    // TanStack Start router graph). Raise the old-space limit so the build
    // doesn't get SIGABRT'd mid-bundle. This only affects `npm run build`,
    // not the runtime Lambda. See logs from 22 Jul 2026 autodeploy failure:
    //   "FATAL ERROR: Reached heap limit Allocation failed - JavaScript
    //    heap out of memory" during the nitro env build.
    buildCommand: 'NODE_OPTIONS=--max-old-space-size=4096 npm run build',
    domain: {
        name: domain,
        redirects: ['www.' + domain],
        dns: dnsAdapter,
    },
    link: [
        Stage,
        Domain,
        Database,
        authEmail,
        notifyEmail,
        bucket,
        optimisedBucket,
        cdn,
        SyncEngine,
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
        secret.LoopsApiKey,
        // Used at runtime to resolve the Electric Cloud sync source id +
        // secret on preview stages (the ElectricCloudSync dynamic resource's
        // outputs cannot be baked into the SyncEngine link).
        secret.ElectricCloudApiToken,
        secret.ElectricCloudProjectId,
    ],
    environment: {
        BETTER_AUTH_URL: Domain.properties.web,
        PLATFORM_URL: Domain.properties.web,
        REACT_APP_STRIPE_PUBLISHABLE_KEY: secret.StripePublishableKey.value,
        VITE_PUBLIC_POSTHOG_KEY: secret.PosthogPublicKey.value,
        VITE_PUBLIC_POSTHOG_HOST: secret.PosthogHost.value,
        VITE_API_URL: apiRouter.url,
        VITE_PLATFORM_URL: Domain.properties.web,
        VITE_COOKIE_PREFIX: Stage.properties.cookiePrefix,
        // CloudFront distribution that fronts the image-processor Lambda
        // + OptimisedStorage bucket. Prepending this to bare S3 object
        // keys (e.g. `users/user-.../images/image-xxx`) yields a URL that
        // CloudFront rewrites via `rewrite-url.js` and processes on demand
        // — e.g. `?width=400&height=400&format=webp` returns a transformed
        // webp variant. Without this, the browser resolves the bare key
        // relative to the current page (e.g. `/settings/users/...`) and
        // gets a 404.
        VITE_CDN_URL: cdn.properties.url,
        // Pin S3Client region to each bucket's actual region so presigned
        // URLs are signed against the correct regional endpoint. Without
        // this, the SDK uses the Lambda's AWS_REGION (eu-west-2) which
        // mismatches buckets created in us-east-1 → CORS-busting 301s.
        STORAGE_BUCKET_REGION: bucketRegion,
        OPTIMISED_STORAGE_BUCKET_REGION: optimisedBucketRegion,
    },
});
