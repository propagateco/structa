import { Domain, domain } from './dns';
import { Stage } from './dns';
import { apiRouter } from './api';
import { database } from './database';
import { email } from './email';
import { bucket, optimisedBucket } from './storage';
import { cdn } from './cloudfront';
import { secret } from './secret';

export const app = new sst.aws.TanStackStart('Web', {
    path: 'packages/app',
    domain: {
        name: 'app.' + domain,
        redirects: ['www.app.' + domain],
    },
    link: [
        Stage,
        Domain,
        email,
        database,
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
        BETTER_AUTH_URL: Domain.properties.platform,
        VITE_BETTER_AUTH_URL: Domain.properties.platform,
        VITE_API_URL: apiRouter.url,
        VITE_PLATFORM_URL: Domain.properties.platform,
        PLATFORM_URL: Domain.properties.platform,
        VITE_COOKIE_PREFIX: Stage.properties.cookiePrefix,
        REACT_APP_STRIPE_PUBLISHABLE_KEY: secret.StripePublishableKey.value,
    },
});
