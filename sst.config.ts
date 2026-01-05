/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: "structa",
            removal: input?.stage === "production" ? "retain" : "remove",
            protect: ["production"].includes(input?.stage),
            home: "aws",
            providers: {
                aws: {
                    profile:
                        input.stage === "production"
                            ? "structa-production"
                            : "structa-dev",
                    region: "us-east-1",
                },
                neon: "0.9.0",
            },
        };
    },
    async run() {
        const storage = await import("./infra/storage");
        await import("./infra/api");

        return {
            MyBucket: storage.bucket.name,
        };
    },
});
