export * as StorageService from './storage.service';

import {
	ExpiryOptions,
	TimingMetrics,
	ObjectProperties,
	ValidationResult,
	StorageServiceError,
} from './storage.interfaces';
import {
	getExpiresInSeconds,
	buildObjectKey,
	assertFileNotEmpty,
	assertFileSize,
	assertFileType,
} from './storage.utils';

import { Resource } from 'sst';
import {
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	ListObjectsV2Command,
	S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({});

/**
 * Presigned URL Generation
 * --------------------------
 * Functions to generate presigned URLs for uploading and downloading objects from S3.
 */

export async function getUploadUrl(
	object: ObjectProperties,
	expiry?: ExpiryOptions
): Promise<string> {
	return getSignedUrl(
		s3,
		new PutObjectCommand({
			Bucket: Resource.Storage.name,
			Key: buildObjectKey(object.reference),
		}),
		{
			expiresIn: getExpiresInSeconds(expiry),
		}
	);
}

export async function getDownloadUrl(
	object: ObjectProperties,
	expiry?: ExpiryOptions
): Promise<string> {
	return getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: Resource.Storage.name,
			Key: buildObjectKey(object.reference),
		}),
		{
			expiresIn: getExpiresInSeconds(expiry),
		}
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
	metrics?: TimingMetrics
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

		await s3.send(putCommand);

		if (metrics) {
			metrics.upload = performance.now() - startTime;
		}
	} catch (error) {
		throw new StorageServiceError('Error uploading file', {
			statusCode: 500,
			errorCode: 'UPLOAD_FAILED',
			context: { bucket, key, contentType },
			cause: error,
		});
	}
}

export async function downloadFile(
	bucket: string,
	key: string,
	metrics: TimingMetrics
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
		const response = await s3.send(getCommand);

		const image = Buffer.from(await response.Body!.transformToByteArray());
		const contentType = response.ContentType || 'image/jpeg';

		metrics.download = performance.now() - startTime;

		return { image, contentType };
	} catch (error) {
		const isNoSuchKeyError = error instanceof Error && error.name === 'NoSuchKey';
		throw new StorageServiceError('Error downloading original image', {
			statusCode: isNoSuchKeyError ? 404 : 500,
			errorCode: 'DOWNLOAD_FAILED',
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
		await s3.send(deleteCommand);
	} catch (error) {
		console.error('Error deleting file from S3', { bucket, key, error });
		throw new StorageServiceError('Error deleting file', {
			statusCode: 500,
			errorCode: 'DELETE_FAILED',
			context: { bucket, key },
			cause: error,
		});
	}
}

export async function deleteFolder(bucket: string, prefix: string): Promise<void> {
	let continuationToken: string | undefined = undefined;
	let count = 0;
	try {
		do {
			// List the objects with the specified prefix and continuation token if more than 1000 objects
			const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
				Bucket: bucket,
				Prefix: prefix,
				ContinuationToken: continuationToken,
			});
			const list = await s3.send(listCommand);
			const keys = list.Contents?.map((obj) => ({ Key: obj.Key! })) ?? [];
			if (keys.length > 0) {
				const deleteCommand = new DeleteObjectsCommand({
					Bucket: bucket,
					Delete: { Objects: keys },
				});

				// Delete the objects in batches
				let deleted = await s3.send(deleteCommand);
				count += deleted.Deleted?.length || 0;
				if (deleted.Errors) {
					deleted.Errors.map((error) =>
						console.log(`${error.Key} could not be deleted - ${error.Code}`)
					);
				}
			}
			continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
		} while (continuationToken);
		console.log(`Deleted ${count} files with prefix: ${prefix}`);
	} catch (error) {
		console.error('Error deleting files with prefix from S3', {
			bucket,
			prefix,
			continuationToken,
			error,
		});
		throw new StorageServiceError('Error deleting files with prefix', {
			statusCode: 500,
			errorCode: 'DELETE_PREFIX_FAILED',
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
	allowedFileTypes: string[]
): Promise<ValidationResult> {
	try {
		assertFileNotEmpty(object.size!);
		assertFileSize(object.size!, maxFileSize);
		assertFileType(object.contentType, allowedFileTypes);
		return { valid: true };
	} catch (error) {
		if (error instanceof Error) {
			// Determine error type based on message or create custom error classes
			if (error.message.includes('empty')) {
				return { valid: false, errorType: 'EMPTY_FILE', errorMessage: error.message };
			} else if (error.message.includes('size')) {
				return { valid: false, errorType: 'FILE_TOO_LARGE', errorMessage: error.message };
			} else {
				return {
					valid: false,
					errorType: 'INVALID_FILE_TYPE',
					errorMessage: error.message,
				};
			}
		}
		return { valid: false, errorMessage: 'Unknown validation error' };
	}
}
