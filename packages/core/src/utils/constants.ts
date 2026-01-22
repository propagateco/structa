/**
 * For data fetching in the frontend
 */

export const DEFAULT_STALE_TIME = 1000 * 60 * 60 * 24; // 24 hours

/*
 * Constants for image types
 */

export const MAX_IMAGE_SIZE_LAMBDA = 1024 * 1024 * 6; // 6MB

export const BASIC_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export const TRANSPARENT_IMAGE_TYPES = ["image/png", "image/webp"];

export const CACHE_TTL = "max-age=31536000"; // 1 year

/**
 * Constants for hashing, checksums, and encryption
 */

export const SHORT_HASH_LENGTH = 8;
