export * as StorageInterfaces from './storage.interfaces';

/**
 * Object Storage Interfaces
 * --------------------------
 * Interfaces for defining object storage operations, including metadata,
 * object references, and transfer configurations.
 */

export interface Metadata {
	[key: string]: string;
}

export interface BaseDirectory {
	/** First directory of a prefix for S3. */
	baseDirectory: string;
}

export interface ObjectDirectory extends BaseDirectory {
	/** Additional directories in the path to object. */
	relativeDirectory?: string;
}

export interface ObjectReference extends ObjectDirectory {
	objectName: string;
}

export interface ContentHeaders {
	contentType: string;
	checksum: string;
	contentEncoding?: string;
	cacheControl?: string;
}

export type ObjectProperties = ContentHeaders & {
	reference: ObjectReference;
	size?: number;
	lastModified?: Date;
	metadata?: Metadata;
};

/**
 * Data Transfer Interfaces
 * --------------------------------------
 *
 * These interfaces and types are used for transferring data to and from storage.
 * They define the structure of the data being transferred, including metadata,
 * headers, and object references.
 */

export type ExpiryOptions =
	| {
			expiresInSeconds?: never;
			expiresOn?: Date;
	  }
	| {
			expiresOn?: never;
			expiresInSeconds?: number;
	  };

export type TimingMetrics = {
	download: number;
	transform: number;
	upload?: number;
};

/**
 * Error Handling Interfaces
 * --------------------------------------
 * Types used for structured error handling in storage operations
 */

export interface ValidationResult {
	valid: boolean;
	errorType?: 'EMPTY_FILE' | 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE';
	errorMessage?: string;
}

export interface StorageError extends Error {
	statusCode: number;
	errorCode: string;
	context?: Record<string, unknown>;
	cause?: unknown;
}

export class StorageServiceError extends Error implements StorageError {
	statusCode: number;
	errorCode: string;
	context?: Record<string, unknown>;
	cause?: unknown;

	constructor(
		message: string,
		options: {
			statusCode: number;
			errorCode: string;
			context?: Record<string, unknown>;
			cause?: unknown;
		}
	) {
		super(message);
		this.name = 'StorageServiceError';
		this.statusCode = options.statusCode;
		this.errorCode = options.errorCode;
		this.context = options.context;
		this.cause = options.cause;
	}
}
