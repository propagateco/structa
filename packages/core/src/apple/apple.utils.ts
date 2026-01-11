export * as AppleUtils from "./apple.utils";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

/**
 * Apple Connect API Client
 * ------------------------
 *
 * This utility provides a typed interface to Apple's App Store Connect API.
 *
 * It handles JWT token generation and API request management.
 */

// Response schemas
const UserInfoSchema = z.object({
  teamId: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  roles: z.array(z.string()),
  // Business compliance status
  businessType: z.string().optional(),
});

const AppSchema = z.object({
  id: z.string(),
  attributes: z.object({
    bundleId: z.string(),
    name: z.string(),
    sku: z.string(),
    primaryLocale: z.string(),
  }),
});

const AppsResponseSchema = z.object({
  data: z.array(AppSchema),
});

export class AppleConnectAPI {
  private keyId: string;
  private issuerId: string;
  private privateKey: string;
  private baseUrl = "https://api.appstoreconnect.apple.com/v1";

  constructor(credentials: {
    keyId: string;
    issuerId: string;
    privateKey: string;
  }) {
    this.keyId = credentials.keyId;
    this.issuerId = credentials.issuerId;
    this.privateKey = credentials.privateKey;
  }

  /**
   * Generate JWT Token
   * -----------------
   *
   * Creates a JWT token for authenticating with Apple's API
   */
  private generateToken(): string {
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 20 * 60; // 20 minutes

    const payload = {
      iss: this.issuerId,
      iat: now,
      exp: expiry,
      aud: "appstoreconnect-v1",
    };

    return jwt.sign(payload, this.privateKey, {
      algorithm: "ES256",
      keyid: this.keyId,
    });
  }

  /**
   * Make API Request
   * ---------------
   *
   * Helper method for making authenticated requests to Apple's API
   */
  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.generateToken();

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Apple API error: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.errors && errorData.errors[0]) {
          errorMessage =
            errorData.errors[0].detail ||
            errorData.errors[0].title ||
            errorMessage;
        }
      } catch {
        // If parsing fails, use the status text
        errorMessage = `Apple API error: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as T;
  }

  /**
   * Get User Info
   * ------------
   *
   * Fetches information about the authenticated user/team
   */
  async getUserInfo(): Promise<z.infer<typeof UserInfoSchema>> {
    try {
      // First, verify the connection works by making a test call
      await this.request<any>("/apps?limit=1");

      // Get all users in the team to find the Account Holder
      const usersResponse = await this.request<any>("/users");

      if (!usersResponse?.data || usersResponse.data.length === 0) {
        throw new Error("No users found in the Apple Developer account.");
      }

      console.log("usersResponse: ", usersResponse);

      // Find the Account Holder - there must be at least one
      const accountHolder = usersResponse.data.find((user: any) =>
        user.attributes?.roles?.some(
          (role: string) => role.toUpperCase() === "ACCOUNT_HOLDER",
        ),
      );

      if (!accountHolder) {
        throw new Error(
          "No Account Holder found in the Apple Developer account.",
        );
      }

      // Extract Account Holder information
      const firstName = accountHolder.attributes?.firstName || "";
      const lastName = accountHolder.attributes?.lastName || "";
      const userName = `${firstName} ${lastName}`.trim() || undefined;
      const userEmail = accountHolder.attributes?.username; // This is the Apple ID email

      // Verify this API key has admin access by testing admin-only endpoints
      try {
        await this.request<any>("/userInvitations?limit=1");
      } catch {
        throw new Error(
          "API key does not have Admin role. Please create a Team API key with Admin role.",
        );
      }

      // Check basic account access and determine business type
      let businessType: string | undefined;

      try {
        // Verify we can access basic app data
        await this.request<any>("/apps?limit=1");
      } catch (error) {
        console.log("Could not access apps endpoint:", error);
        throw new Error(
          "API key does not have sufficient permissions to access apps",
        );
      }

      // Try to determine business type from the account structure
      try {
        // Business accounts typically have multiple users or specific metadata
        if (usersResponse?.data && usersResponse.data.length > 1) {
          businessType = "business";
        } else if (usersResponse?.data && usersResponse.data.length === 1) {
          // Check if the single user has business-related roles or metadata
          const user = usersResponse.data[0];
          const roles = user.attributes?.roles || [];
          if (roles.includes("ADMIN") || roles.includes("ACCOUNT_HOLDER")) {
            // Could be either individual or business
            businessType = "individual"; // Default assumption for single user
          }
        }
      } catch {
        // Default to individual if we can't determine
        businessType = "individual";
      }

      // Return the Account Holder's information
      return {
        teamId: this.issuerId, // The issuer ID is always the team ID
        name: userName, // Account Holder's name
        email: userEmail, // Account Holder's Apple ID email
        roles: ["ADMIN"], // API key has admin access since it passed verification
        businessType,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Failed to verify Apple credentials. Please check your Key ID, Issuer ID, and private key.",
      );
    }
  }

  /**
   * Get Apps
   * --------
   *
   * Fetches all apps available to the authenticated account
   */
  async getApps(): Promise<
    Array<{
      id: string;
      bundleId: string;
      name: string;
      sku: string;
      primaryLocale: string;
    }>
  > {
    const response =
      await this.request<z.infer<typeof AppsResponseSchema>>("/apps");

    return response.data.map((app) => ({
      id: app.id,
      bundleId: app.attributes.bundleId,
      name: app.attributes.name,
      sku: app.attributes.sku,
      primaryLocale: app.attributes.primaryLocale,
    }));
  }

  /**
   * Get App Details
   * --------------
   *
   * Fetches detailed information about a specific app
   */
  async getApp(appId: string): Promise<{
    id: string;
    bundleId: string;
    name: string;
    sku: string;
    primaryLocale: string;
  }> {
    const response = await this.request<{ data: z.infer<typeof AppSchema> }>(
      `/apps/${appId}`,
    );

    return {
      id: response.data.id,
      bundleId: response.data.attributes.bundleId,
      name: response.data.attributes.name,
      sku: response.data.attributes.sku,
      primaryLocale: response.data.attributes.primaryLocale,
    };
  }
}

/**
 * Validation Utilities
 * -------------------
 *
 * Helper functions for validating Apple credentials format
 */

export function validateKeyId(keyId: string): boolean {
  // Key IDs are typically 10 characters, uppercase letters and numbers
  return /^[A-Z0-9]{10}$/.test(keyId);
}

export function validateIssuerId(issuerId: string): boolean {
  // Issuer IDs are UUIDs
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    issuerId,
  );
}

export function validatePrivateKey(privateKey: string): boolean {
  // Check if it looks like a .p8 private key
  return (
    privateKey.includes("BEGIN PRIVATE KEY") &&
    privateKey.includes("END PRIVATE KEY")
  );
}

export function parseP8File(content: string): string {
  // Clean up the private key content
  // Remove any extra whitespace and ensure proper formatting
  let cleaned = content.trim();

  // If the key doesn't have the proper headers, add them
  if (!cleaned.includes("BEGIN PRIVATE KEY")) {
    cleaned = `-----BEGIN PRIVATE KEY-----\n${cleaned}\n-----END PRIVATE KEY-----`;
  }

  return cleaned;
}
