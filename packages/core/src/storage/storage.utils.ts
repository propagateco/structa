import { Metadata, ObjectDirectory, ObjectReference, ExpiryOptions } from './storage.interfaces';
import { Readable } from 'stream';

/**
 * Object Storage Utilities
 * --------------------------
 * Utility functions for managing object storage operations, including metadata handling and object key construction.
 * This includes functions for converting metadata to headers, building object keys, and validating directory structures.
 */

export function metadataToHeaders(metadata: Metadata, prefix: string): Record<string, string> {
	return Object.keys(metadata).reduce(
		(acc: Record<string, string>, suffix: string) => ({
			...acc,
			[`${prefix}${suffix}`.toLowerCase()]: metadata[suffix],
		}),
		{}
	);
}

export function buildObjectKey(object: ObjectReference): string {
	const relative = object.relativeDirectory ? `/${object.relativeDirectory}` : '';
	return `${object.baseDirectory}${relative}/${object.objectName}`;
}

export function buildObjectReference(objectKey: string, separator = '/'): ObjectReference {
	const parts = objectKey.split(separator).filter((key) => key);
	const lastIndex = parts.length - 1;

	const result: ObjectReference = {
		baseDirectory: parts[0],
		objectName: parts.length !== 1 ? parts[lastIndex] : '',
	};

	const relativeDirectory = parts.slice(1, lastIndex).join('/');
	if (relativeDirectory) result.relativeDirectory = relativeDirectory;

	return result;
}

export function buildObjectDirectoryKey(directory: ObjectDirectory): string {
	const { baseDirectory, relativeDirectory } = directory;
	return `${baseDirectory}${relativeDirectory ? `/${relativeDirectory}/` : '/'}`;
}

/**
 * File Handling Utilities
 * --------------------------
 * Utility functions for converting file streams to buffers, computing checksums and transferring.
 */

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
		const chunks = Array<Uint8Array>();
		stream.on('data', (data) =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			chunks.push(data instanceof Buffer ? data : Buffer.from(data))
		);
		stream.on('end', () => resolve(Buffer.concat(chunks)));
		stream.on('error', reject);
	});
}

export async function computeSHA256Checksum(file: File): Promise<string> {
	const buffer = await file.arrayBuffer();
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

export function dataURLtoFile(dataURL: string, filename: string): File {
	const arr = dataURL.split(',');
	const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
}

export function getFileMimeContentType(dataURL: string): string {
	const arr = dataURL.split(',');
	const mime = arr[0].match(/:(.*?);/)?.[1];
	if (!mime) {
		throw new Error('Invalid data URL: No MIME type found, defaulting to image/png.');
	}
	return mime;
}

/**
 * Storage Time Utilities
 * --------------------------
 *
 * Functions for handling expiration and transfer times in object storage operations.
 *
 * These utilities help calculate expiration periods, validate expiry options,
 * manage time formats for storage expiry settings and transfer times.
 * Additionally, they provide utilities for calculating transfer times based on file size and speed.
 */

export const defaultExpiresInSeconds = 60 * 60;

export function getExpiresInSeconds(options?: ExpiryOptions): number {
	if (options?.expiresInSeconds && options?.expiresOn) {
		throw new Error("Only one of 'expiresInSeconds' and 'expiresOn' can be specified.");
	}
	if (options?.expiresInSeconds) {
		return Math.floor(options.expiresInSeconds);
	}
	if (options?.expiresOn) {
		return Math.floor((options.expiresOn.getTime() - Date.now()) / 1000);
	}
	return defaultExpiresInSeconds; // expires in one hour by default
}

interface GetTransferTimeInSecondsOptions {
	maxTransferTime?: number;
	minTransferSpeedInKbps?: number;
	padding?: number;
}

export function getTransferTimeInSeconds(
	fileSize: number,
	{
		maxTransferTime = 3600,
		minTransferSpeedInKbps = 100,
		padding = 300,
	}: GetTransferTimeInSecondsOptions = {}
): number {
	const bytesPerSecond = minTransferSpeedInKbps * 125;
	const seconds = fileSize / bytesPerSecond + padding;
	return seconds > maxTransferTime ? maxTransferTime : seconds;
}

/**
 * Assertions
 * --------------------------
 * Utility functions for validating directory structures and ensuring compliance with storage requirements.
 */

export function assertRelativeDirectory(relativeDirectory: string | undefined): void {
	if (!relativeDirectory) return;

	const backslash = '\\';
	if (relativeDirectory.includes(backslash))
		throw new Error('Relative directory cannot contain backslashes.');

	const separator = '/';
	if (
		relativeDirectory[0] === separator ||
		relativeDirectory[relativeDirectory.length - 1] === separator
	)
		throw new Error(
			'Relative directory cannot contain slashes at the beginning or the end of the string.'
		);
}

export function assertFileNotEmpty(sizeInBytes: number): void {
	if (sizeInBytes === 0) {
		throw new Error('Provided file is an empty file, 0 bytes.');
	}
}

export function assertFileSize(sizeInBytes: number, maxBytes: number): void {
	if (sizeInBytes > maxBytes) {
		throw new Error(`File size exceeds the maximum limit of ${maxBytes} bytes.`);
	}
}

export function assertFileType(contentType: string, allowedTypes: string[]): void {
	if (!allowedTypes.includes(contentType)) {
		throw new Error(`File type ${contentType} is not allowed.`);
	}
}
