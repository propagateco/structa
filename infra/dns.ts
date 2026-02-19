export const PROJECT_NAME = 'structa';
export const PRODUCTION = 'structa.so';
export const DEV = 'dev.structa.so';

export const CLOUDFLARE_ZONE_ID = '8c02b0cdd9948b18881293ed39cc3d36';

export const IS_DEPLOYED_STAGE =
    $app.stage === 'production' || $app.stage === 'dev';

export const RESOURCE_ENVIRONMENT = IS_DEPLOYED_STAGE ? $app.stage : 'dev';

export const BRANCH_NAME = IS_DEPLOYED_STAGE ? $app.stage : `${$app.stage}-dev`;

export const NODE_TLS_REJECT_UNAUTHORIZED = new sst.Secret(
    'NODE_TLS_REJECT_UNAUTHORIZED',
    IS_DEPLOYED_STAGE || process.platform === 'linux' ? '1' : '0'
);

export const { domain, web } = (() => {
    if ($app.stage === 'production')
        return {
            domain: PRODUCTION,
            web: 'https://' + PRODUCTION,
        };

    if ($app.stage === 'dev')
        return {
            domain: DEV,
            web: 'https://' + DEV,
        };

    // For personal stages:
    // - If $dev is true: running locally with sst dev → use localhost
    // - If $dev is false: deployed with sst deploy → use deployed URL
    const personalDomain = `${$app.stage}.${DEV}`;

    return {
        domain: personalDomain,
        web: $dev ? 'http://localhost:3000' : 'https://' + personalDomain,
    };
})();

export const Domain = new sst.Linkable('Domain', {
    properties: {
        web: web,
        api: 'https://api.' + domain,
    },
});

export const Stage = new sst.Linkable('Stage', {
    properties: {
        cookiePrefix: `${$app.name}-${$app.stage}-auth`,
    },
});

export const dnsAdapter = sst.cloudflare.dns({
    zone: CLOUDFLARE_ZONE_ID,
});
