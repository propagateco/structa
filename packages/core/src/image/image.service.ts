import sharp from "sharp";
import {
	StorageServiceError,
	type TimingMetrics,
} from "../storage/storage.interfaces";
import type { ImageOperations } from "./image.interfaces";

/**
 * Image Transformation
 * -------------------
 * Functions for image processing and transformation using Sharp
 */

export async function transformImage(
	image: Buffer,
	operations: ImageOperations,
	originalContentType: string,
	metrics: TimingMetrics,
): Promise<{ image: Buffer; contentType: string }> {
	const startTime = performance.now();
	try {
		// Initialize Sharp with support for animations and more lenient error handling
		let sharpInstance = sharp(image, {
			failOn: "none",
			animated: true,
		});

		// Get image metadata for orientation correction
		const metadata = await sharpInstance.metadata();

		let contentType = originalContentType;

		// Apply resize transformation if requested
		if (operations.width || operations.height) {
			sharpInstance = sharpInstance.resize({
				width: operations.width,
				height: operations.height,
				fit: "inside",
				withoutEnlargement: true,
			});
		}

		// Auto-rotate based on orientation metadata
		if (metadata.orientation) {
			sharpInstance = sharpInstance.rotate();
		}

		// Format conversion with quality settings for lossy formats
		if (operations.format) {
			const isLossy = ["jpeg", "webp", "avif"].includes(operations.format);

			if (isLossy && operations.quality) {
				sharpInstance = sharpInstance.toFormat(operations.format, {
					quality: operations.quality,
				});
			} else {
				sharpInstance = sharpInstance.toFormat(operations.format);
			}

			contentType = `image/${operations.format}`;
		}

		// Process the image
		const processedImage = await sharpInstance.toBuffer();
		metrics.transform = performance.now() - startTime;

		return {
			image: processedImage,
			contentType,
		};
	} catch (error) {
		throw new StorageServiceError("Error transforming image", {
			statusCode: 500,
			errorCode: "TRANSFORM_FAILED",
			context: { operations },
			cause: error,
		});
	}
}
