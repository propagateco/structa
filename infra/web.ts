import { Domain, domain, Stage, dnsAdapter } from './dns';
import { apiRouter } from './api';
import { Database } from './database';
import { email } from './email';
import { bucket, optimisedBucket } from './storage';
import { cdn } from './cloudfront';
import { secret } from './secret';

export const app = new sst.aws.TanStackStart('Web', {
    path: 'packages/web',
    domain: {
        name: domain,
        redirects: ['www.' + domain],
        dns: dnsAdapter,
    },
    link: [
        Stage,
        Domain,
        Database,
        email,
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
    },
});
