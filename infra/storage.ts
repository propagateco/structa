import { IS_DEPLOYED_STAGE } from './dns';

/**
 * Base S3 bucket where all uploaded files are stored
 */
export const bucket = new sst.aws.Bucket('Storage', {
	access: !IS_DEPLOYED_STAGE ? 'public' : 'cloudfront',
});

/**
 * Optimised S3 bucket where optimised images are stored from the base bucket
 *
 * Image transformations through CloudFront URL parameters:
 *
 * - Resize by width:
 *   https://<distribution>.cloudfront.net/image.jpg?width=800
 *
 * - Resize by height:
 *   https://<distribution>.cloudfront.net/image.jpg?height=500
 *
 * - Convert format:
 *   https://<distribution>.cloudfront.net/image.jpg?format=webp
 *
 * - Adjust quality:
 *   https://<distribution>.cloudfront.net/image.jpg?quality=85
 *
 * - Combined transformations:
 *   https://<distribution>.cloudfront.net/image.jpg?width=800&format=webp&quality=75
 */
export const optimisedBucket = new sst.aws.Bucket('OptimisedStorage');
