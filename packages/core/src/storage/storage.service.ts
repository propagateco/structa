export * as StorageService from "./storage.service";

import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Resource } from "sst";
import {
	type ExpiryOptions,
	type ObjectProperties,
	StorageServiceError,
	type TimingMetrics,
	type ValidationResult,
} from "./storage.interfaces";
import {
	assertFileNotEmpty,
	assertFileSize,
	assertFileType,
	buildObjectKey,
	getExpiresInSeconds,
} from "./storage.utils";

/**
 * S3 clients per bucket region.
 *
 * Each bucket may reside in a different AWS region (the Storage bucket
 * is in us-east-1, OptimisedStorage in eu-west-2). Presigned URLs must
 * be signed with the bucket's own region, otherwise S3 returns a 301
 * redirect to the bucket's regional endpoint with no
 * `Access-Control-Allow-Origin` header — the browser then refuses to
 * follow it cross-origin, breaking client-side uploads.
 *
 * The bucket regions are injected at deploy time via the
 * `STORAGE_BUCKET_REGION` and `OPTIMISED_STORAGE_BUCKET_REGION`
 * environment variables (configured in `infra/api.ts` and
 * `infra/web.ts` from the Pulumi Output of each bucket's `region`).
 *
 * Pass `region: undefined` (env var unset, e.g. running unit tests
 * outside SST) to fall back to the AWS SDK default resolution chain.
 */
const storageS3 = new S3Client({
	region: process.env.STORAGE_BUCKET_REGION,
});

const optimisedS3 = new S3Client({
	region: process.env.OPTIMISED_STORAGE_BUCKET_REGION,
});

/**
 * Pick the S3 client whose region matches the bucket's own region.
 *
 * Presigned URL signing is regional — a signature issued with
 * `<region>/s3/aws4_request` only matches S3 requests hitting the
 * same regional endpoint. PUT-ing to `Resource.Storage` (us-east-1)
 * with a URL signed for eu-west-2 results in a 301 to the correct
 * regional endpoint, no `Access-Control-Allow-Origin` header, and a
 * CORS failure in the browser.
 *
 * Falls back to `storageS3` (which itself falls back to the AWS SDK
 * default region resolution if `STORAGE_BUCKET_REGION` is unset) for
 * buckets not recognised at call time.
 */
function getS3ClientForBucket(bucket: string): S3Client {
	if (bucket === Resource.OptimisedStorage.name) return optimisedS3;
	return storageS3;
}

/**
 * Presigned URL Generation
 * --------------------------
 * Functions to generate presigned URLs for uploading and downloading objects from S3.
 */

export async function getUploadUrl(
	object: ObjectProperties,
	expiry?: ExpiryOptions,
): Promise<string> {
	return getSignedUrl(
		storageS3,
		new PutObjectCommand({
			Bucket: Resource.Storage.name,
			Key: buildObjectKey(object.reference),
		}),
		{
			expiresIn: getExpiresInSeconds(expiry),
		},
	);
}

export async function getDownloadUrl(
	object: ObjectProperties,
	expiry?: ExpiryOptions,
): Promise<string> {
	return getSignedUrl(
		storageS3,
		new GetObjectCommand({
			Bucket: Resource.Storage.name,
			Key: buildObjectKey(object.reference),
		}),
		{
			expiresIn: getExpiresInSeconds(expiry),
		},
	);
}

/**
 * File Upload and Download
 * -------------
 * Function to upload a file to S3 using PutObjectCommand and download a file using GetObjectCommand.
 */

export async function uploadFile(
	bucket: string,
	key: string,
	data: Buffer,
	contentType: string,
	cacheControl?: string,
	metrics?: TimingMetrics,
): Promise<void> {
	const startTime = performance.now();
	try {
		const putCommand = new PutObjectCommand({
			Body: data,
			Bucket: bucket,
			Key: key,
			ContentType: contentType,
			CacheControl: cacheControl,
		});

		await getS3ClientForBucket(bucket).send(putCommand);

		if (metrics) {
			metrics.upload = performance.now() - startTime;
		}
	} catch (error) {
		throw new StorageServiceError("Error uploading file", {
			statusCode: 500,
			errorCode: "UPLOAD_FAILED",
			context: { bucket, key, contentType },
			cause: error,
		});
	}
}

export async function downloadFile(
	bucket: string,
	key: string,
	metrics: TimingMetrics,
): Promise<{
	image: Buffer;
	contentType: string;
}> {
	const startTime = performance.now();
	try {
		const getCommand = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		});
		const response = await getS3ClientForBucket(bucket).send(getCommand);

		const image = Buffer.from(await response.Body!.transformToByteArray());
		const contentType = response.ContentType || "image/jpeg";

		metrics.download = performance.now() - startTime;

		return { image, contentType };
	} catch (error) {
		const isNoSuchKeyError =
			error instanceof Error && error.name === "NoSuchKey";
		throw new StorageServiceError("Error downloading original image", {
			statusCode: isNoSuchKeyError ? 404 : 500,
			errorCode: "DOWNLOAD_FAILED",
			context: { bucket, key },
			cause: error,
		});
	}
}

/**
 * Delete Files
 * -----------------------------
 * Delete a file from S3 using DeleteObjectCommand and delete all files with a specific prefix using ListObjectsV2Command and DeleteObjectsCommand.
 *
 */

export async function deleteFile(bucket: string, key: string): Promise<void> {
	try {
		const deleteCommand = new DeleteObjectCommand({
			Bucket: bucket,
			Key: key,
		});
		await getS3ClientForBucket(bucket).send(deleteCommand);
	} catch (error) {
		console.error("Error deleting file from S3", { bucket, key, error });
		throw new StorageServiceError("Error deleting file", {
			statusCode: 500,
			errorCode: "DELETE_FAILED",
			context: { bucket, key },
			cause: error,
		});
	}
}

export async function deleteFolder(
	bucket: string,
	prefix: string,
): Promise<void> {
	let continuationToken: string | undefined;
	let count = 0;
	try {
		do {
			// List the objects with the specified prefix and continuation token if more than 1000 objects
			const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
				Bucket: bucket,
				Prefix: prefix,
				ContinuationToken: continuationToken,
			});
			const list = await getS3ClientForBucket(bucket).send(listCommand);
			const keys = list.Contents?.map((obj) => ({ Key: obj.Key! })) ?? [];
			if (keys.length > 0) {
				const deleteCommand = new DeleteObjectsCommand({
					Bucket: bucket,
					Delete: { Objects: keys },
				});

				// Delete the objects in batches
				const deleted = await getS3ClientForBucket(bucket).send(deleteCommand);
				count += deleted.Deleted?.length || 0;
				if (deleted.Errors) {
					deleted.Errors.map((error) =>
						console.log(`${error.Key} could not be deleted - ${error.Code}`),
					);
				}
			}
			continuationToken = list.IsTruncated
				? list.NextContinuationToken
				: undefined;
		} while (continuationToken);
		console.log(`Deleted ${count} files with prefix: ${prefix}`);
	} catch (error) {
		console.error("Error deleting files with prefix from S3", {
			bucket,
			prefix,
			continuationToken,
			error,
		});
		throw new StorageServiceError("Error deleting files with prefix", {
			statusCode: 500,
			errorCode: "DELETE_PREFIX_FAILED",
			context: { bucket, prefix },
			cause: error,
		});
	}
}

/**
 * File Validation
 * -----------------
 * Functions to verify the incoming file, including checksum validation and file size checks.
 */

export async function validateFile(
	object: ObjectProperties,
	maxFileSize: number,
	allowedFileTypes: string[],
): Promise<ValidationResult> {
	try {
		assertFileNotEmpty(object.size!);
		assertFileSize(object.size!, maxFileSize);
		assertFileType(object.contentType, allowedFileTypes);
		return { valid: true };
	} catch (error) {
		if (error instanceof Error) {
			// Determine error type based on message or create custom error classes
			if (error.message.includes("empty")) {
				return {
					valid: false,
					errorType: "EMPTY_FILE",
					errorMessage: error.message,
				};
			} else if (error.message.includes("size")) {
				return {
					valid: false,
					errorType: "FILE_TOO_LARGE",
					errorMessage: error.message,
				};
			} else {
				return {
					valid: false,
					errorType: "INVALID_FILE_TYPE",
					errorMessage: error.message,
				};
			}
		}
		return { valid: false, errorMessage: "Unknown validation error" };
	}
}
