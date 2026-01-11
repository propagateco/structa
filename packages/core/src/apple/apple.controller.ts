export * as AppleController from "./apple.controller";
import { AppleService } from "./apple.service";
import { AppleModel } from "./apple.model";
import { AppleUtils } from "./apple.utils";
import { VisibleError } from "../utils/error";
import { encrypt, decrypt } from "../utils/encryption";

/**
 * Apple Account Controller
 * -----------------------
 *
 * This controller orchestrates business logic for Apple App Store Connect integrations.
 *
 * It handles API credential verification, connection management, and data retrieval.
 */

/**
 * Connection Management
 * --------------------
 *
 * Functions for establishing and managing Apple account connections
 */

export async function connectAccount(
  userId: string,
  credentials: AppleModel.MutateClientType,
): Promise<AppleModel.SchemaType> {
  // Check if account already exists
  const existingAccount = await AppleService.fromUserId(userId);
  if (existingAccount && existingAccount.isConnected) {
    throw new VisibleError(
      "APPLE_ALREADY_CONNECTED",
      "Apple account already connected",
    );
  }

  // Encrypt the private key before storing
  const encryptedPrivateKey = await encrypt(credentials.privateKey);

  // Create or update the account
  let account: AppleModel.SchemaType;
  if (existingAccount) {
    // Update existing account with new credentials
    account = (await AppleService.updateFromUserId(userId, {
      keyId: credentials.keyId,
      issuerId: credentials.issuerId,
      privateKey: encryptedPrivateKey,
      isConnected: false,
      verificationError: null,
    })) as AppleModel.SchemaType;
  } else {
    // Create new account
    account = await AppleService.create({
      userId,
      keyId: credentials.keyId,
      issuerId: credentials.issuerId,
      privateKey: encryptedPrivateKey,
    });
  }

  // Verify the credentials
  const verificationResult = await verifyCredentials(account);

  if (!verificationResult.success) {
    // Mark as failed and throw error
    await AppleService.markVerificationFailed(
      account.id,
      verificationResult.error || "Unknown verification error",
    );
    throw new VisibleError(
      "APPLE_VERIFICATION_FAILED",
      verificationResult.error || "Failed to verify Apple credentials",
    );
  }

  // Update account with verified metadata
  const updatedAccount = await AppleService.markVerified(account.id, {
    teamId: verificationResult.teamId,
    accountName: verificationResult.accountName,
    accountEmail: verificationResult.accountEmail,
    roles: verificationResult.roles,
    contractStatus: credentials.contractStatus,
  });

  if (!updatedAccount) {
    throw new VisibleError(
      "APPLE_ERROR",
      "Failed to update account after verification",
    );
  }

  return updatedAccount;
}

export async function disconnectAccount(userId: string): Promise<void> {
  const account = await AppleService.fromUserId(userId);
  if (!account) {
    throw new VisibleError("APPLE_ERROR", "No Apple account connected");
  }

  // Delete the account (soft delete and clear credentials)
  const deleted = await AppleService.deleteFromUserId(userId);
  if (!deleted) {
    throw new VisibleError("APPLE_ERROR", "Failed to disconnect Apple account");
  }
}

export async function updateCredentials(
  userId: string,
  credentials: AppleModel.MutateClientType,
): Promise<AppleModel.SchemaType> {
  const account = await AppleService.fromUserId(userId);
  if (!account) {
    throw new VisibleError("APPLE_ERROR", "No Apple account found");
  }

  // Prepare update data
  const updateData: any = {};
  if (credentials.keyId) updateData.keyId = credentials.keyId;
  if (credentials.issuerId) updateData.issuerId = credentials.issuerId;
  if (credentials.privateKey) {
    updateData.privateKey = await encrypt(credentials.privateKey);
  }

  // Update the account
  const updatedAccount = await AppleService.updateFromUserId(
    userId,
    updateData,
  );
  if (!updatedAccount) {
    throw new VisibleError("APPLE_ERROR", "Failed to update Apple account");
  }

  // Re-verify the credentials
  const verificationResult = await verifyCredentials(updatedAccount);

  if (!verificationResult.success) {
    // Mark as failed
    await AppleService.markVerificationFailed(
      updatedAccount.id,
      verificationResult.error || "Unknown verification error",
    );
    throw new VisibleError(
      "APPLE_ERROR",
      verificationResult.error || "Failed to verify updated credentials",
    );
  }

  // Update with new metadata
  const finalAccount = await AppleService.markVerified(updatedAccount.id, {
    teamId: verificationResult.teamId,
    accountName: verificationResult.accountName,
    accountEmail: verificationResult.accountEmail,
    roles: verificationResult.roles,
  });

  if (!finalAccount) {
    throw new VisibleError(
      "APPLE_ERROR",
      "Failed to update account after verification",
    );
  }

  return finalAccount;
}

/**
 * Data Retrieval
 * --------------
 *
 * Functions for fetching account data and app information
 */

export async function getAccountForClient(
  userId: string,
): Promise<AppleModel.ClientResponseType> {
  const account = await AppleService.fromUserId(userId);

  if (!account || !account.isConnected) {
    return { connected: false };
  }

  return {
    connected: true,
    id: account.id,
    keyId: account.keyId,
    issuerId: account.issuerId,
    teamId: account.teamId,
    accountName: account.accountName,
    accountEmail: account.accountEmail,
    lastVerifiedAt: account.lastVerifiedAt,
    roles: (account.roles as string[]) ?? undefined,
    contractStatus: (account.contractStatus as string[]) ?? undefined,
  };
}

export async function getAvailableApps(
  userId: string,
): Promise<AppleModel.AppType[]> {
  const account = await AppleService.fromUserId(userId);
  if (!account || !account.isConnected) {
    throw new VisibleError("APPLE_ERROR", "No Apple account connected");
  }

  // Decrypt the private key
  const privateKey = await decrypt(account.privateKey);

  // Create API client
  const api = new AppleUtils.AppleConnectAPI({
    keyId: account.keyId,
    issuerId: account.issuerId,
    privateKey,
  });

  try {
    // Fetch apps from Apple
    const apps = await api.getApps();

    // Cache the apps
    await AppleService.update(account.id, {
      availableApps: apps,
    });

    return apps;
  } catch (error) {
    console.error("Failed to fetch apps from Apple:", error);
    throw new VisibleError(
      "APPLE_ERROR",
      "Failed to fetch apps from Apple App Store Connect",
    );
  }
}

/**
 * Verification
 * ------------
 *
 * Functions for verifying Apple credentials
 */

export async function verifyCredentials(
  account: AppleModel.SchemaType,
): Promise<AppleModel.VerificationResultType> {
  try {
    // Decrypt the private key
    const privateKey = await decrypt(account.privateKey);

    // Create API client
    const api = new AppleUtils.AppleConnectAPI({
      keyId: account.keyId,
      issuerId: account.issuerId,
      privateKey,
    });

    // Test the connection by fetching user info
    const userInfo = await api.getUserInfo();

    return {
      success: true,
      teamId: userInfo.teamId,
      accountName: userInfo.name,
      accountEmail: userInfo.email,
      roles: userInfo.roles,
    };
  } catch (error) {
    console.error("Apple credential verification failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function testConnection(userId: string): Promise<boolean> {
  const account = await AppleService.fromUserId(userId);
  if (!account) {
    return false;
  }

  const result = await verifyCredentials(account);

  if (result.success) {
    // Update last verified timestamp
    await AppleService.update(account.id, {
      lastVerifiedAt: new Date(),
    });
  } else {
    // Update error status
    await AppleService.markVerificationFailed(
      account.id,
      result.error || "Connection test failed",
    );
  }

  return result.success;
}
