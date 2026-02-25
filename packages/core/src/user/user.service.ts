export * as UserService from "./user.service";

import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { user } from "../auth/auth.sql";
import { db } from "../drizzle";
import { zod } from "../utils/zod";
import { UserModel } from "./user.model";

export const initialise = async () => {
	await db.select().from(user).limit(1).execute();
	return;
};

export const fromID = zod(UserModel.Schema.shape.id, async (id) => {
	const result = await db
		.select()
		.from(user)
		.where(eq(user.id, id))
		.execute();
	return UserModel.User.parse(result[0]);
});

export const fromEmail = zod(UserModel.User.shape.email, async (email) => {
	const result = await db
		.select({
			id: user.id,
			workspaceId: user.workspaceId,
			email: user.email,
		})
		.from(user)
		.where(eq(user.email, email))
		.execute();

	// This will return when a user is first created
	if (!result[0]) {
		return null;
	}

	return UserModel.Subject.parse(result[0]);
});

export const avatarKeyFromId = zod(UserModel.User.shape.id, async (id) => {
	const result = await db
		.select()
		.from(user)
		.where(eq(user.id, id))
		.execute();
	const avatarUrl = result[0]?.image ?? null;
	if (!avatarUrl) {
		return null;
	}
	return avatarUrl.split("/").pop();
});

export const updateNameFromId = zod(
	UserModel.User.pick({ id: true, name: true }),
	async (input) => {
		const result = await db
			.update(user)
			.set({
				name: input.name,
				updatedAt: new Date(),
			})
			.where(eq(user.id, input.id))
			.returning()
			.execute();
		return UserModel.User.parse(result[0]);
	},
);

export const updateProfileFromOnboarding = zod(
	UserModel.User.pick({
		id: true,
		name: true,
		workspaceId: true,
		workspaceName: true,
		product: true,
		plan: true,
	}).partial({
		workspaceId: true,
	}),
	async (input) => {
		// Generate a new workspaceId if not provided (user is creating new workspace)
		// If workspaceId is provided, user is joining existing workspace via invitation
		const workspaceId = input.workspaceId ?? createId();

		const result = await db
			.update(user)
			.set({
				name: input.name,
				workspaceId: workspaceId,
				workspaceName: input.workspaceName,
				product: input.product,
				plan: input.plan,
				updatedAt: new Date(),
			})
			.where(eq(user.id, input.id))
			.returning()
			.execute();
		return UserModel.User.parse(result[0]);
	},
);

export const updateProfileNamesFromId = zod(
	UserModel.User.pick({ id: true, name: true, workspaceName: true }),
	async (input) => {
		const result = await db
			.update(user)
			.set({
				name: input.name,
				workspaceName: input.workspaceName,
				updatedAt: new Date(),
			})
			.where(eq(user.id, input.id))
			.returning()
			.execute();
		return UserModel.User.parse(result[0]);
	},
);

export const updateProfileNamesAndAvatarFromId = zod(
	UserModel.User.pick({
		id: true,
		name: true,
		workspaceName: true,
		image: true,
	}),
	async (input) => {
		const result = await db
			.update(user)
			.set({
				name: input.name,
				workspaceName: input.workspaceName,
				image: input.image,
				updatedAt: new Date(),
			})
			.where(eq(user.id, input.id))
			.returning()
			.execute();
		return UserModel.User.parse(result[0]);
	},
);
