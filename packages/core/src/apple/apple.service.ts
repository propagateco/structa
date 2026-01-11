import { db } from "../drizzle";
import { apple } from "./apple.sql";
import * as AppleModel from "./apple.model";
import { eq, and, isNull } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

/**
 * Apple Account Service
 * ---------------------
 *
 * This service handles all database operations for Apple App Store Connect integrations.
 *
 * It manages API credentials storage, connection status, and account metadata.
 */

export namespace AppleService {
  /**
   * Connection Management
   * --------------------
   *
   * Functions for creating, updating, and verifying Apple account connections
   */

  export async function fromUserId(
    userId: string,
  ): Promise<AppleModel.SchemaType | null> {
    const accounts = await db
      .select()
      .from(apple)
      .where(and(eq(apple.userId, userId), isNull(apple.deletedAt)))
      .limit(1);

    return (accounts[0] as unknown as AppleModel.SchemaType) || null;
  }

  export async function fromId(
    id: string,
  ): Promise<AppleModel.SchemaType | null> {
    const accounts = await db
      .select()
      .from(apple)
      .where(and(eq(apple.id, id), isNull(apple.deletedAt)))
      .limit(1);

    return (accounts[0] as unknown as AppleModel.SchemaType) || null;
  }

  export async function create(data: {
    userId: string;
    keyId: string;
    issuerId: string;
    privateKey: string;
  }): Promise<AppleModel.SchemaType> {
    const id = createId();

    const accounts = await db
      .insert(apple)
      .values({
        id,
        userId: data.userId,
        keyId: data.keyId,
        issuerId: data.issuerId,
        privateKey: data.privateKey,
      })
      .returning();

    return accounts[0] as unknown as AppleModel.SchemaType;
  }

  export async function update(
    id: string,
    data: Partial<{
      keyId: string;
      issuerId: string;
      privateKey: string;
      teamId: string;
      accountName: string;
      accountEmail: string;
      roles: any;
      isConnected: boolean;
      lastVerifiedAt: Date;
      verificationError: string | null;
      availableApps: any;
      accountMetadata: any;
    }>,
  ): Promise<AppleModel.SchemaType | null> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    // Convert roles array to JSON if it exists
    if (updateData.roles) {
      updateData.roles = updateData.roles as any;
    }

    const updates = await db
      .update(apple)
      .set(updateData)
      .where(and(eq(apple.id, id), isNull(apple.deletedAt)))
      .returning();

    return (updates[0] as unknown as AppleModel.SchemaType) || null;
  }

  export async function updateFromUserId(
    userId: string,
    data: Partial<{
      keyId: string;
      issuerId: string;
      privateKey: string;
      teamId: string;
      accountName: string;
      accountEmail: string;
      roles: any;
      isConnected: boolean;
      lastVerifiedAt: Date;
      verificationError: string | null;
      availableApps: any;
      accountMetadata: any;
    }>,
  ): Promise<AppleModel.SchemaType | null> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    // Convert roles array to JSON if it exists
    if (updateData.roles) {
      updateData.roles = updateData.roles as any;
    }

    const updates = await db
      .update(apple)
      .set(updateData)
      .where(and(eq(apple.userId, userId), isNull(apple.deletedAt)))
      .returning();

    return (updates[0] as unknown as AppleModel.SchemaType) || null;
  }

  /**
   * Deletion and Cleanup
   * -------------------
   *
   * Functions for disconnecting and cleaning up Apple accounts
   */

  export async function deleteFromUserId(userId: string): Promise<boolean> {
    const result = await db
      .delete(apple)
      .where(and(eq(apple.userId, userId), isNull(apple.deletedAt)));

    return (result.rowCount ?? 0) > 0;
  }

  export async function deleteFromId(id: string): Promise<boolean> {
    const result = await db
      .delete(apple)
      .where(and(eq(apple.id, id), isNull(apple.deletedAt)));

    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Verification Status
   * ------------------
   *
   * Functions for managing connection verification status
   */

  export async function markVerified(
    id: string,
    metadata: {
      teamId?: string;
      accountName?: string;
      accountEmail?: string;
      roles?: string[];
      contractStatus?: string[];
    },
  ): Promise<AppleModel.SchemaType | null> {
    return update(id, {
      isConnected: true,
      lastVerifiedAt: new Date(),
      verificationError: null,
      ...metadata,
    });
  }

  export async function markVerificationFailed(
    id: string,
    error: string,
  ): Promise<AppleModel.SchemaType | null> {
    return update(id, {
      isConnected: false,
      verificationError: error,
      lastVerifiedAt: new Date(),
    });
  }

  /**
   * Utility Functions
   * ----------------
   *
   * Helper functions for common operations
   */

  export async function exists(userId: string): Promise<boolean> {
    const account = await fromUserId(userId);
    return account !== null;
  }

  export async function isConnected(userId: string): Promise<boolean> {
    const account = await fromUserId(userId);
    return Boolean(account?.isConnected);
  }
}
