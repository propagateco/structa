export * as UserModel from "./user.model";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "../auth/auth.sql";
import { BASIC_IMAGE_TYPES } from "../utils/constants";
import { convertMegabytesToBytes } from "../utils/conversion";

export const MAX_USER_ASSET_SIZE = 1; // 1 MB
export const USER_IMAGE_FILE_TYPES = {
	"image/png": [],
	"image/jpg": [],
	"image/jpeg": [],
};

export const Schema = createSelectSchema(user);

export const User = createInsertSchema(user).omit({
	createdAt: true,
	updatedAt: true,
});
export const Subject = createSelectSchema(user).pick({
	id: true,
	workspaceId: true,
	email: true,
});
export const Onboarding = createInsertSchema(user).pick({
	name: true,
	workspaceName: true,
	product: true,
	plan: true,
});
export const Settings = createInsertSchema(user)
	.pick({
		name: true,
		workspaceName: true,
	})
	.extend({
		avatarKey: z.string().optional(),
	});

export const SettingsForm = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	workspaceName: z.string().min(1, { message: "Workspace name is required" }),
	// Image is optional
	image: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= convertMegabytesToBytes(MAX_USER_ASSET_SIZE);
		}, `File size must be less than ${MAX_USER_ASSET_SIZE} MB`)
		.refine((file) => {
			return !file || BASIC_IMAGE_TYPES.includes(file.type);
		}, "File must be a JPG or PNG"),
});

export type SchemaType = z.infer<typeof Schema>;
export type UserType = z.infer<typeof User>;
export type SubjectType = z.infer<typeof Subject>;
export type OnboardingType = z.infer<typeof Onboarding>;
export type SettingsType = z.infer<typeof Settings>;
export type SettingsFormType = z.infer<typeof SettingsForm>;
