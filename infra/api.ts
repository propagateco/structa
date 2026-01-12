import { domain, Domain, NODE_TLS_REJECT_UNAUTHORIZED } from "./dns";
import { Stage } from "./dns";
import { database } from "./database";
import { bucket, optimisedBucket } from "./storage";
import { cdn } from "./cloudfront";
import { secret } from "./secret";
import { buildTask, buildQueue } from "./build-queue";

const api = new sst.aws.Function("Api", {
    url: {
        cors: {
            allowCredentials: true,
        },
    },
    link: [
        Domain,
        Stage,
        database,
        bucket,
        optimisedBucket,
        cdn,
        buildQueue,
        buildTask,
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
    handler: "packages/backend/src/api/api.handler",
    timeout: "2 minutes",
    permissions: [
        {
            actions: ["*"],
            resources: ["*"],
        },
    ],
    environment: {
        NODE_TLS_REJECT_UNAUTHORIZED: NODE_TLS_REJECT_UNAUTHORIZED.value,
        ENCRYPTION_KEY: secret.EncryptionKey.value,
        NODE_ENV: $dev ? "development" : "production",
        BETTER_AUTH_SECRET: secret.BetterAuthSecret.value,
    },
});

export const apiRouter = new sst.aws.Router("ApiRouter", {
    routes: {
        "/*": api.url,
    },
    domain: {
        name: "api." + domain,
        dns: sst.aws.dns({
            override: true,
        }),
    },
});
