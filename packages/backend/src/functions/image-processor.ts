import { ImageService } from "@core/image";
import type {
	ImageFormat,
	ImageOperations,
	ImageProcessingConfig,
} from "@core/image/image.interfaces";
import { StorageService } from "@core/storage";
import {
	StorageServiceError,
	type TimingMetrics,
} from "@core/storage/storage.interfaces";
import { CACHE_TTL, MAX_IMAGE_SIZE_LAMBDA } from "@core/utils/constants";
import {
	convertBytesToKilobytes,
	convertBytesToMegabytes,
} from "@core/utils/conversion";
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyResultV2,
} from "aws-lambda";
import { Resource } from "sst";

// Constants
const config: ImageProcessingConfig = {
	originalBucket: Resource.Storage.name,
	transformedBucket: Resource.OptimisedStorage.name,
	cacheTTL: CACHE_TTL, // 1 year
	maxImageSize: MAX_IMAGE_SIZE_LAMBDA, // 6MB
};

// Helper functions
const parseImagePath = (
	path: string,
): { originalPath: string; operations: ImageOperations } => {
	const pathArray = path.split("/");
	const operationsString = pathArray.pop() || "";
	pathArray.shift();

	const operations = Object.fromEntries(
		operationsString.split(",").map((op) => op.split("=")),
	);

	return {
		originalPath: pathArray.join("/"),
		operations: {
			width: operations.width ? parseInt(operations.width) : undefined,
			height: operations.height ? parseInt(operations.height) : undefined,
			format: operations.format as ImageFormat | undefined,
			quality: operations.quality ? parseInt(operations.quality) : undefined,
		},
	};
};

const formatTimingHeader = (metrics: TimingMetrics): string => {
	const timings = [
		`img-download;dur=${Math.round(metrics.download)}`,
		`img-transform;dur=${Math.round(metrics.transform)}`,
	];

	if (metrics.upload !== undefined) {
		timings.push(`img-upload;dur=${Math.round(metrics.upload)}`);
	}

	return timings.join(",");
};

/**
 * Creates an API Gateway proxy response for a 302 redirect to a large processed image.
 *
 * This function constructs a response that redirects the client to the URL of an image too large
 * to be be returned directly.
 *
 * @param path - The path to the original image
 * @param operations - A comma-separated string of image transformations (format: "width=100,height=200")
 * @param timingHeader - The timing information for server performance metrics
 * @returns An API Gateway proxy result that redirects the client with:
 *   - 302 status code (temporary redirect)
 *   - Location header pointing to the transformed image URL
 *   - Cache-Control header to prevent caching of the redirect
 *   - Server-Timing header for performance monitoring
 */
const createRedirectResponse = (
	path: string,
	operations: string,
	timingHeader: string,
): APIGatewayProxyResultV2 => ({
	statusCode: 302,
	headers: {
		Location: `/${path}?${operations.replace(/,/g, "&")}`,
		"Cache-Control": "private,no-store",
		"Server-Timing": timingHeader,
	},
});

/**
 * Creates an API Gateway proxy response for a successful image processing operation for a normal sized image.
 *
 * @param image - The processed image buffer to be returned to the client
 * @param contentType - The MIME type of the image (e.g., 'image/jpeg', 'image/webp')
 * @param timingHeader - A string containing timing information for performance monitoring
 * @returns An API Gateway proxy result object with:
 *   - 200 status code
 *   - The image encoded in base64
 *   - Headers including content type, cache control settings from config, and server timing metrics
 *   - Base64 encoding flag set to true
 */
const createSuccessResponse = (
	image: Buffer,
	contentType: string,
	timingHeader: string,
): APIGatewayProxyResultV2 => ({
	statusCode: 200,
	body: image.toString("base64"),
	isBase64Encoded: true,
	headers: {
		"Content-Type": contentType,
		"Cache-Control": config.cacheTTL,
		"Server-Timing": timingHeader,
	},
});

/**
 * Creates an API Gateway response for error situations.
 *
 * @param statusCode - The HTTP status code to include in the response
 * @param message - The error message to include in the response body
 * @param error - Optional error object for additional logging (not included in the response)
 * @returns An APIGatewayProxyResultV2 object with the error message and appropriate headers
 *
 * @example
 * return createErrorResponse(400, "Invalid input parameter", error);
 */
const createErrorResponse = (
	statusCode: number,
	message: string,
	error?: unknown,
): APIGatewayProxyResultV2 => {
	console.error("Application Error:", message, error);
	return {
		statusCode,
		body: JSON.stringify({ error: message }),
		headers: {
			"Content-Type": "application/json",
		},
	};
};

// Main handler
const handler = async (
	event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
	// Validate request method
	if (event.requestContext?.http?.method !== "GET") {
		return createErrorResponse(400, "Only GET method is supported");
	}

	const { originalPath, operations } = parseImagePath(
		event.requestContext.http.path,
	);

	const metrics: TimingMetrics = {
		download: 0,
		transform: 0,
	};

	// Download original image
	let originalImage: Buffer;
	let contentType: string;

	try {
		({ image: originalImage, contentType } = await StorageService.downloadFile(
			config.originalBucket,
			originalPath,
			metrics,
		));
	} catch (error) {
		if (error instanceof StorageServiceError) {
			return createErrorResponse(error.statusCode, error.message, error);
		}
		return createErrorResponse(500, "Error downloading original image", error);
	}

	// Transform image
	let transformedImage: Buffer;

	try {
		const result = await ImageService.transformImage(
			originalImage,
			operations,
			contentType,
			metrics,
		);
		transformedImage = result.image;
		contentType = result.contentType;
	} catch (error) {
		if (error instanceof StorageServiceError) {
			return createErrorResponse(error.statusCode, error.message, error);
		}
		return createErrorResponse(500, "Error transforming image", error);
	}

	// Upload the transformed image to S3
	const imageTooLarge = transformedImage.byteLength > config.maxImageSize;
	const transformedKey = `${originalPath}/${Object.entries(operations)
		.map(([k, v]) => `${k}=${v}`)
		.join(",")}`;

	console.log("Transformed key:", transformedKey);
	console.log(
		"Transformed image size:",
		`${convertBytesToKilobytes(transformedImage.byteLength).toFixed(2)} KB`,
	);

	// For images that are too large, upload and redirect or return error
	if (imageTooLarge) {
		try {
			await StorageService.uploadFile(
				config.transformedBucket,
				transformedKey,
				transformedImage,
				contentType,
				config.cacheTTL,
				metrics,
			);

			return createRedirectResponse(
				originalPath,
				Object.entries(operations)
					.map(([k, v]) => `${k}=${v}`)
					.join(","),
				formatTimingHeader(metrics),
			);
		} catch (error) {
			console.error("Could not upload transformed image to S3:", error);
			if (error instanceof StorageServiceError) {
				return createErrorResponse(error.statusCode, error.message, error);
			}
			return createErrorResponse(403, "Requested transformed image is too big");
		}
	}

	// For normal-sized images, upload to cache and return the image
	try {
		await StorageService.uploadFile(
			config.transformedBucket,
			transformedKey,
			transformedImage,
			contentType,
			config.cacheTTL,
			metrics,
		);
	} catch (error) {
		// Continue and return the image directly even if caching fails
		console.error("Could not upload transformed image to S3:", error);
		if (error instanceof StorageServiceError) {
			console.error(
				`Error code: ${error.errorCode}, Status: ${error.statusCode}`,
				error.context,
			);
		}
	}
	return createSuccessResponse(
		transformedImage,
		contentType,
		formatTimingHeader(metrics),
	);
};

export { handler };
