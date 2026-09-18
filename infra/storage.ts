import { IS_DEPLOYED_STAGE, web } from "./dns";

/**
 * Base S3 bucket where all uploaded files are stored
 *
 * The explicit `cors` block is what allows the browser to PUT avatar
 * images directly to S3 via a presigned URL. Without it, S3 returns no
 * `Access-Control-Allow-Origin` header and the browser blocks the cross-
 * origin fetch from the web app (e.g. `http://localhost:3000` /
 * `https://structa.so`). The actual auth gate is the presigned URL
 * signature, so CORS here is primarily a browser-safety requirement.
 *
 * `web` is the deployed web origin for the current stage:
 *   - `production`  → `https://structa.so`
 *   - `dev`         → `https://dev.structa.so`
 *   - personal dev  → `http://localhost:3000` (under `sst dev`) or
 *                     `https://<stage>.dev.structa.so` (under `sst deploy`)
 *
 * `http://localhost:3000` is listed explicitly in addition to `web` so
 * the bucket stays usable for local development even when `sst deploy`
 * is used to repush a personal stage's infra.
 */
export const bucket = new sst.aws.Bucket("Storage", {
    access: !IS_DEPLOYED_STAGE ? "public" : "cloudfront",
    cors: {
        allowOrigins: [
            web,
            "http://localhost:3000",
            "https://localhost:3010",
            "https://structa.so",
            "https://dev.structa.so",
        ],
        allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
        allowHeaders: ["*"],
        exposeHeaders: ["ETag"],
        maxAge: "1 hour",
    },
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
export const optimisedBucket = new sst.aws.Bucket("OptimisedStorage");

/**
 * Bucket regions, exposed as Pulumi Outputs so Lambdas / TanStack Start
 * server functions can pin their `S3Client`` region to the actual bucket
 * region instead of relying on the AWS SDK default resolution chain
 * (which can mismatch when a bucket was provisioned in a different
 * region than the Lambda's `AWS_REGION`).
 *
 * The avatar upload flow in particular requires the presigner to
 * use the same region as the bucket — otherwise presigned URLs are
 * signed against the wrong region and S3 returns a 301 redirect with
 * no `Access-Control-Allow-Origin` header, breaking the browser PUT.
 */
export const bucketRegion = bucket.nodes.bucket.region;
export const optimisedBucketRegion = optimisedBucket.nodes.bucket.region;
