export * as StorageController from "./storage.controller";

import { init } from "@paralleldrive/cuid2";
import { Resource } from "sst";

import type { UserModel } from "../user/user.model";
import { UserService } from "../user/user.service";
import { BASIC_IMAGE_TYPES, SHORT_HASH_LENGTH } from "../utils/constants";
import { convertMegabytesToBytes } from "../utils/conversion";
import type {
	Metadata,
	ObjectProperties,
	ObjectReference,
} from "./storage.interfaces";
import { StorageService } from "./storage.service";
import { buildObjectKey } from "./storage.utils";

export async function canEdit(
	appId: string,
	userId: UserModel.UserType["id"],
): Promise<boolean> {
	const user = await UserService.fromID(userId);
	return user.role === "admin" || user.workspaceId === appId;
}

export async function getUploadUrlAndKey(
	maxFileSize: number,
	allowedFileTypes: string[],
	object: ObjectProperties,
): Promise<{ url: string; key: string }> {
	// Validate the file type
	const validationResult = await StorageService.validateFile(
		object,
		maxFileSize,
		allowedFileTypes,
	);
	if (!validationResult.valid) {
		throw new Error(
			`File validation failed: ${validationResult.errorMessage} (${validationResult.errorType})`,
		);
	}

	const key = buildObjectKey(object.reference);
	console.log("Object key to store in db: ", key);
	const url = await StorageService.getUploadUrl(object);
	return { url, key };
}

export async function getUploadAvatarFromId(
	userId: UserModel.UserType["id"],
	size: number,
	contentType: string,
	checksum: string,
): Promise<{ url: string; key: string }> {
	const maxFileSize = convertMegabytesToBytes(1); // 1MB
	const allowedFileTypes = BASIC_IMAGE_TYPES;
	const createId = init({ length: SHORT_HASH_LENGTH });

	const metadata = {
		userId: userId,
	};
	const reference: ObjectReference = {
		baseDirectory: "users",
		relativeDirectory: `user-${userId}/images`,
		objectName: `image-${createId()}`,
	};
	const object: ObjectProperties = {
		reference,
		size,
		contentType,
		checksum,
		metadata,
	};

	const { url, key } = await getUploadUrlAndKey(
		maxFileSize,
		allowedFileTypes,
		object,
	);
	return { url, key };
}

export async function getUploadProductCoverUrlFromId(
	userId: UserModel.UserType["id"],
	appId: string,
	productId: string,
	size: number,
	contentType: string,
	checksum: string,
): Promise<{ url: string; key: string }> {
	const maxFileSize = convertMegabytesToBytes(5); // 5MB for product cover images
	const createId = init({ length: SHORT_HASH_LENGTH });
	const allowedFileTypes = BASIC_IMAGE_TYPES;

	const metadata: Metadata = {
		userId: userId,
		...(appId && { appId: appId }),
		productId: productId,
	};
	const reference: ObjectReference = {
		baseDirectory: "products",
		relativeDirectory: `product-${productId}/images`,
		objectName: `cover-${createId()}`,
	};
	const object: ObjectProperties = {
		reference,
		size,
		contentType,
		checksum,
		metadata,
	};

	const { url, key } = await getUploadUrlAndKey(
		maxFileSize,
		allowedFileTypes,
		object,
	);
	return { url, key };
}

export async function getUploadLogoUrlFromId(
	userId: UserModel.UserType["id"],
	appId: string,
	mode: "light" | "dark",
	size: number,
	contentType: string,
	checksum: string,
): Promise<{ url: string; key: string }> {
	const maxFileSize = convertMegabytesToBytes(5); // 5MB for logo images
	const createId = init({ length: SHORT_HASH_LENGTH });
	const allowedFileTypes = BASIC_IMAGE_TYPES;

	const metadata: Metadata = {
		userId: userId,
		...(appId && { appId: appId }),
	};
	const reference: ObjectReference = {
		baseDirectory: "apps",
		relativeDirectory: `app-${appId}/images`,
		objectName: `${mode}-large-logo-${createId()}`,
	};
	const object: ObjectProperties = {
		reference,
		size,
		contentType,
		checksum,
		metadata,
	};

	const { url, key } = await getUploadUrlAndKey(
		maxFileSize,
		allowedFileTypes,
		object,
	);
	return { url, key };
}

export async function getUploadIconUrlFromId(
	userId: UserModel.UserType["id"],
	appId: string,
	size: number,
	contentType: string,
	checksum: string,
): Promise<{ url: string; key: string }> {
	const maxFileSize = convertMegabytesToBytes(5); // 5MB for icon images
	const createId = init({ length: SHORT_HASH_LENGTH });
	const allowedFileTypes = BASIC_IMAGE_TYPES;

	const metadata: Metadata = {
		userId: userId,
		...(appId && { appId: appId }),
	};
	const reference: ObjectReference = {
		baseDirectory: "apps",
		relativeDirectory: `app-${appId}/images`,
		objectName: `icon-${createId()}`,
	};
	const object: ObjectProperties = {
		reference,
		size,
		contentType,
		checksum,
		metadata,
	};

	const { url, key } = await getUploadUrlAndKey(
		maxFileSize,
		allowedFileTypes,
		object,
	);
	return { url, key };
}

export async function deleteImagesFromKey(key: string): Promise<void> {
	console.log(
		`Starting deletion of image with key: ${key} and all its variants...`,
	);

	// Create an array of promises for all deletion operations
	const deletionPromises = [
		// Delete original image
		StorageService.deleteFile(Resource.Storage.name, key).catch(
			(error: unknown) => {
				console.warn(
					`Original image not found or couldn't be deleted: ${key}`,
					error,
				);
				return null;
			},
		),

		// Delete all transformed variants
		StorageService.deleteFolder(
			Resource.OptimisedStorage.name,
			`${key}/`,
		).catch((error: unknown) => {
			console.warn(
				`Some transformed image variants may not have been deleted: ${key}/`,
				error,
			);
			return null;
		}),
	];

	// Wait for all deletions to complete, whether successful or not
	await Promise.allSettled(deletionPromises);

	console.log(`Completed deletion process for image: ${key}`);
}
