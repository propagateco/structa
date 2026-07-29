import * as fs from 'fs';

import { bucket, optimisedBucket } from './storage';
import { Database } from './database';
import { createResourceName, getPathToFunction } from './utils';

const imageProcessorFunction = new sst.aws.Function('ImageProcessorFunction', {
    handler: 'packages/backend/src/functions/image-processor.handler',
    nodejs: { install: ['sharp'] },
    memory: '1024 MB',
    timeout: '30 seconds',
    url: true,
    // The image-processor itself doesn't read the database, but its bundle
    // transitively imports `@core/drizzle` (via `@core/storage` →
    // `storage.controller.ts` → `user.service.ts` → `drizzle.ts`).
    // `drizzle.ts:7` reads `Resource.Database.url` at module top level, so
    // the `Database` Linkable (declared in `infra/database.ts`) must be
    // linked here — otherwise SST's `Resource` proxy throws at cold start
    // with `Database is not linked in your sst.config.ts`.
    link: [bucket, optimisedBucket, Database],
});

const rewriteUrlPath = getPathToFunction('rewrite-url.js');
const rewriteUrlCode = fs.readFileSync(rewriteUrlPath, 'utf8');

const cloudfrontRewriteFunction = new aws.cloudfront.Function(
    createResourceName('RewriteFunction'),
    {
        name: createResourceName('RewriteFunction'),
        publish: true,
        runtime: 'cloudfront-js-2.0',
        code: rewriteUrlCode,
    }
);

export { imageProcessorFunction, cloudfrontRewriteFunction };
