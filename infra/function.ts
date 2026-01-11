import * as fs from 'fs';
import * as path from 'path';

import { bucket, optimisedBucket } from './storage';
import { database } from './database';
import { createResourceName, getPathToFunction } from './utils';
import { NODE_TLS_REJECT_UNAUTHORIZED } from './dns';

const imageProcessorFunction = new sst.aws.Function('ImageProcessorFunction', {
	handler: 'packages/backend/src/functions/image-processor.handler',
	nodejs: { install: ['sharp'] },
	memory: '1024 MB',
	timeout: '30 seconds',
	url: true,
	link: [bucket, optimisedBucket, database],
	environment: {
		NODE_TLS_REJECT_UNAUTHORIZED: NODE_TLS_REJECT_UNAUTHORIZED.value,
	},
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
