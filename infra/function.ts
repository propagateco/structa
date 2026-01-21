import * as fs from 'fs';

import { bucket, optimisedBucket } from './storage';
import { database } from './database';
import { createResourceName, getPathToFunction } from './utils';

const imageProcessorFunction = new sst.aws.Function('ImageProcessorFunction', {
    handler: 'packages/backend/src/functions/image-processor.handler',
    nodejs: { install: ['sharp'] },
    memory: '1024 MB',
    timeout: '30 seconds',
    url: true,
    link: [bucket, optimisedBucket, database],
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
