import { domain } from './dns';

// Simplified for testing - minimal TanStack Start deployment
export const app = new sst.aws.TanStackStart('Web', {
    path: 'packages/web',
    domain: {
        name: domain,
        redirects: ['www.' + domain],
    },
});
