export * as ImageInterfaces from "./image.interfaces";

/**
 * Image Processing Interfaces
 * --------------------------------------
 * Types for image processing operations with Sharp
 */

export type ImageFormat = "jpeg" | "gif" | "webp" | "png" | "avif";

export interface ImageOperations {
	width?: number;
	height?: number;
	format?: ImageFormat;
	quality?: number;
}

export interface ImageProcessingConfig {
	originalBucket: string;
	transformedBucket: string;
	cacheTTL: string;
	maxImageSize: number;
}
