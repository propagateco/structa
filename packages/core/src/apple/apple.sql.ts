import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { user } from "../auth/auth.sql";

export const apple = pgTable("apple", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),

  // App Store Connect API credentials
  keyId: text("key_id").notNull(),
  issuerId: text("issuer_id").notNull(),
  privateKey: text("private_key").notNull(), // Encrypted .p8 file content
  teamId: text("team_id"), // Optional - might be discovered from API

  // Connection status
  isConnected: boolean("is_connected").default(false).notNull(),
  lastVerifiedAt: timestamp("last_verified_at"),
  verificationError: text("verification_error"), // Last error message if connection failed

  // Account metadata from Apple
  accountName: text("account_name"), // Account holder name
  accountEmail: text("account_email"), // Email associated with the account
  roles: jsonb("roles"), // Array of roles the API key has


  // Contract status
  contractStatus: jsonb("contract_status"), // Array of contract status strings

  // Available apps
  availableApps: jsonb("available_apps"), // Cached list of available apps

  // Additional metadata
  accountMetadata: jsonb("account_metadata"), // Additional account details from Apple

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
