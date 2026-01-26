import crypto from "crypto";
import { Resource } from "sst";

/**
 * Encryption Utilities
 * -------------------
 *
 * This module provides functions for encrypting and decrypting sensitive data.
 *
 * Uses AES-256-GCM for authenticated encryption with the built-in crypto module.
 */

// Get encryption key from environment or use a default for development
// In production, this MUST come from environment variables
const ENCRYPTION_KEY = Resource.EncryptionKey.value;

// Ensure the key is exactly 32 bytes for AES-256
const KEY = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();

/**
 * Encrypt a string value
 * ---------------------
 *
 * Encrypts a string using AES-256-GCM with a random IV
 */
export async function encrypt(text: string): Promise<string> {
	// Generate a random initialization vector
	const iv = crypto.randomBytes(16);

	// Create cipher
	const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);

	// Encrypt the text
	const encrypted = Buffer.concat([
		cipher.update(text, "utf8"),
		cipher.final(),
	]);

	// Get the authentication tag
	const authTag = cipher.getAuthTag();

	// Combine iv, authTag, and encrypted data
	// Format: iv (16 bytes) + authTag (16 bytes) + encrypted data
	const combined = Buffer.concat([iv, authTag, encrypted]);

	// Return as base64 string
	return combined.toString("base64");
}

/**
 * Decrypt a string value
 * ---------------------
 *
 * Decrypts a string that was encrypted with the encrypt function
 */
export async function decrypt(encryptedText: string): Promise<string> {
	// Decode from base64
	const combined = Buffer.from(encryptedText, "base64");

	// Extract components
	const iv = combined.subarray(0, 16);
	const authTag = combined.subarray(16, 32);
	const encrypted = combined.subarray(32);

	// Create decipher
	const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
	decipher.setAuthTag(authTag);

	// Decrypt the text
	const decrypted = Buffer.concat([
		decipher.update(encrypted),
		decipher.final(),
	]);

	return decrypted.toString("utf8");
}
