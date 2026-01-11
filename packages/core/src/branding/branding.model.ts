export * as BrandingModel from "./branding.model";

import { createInsertSchema } from "drizzle-zod";
import { branding } from "./branding.sql";
import { AccentColour, GreyColour } from "../utils/colour";
import { BASIC_IMAGE_TYPES } from "../utils/constants";
import { convertMegabytesToBytes } from "../utils/conversion";
import { z } from "zod";

export const MAX_BRANDING_ASSET_SIZE = 5; // 5 MB
export const BRANDING_IMAGE_FILE_TYPES = {
  "image/png": [],
  "image/jpg": [],
  "image/jpeg": [],
};

export const Schema = createInsertSchema(branding, {
  appId: z.string(),
  icon: z.string().optional().nullable(),
  font: z.string(),
  lightLargeLogo: z.string().optional().nullable(),
  darkLargeLogo: z.string().optional().nullable(),
  lightAccent: z.string(),
  lightAccentHigh: z.string().optional(),
  lightAccentLow: z.string().optional(),
  lightForeground: z.string(),
  lightBackground: z.string(),
  lightGrey1: z.string(),
  lightGrey2: z.string(),
  lightGrey3: z.string(),
  lightGrey4: z.string(),
  lightGrey5: z.string(),
  lightGrey6: z.string(),
  lightGrey7: z.string(),
  darkAccent: z.string(),
  darkAccentHigh: z.string().optional(),
  darkAccentLow: z.string().optional(),
  darkForeground: z.string(),
  darkBackground: z.string(),
  darkGrey1: z.string(),
  darkGrey2: z.string(),
  darkGrey3: z.string(),
  darkGrey4: z.string(),
  darkGrey5: z.string(),
  darkGrey6: z.string(),
  darkGrey7: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().optional().nullable(),
  publishedIcon: z.string().optional().nullable(),
  publishedFont: z.string().optional().nullable(),
  publishedLightLargeLogo: z.string().optional().nullable(),
  publishedDarkLargeLogo: z.string().optional().nullable(),
  publishedLightAccent: z.string().optional().nullable(),
  publishedLightAccentHigh: z.string().optional().nullable(),
  publishedLightAccentLow: z.string().optional().nullable(),
  publishedLightForeground: z.string().optional().nullable(),
  publishedLightBackground: z.string().optional().nullable(),
  publishedLightGrey1: z.string().optional().nullable(),
  publishedLightGrey2: z.string().optional().nullable(),
  publishedLightGrey3: z.string().optional().nullable(),
  publishedLightGrey4: z.string().optional().nullable(),
  publishedLightGrey5: z.string().optional().nullable(),
  publishedLightGrey6: z.string().optional().nullable(),
  publishedLightGrey7: z.string().optional().nullable(),
  publishedDarkAccent: z.string().optional().nullable(),
  publishedDarkAccentHigh: z.string().optional().nullable(),
  publishedDarkAccentLow: z.string().optional().nullable(),
  publishedDarkForeground: z.string().optional().nullable(),
  publishedDarkBackground: z.string().optional().nullable(),
  publishedDarkGrey1: z.string().optional().nullable(),
  publishedDarkGrey2: z.string().optional().nullable(),
  publishedDarkGrey3: z.string().optional().nullable(),
  publishedDarkGrey4: z.string().optional().nullable(),
  publishedDarkGrey5: z.string().optional().nullable(),
  publishedDarkGrey6: z.string().optional().nullable(),
  publishedDarkGrey7: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
});
export type SchemaType = z.infer<typeof Schema>;

export const Branding = Schema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type BrandingType = z.infer<typeof Branding>;

export const Colours = Schema.pick({
  lightAccent: true,
  lightAccentHigh: true,
  lightAccentLow: true,
  lightForeground: true,
  lightBackground: true,
  lightGrey1: true,
  lightGrey2: true,
  lightGrey3: true,
  lightGrey4: true,
  lightGrey5: true,
  lightGrey6: true,
  lightGrey7: true,
  darkAccent: true,
  darkAccentHigh: true,
  darkAccentLow: true,
  darkForeground: true,
  darkBackground: true,
  darkGrey1: true,
  darkGrey2: true,
  darkGrey3: true,
  darkGrey4: true,
  darkGrey5: true,
  darkGrey6: true,
  darkGrey7: true,
}).partial({
  lightAccent: true,
  lightAccentHigh: true,
  lightAccentLow: true,
  lightForeground: true,
  lightBackground: true,
  lightGrey1: true,
  lightGrey2: true,
  lightGrey3: true,
  lightGrey4: true,
  lightGrey5: true,
  lightGrey6: true,
  lightGrey7: true,
  darkAccent: true,
  darkAccentHigh: true,
  darkAccentLow: true,
  darkForeground: true,
  darkBackground: true,
  darkGrey1: true,
  darkGrey2: true,
  darkGrey3: true,
  darkGrey4: true,
  darkGrey5: true,
  darkGrey6: true,
  darkGrey7: true,
});

export type ColoursType = z.infer<typeof Colours>;

export const IconFile = z.object({
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return (
        !file || file.size <= convertMegabytesToBytes(MAX_BRANDING_ASSET_SIZE)
      );
    }, `File size must be less than ${MAX_BRANDING_ASSET_SIZE} MB`)
    .refine((file) => {
      return !file || BASIC_IMAGE_TYPES.includes(file.type);
    }, "File must be a JPG or PNG"),
});
export type IconFileType = z.infer<typeof IconFile>;

export const LargeLogoFile = z.object({
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return (
        !file || file.size <= convertMegabytesToBytes(MAX_BRANDING_ASSET_SIZE)
      );
    }, `File size must be less than ${MAX_BRANDING_ASSET_SIZE} MB`)
    .refine((file) => {
      return !file || BASIC_IMAGE_TYPES.includes(file.type);
    }, "File must be a JPG or PNG"),
});
export type LargeLogoFileType = z.infer<typeof LargeLogoFile>;

export type BrandingQueryType = {
  appId: string;
  icon: string | null;
  font: string;
  lightLargeLogo: string | null;
  darkLargeLogo: string | null;
  colours: {
    accent: AccentColour;
    grey: GreyColour;
  };
  updatedAt: Date;
  publishedAt: Date | null;
};

export type BrandingContextType = {
  name?: string;
  description?: string;
  font?: string | null;
  icon?: File | null;
  lightLargeLogo?: File | null;
  darkLargeLogo?: File | null;
  colours?: {
    accent?: AccentColour;
    grey?: GreyColour;
  };
};
