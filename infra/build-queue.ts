import { database } from "./database";
import { secret } from "./secret";

const vpc = new sst.aws.Vpc("BuildVpc", {
    bastion: true,
});

const cluster = new sst.aws.Cluster("BuildCluster", {
    vpc: vpc,
});

const buildTask = new sst.aws.Task("BuildTask", {
    cluster: cluster,
    image: {
        context: "./packages/",
        dockerfile: "expo-builder/Dockerfile",
    },
    memory: "1 GB",
    cpu: "0.5 vCPU",
    environment: {
        DATABASE_URL: database.properties.url,
        AWS_REGION: aws.getRegionOutput().name,
        EXPO_TOKEN: secret.ExpoToken.value,
        EXPO_OWNER: secret.ExpoOwner.value,
        EXPO_PROJECT_ID: secret.ExpoProjectId.value,
        HOST_PATH: process.env.PATH || "",
        HOST_HOME: process.env.HOME || "",
    },
    link: [database, secret.ExpoToken, secret.ExpoOwner, secret.ExpoProjectId],
    logging: {
        retention: "1 week",
    },
    dev: {
        command: "node expo-builder/local-index.mjs",
    },
});

const buildSubscriber = new sst.aws.Function("BuildSubscriber", {
    handler: "packages/backend/src/functions/build-subscriber.handler",
    link: [buildTask],
});

const deadLetterQueue = new sst.aws.Queue("BuildDeadLetterQueue");

const buildQueue = new sst.aws.Queue("BuildQueue", {
    dlq: deadLetterQueue.arn,
    visibilityTimeout: "1 hour",
});
buildQueue.subscribe({
    link: [buildTask],
    handler: "packages/backend/src/functions/build-subscriber.handler",
});

export { cluster, buildSubscriber, buildTask, buildQueue };
