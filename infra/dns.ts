export const PRODUCTION = "structa.so";
export const DEV = "dev.structa.so";

export const IS_DEPLOYED_STAGE =
    $app.stage === "production" || $app.stage === "dev";

export const BRANCH_NAME =
    $app.stage === "production"
        ? "main"
        : $app.stage === "dev"
          ? "dev"
          : `${$app.stage}-dev`;

export const NODE_TLS_REJECT_UNAUTHORIZED = new sst.Secret(
    "NODE_TLS_REJECT_UNAUTHORIZED",
    IS_DEPLOYED_STAGE || process.platform === "linux" ? "1" : "0",
);

export const { domain, platform } = (() => {
    if ($app.stage === "production")
        return {
            domain: PRODUCTION,
            platform: "https://" + PRODUCTION,
        };

    if ($app.stage === "dev")
        return {
            domain: DEV,
            platform: "https://" + DEV,
        };

    return {
        domain: `${$app.stage}.${DEV}`,
        platform: "http://localhost:3000",
    };
})();

export const Domain = new sst.Linkable("Domain", {
    properties: {
        platform: platform,
        api: "https://api." + domain,
    },
});

export const Stage = new sst.Linkable("Stage", {
    properties: {
        cookiePrefix: `${$app.name}-${$app.stage}-auth`,
    },
});
