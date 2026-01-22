export * as UserController from "./user.controller";

import { Resource } from "sst";
import { StorageController } from "../storage/storage.controller";
import { buildObjectKey } from "../storage/storage.utils";
import type { UserModel } from "./user.model";
import { UserService } from "./user.service";

export async function updateProfileFromSettings({
	id,
	name,
	workspaceName,
	avatarKey,
}: {
	id: UserModel.UserType["id"];
	name: UserModel.UserType["name"];
	workspaceName: UserModel.UserType["workspaceName"];
	avatarKey?: string;
}): Promise<UserModel.UserType> {
	console.log("Updating profile from settings...");
	if (!avatarKey) {
		const user = await UserService.updateProfileNamesFromId({
			id,
			name,
			workspaceName,
		});
		return user;
	}

	const oldAvatarKey = await UserService.avatarKeyFromId(id);
	const image = `${Resource.Cdn.url}/${avatarKey}`;

	const user = await UserService.updateProfileNamesAndAvatarFromId({
		id,
		name,
		workspaceName,
		image,
	});

	if (oldAvatarKey) {
		const key = buildObjectKey({
			baseDirectory: "users",
			relativeDirectory: `user-${id}/images`,
			objectName: oldAvatarKey,
		});
		await StorageController.deleteImagesFromKey(key);
	}

	return user;
}
