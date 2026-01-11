import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AppleModel, AppleController, AppleUtils } from "@structa/core/apple";
import { authenticatedMiddleware } from "../middleware";

/**
 * Apple App Store Connect API Routes
 * ----------------------------------
 *
 * This module handles all API endpoints for Apple App Store Connect integration.
 *
 * Includes connection management, credential verification, and app retrieval.
 */

export const AppleRoute = new Hono()
  .use(authenticatedMiddleware)

  /**
   * Get Apple Account Status
   * -----------------------
   *
   * Returns the current Apple account connection status and details
   */
  .get("/account", async (c) => {
    const subject = c.var.subject;
    const account = await AppleController.getAccountForClient(subject.id);
    return c.json(account);
  })

  /**
   * Connect Apple Account
   * --------------------
   *
   * Creates or updates Apple account connection with provided credentials
   */
  .post(
    "/account/connect",
    zValidator(
      "json",
      AppleModel.MutateClient.extend({
        contractStatus: z.array(z.string()).optional(),
      }),
    ),
    async (c) => {
      const subject = c.var.subject;
      const credentials = c.req.valid("json");

      const account = await AppleController.connectAccount(
        subject.id,
        credentials,
      );

      // Return client-safe response
      const clientResponse = await AppleController.getAccountForClient(
        subject.id,
      );
      return c.json(clientResponse);
    },
  )

  /**
   * Update Apple Credentials
   * -----------------------
   *
   * Updates existing Apple account credentials
   */
  .put(
    "/account/credentials",
    zValidator("json", AppleModel.MutateClient),
    async (c) => {
      const subject = c.var.subject;
      const credentials = c.req.valid("json");

      await AppleController.updateCredentials(subject.id, credentials);

      // Return updated account
      const clientResponse = await AppleController.getAccountForClient(
        subject.id,
      );
      return c.json(clientResponse);
    },
  )

  /**
   * Test Apple Connection
   * --------------------
   *
   * Verifies that the Apple credentials are valid and working
   */
  .post("/account/test", async (c) => {
    const subject = c.var.subject;
    const success = await AppleController.testConnection(subject.id);

    return c.json({ success });
  })

  /**
   * Disconnect Apple Account
   * -----------------------
   *
   * Removes Apple account connection and clears all stored credentials
   */
  .post("/account/disconnect", async (c) => {
    const subject = c.var.subject;
    await AppleController.disconnectAccount(subject.id);

    return c.json({ connected: false });
  })

  /**
   * Get Available Apps
   * -----------------
   *
   * Fetches all apps available in the connected Apple account
   */
  .get("/apps", async (c) => {
    const subject = c.var.subject;
    const apps = await AppleController.getAvailableApps(subject.id);

    return c.json({ apps });
  })

  /**
   * Validate Credentials Format
   * --------------------------
   *
   * Validates the format of Apple credentials without saving them
   */
  .post(
    "/validate",
    zValidator(
      "json",
      z.object({
        keyId: z.string(),
        issuerId: z.string(),
        privateKey: z.string(),
      }),
    ),
    async (c) => {
      const { keyId, issuerId, privateKey } = c.req.valid("json");

      const errors: string[] = [];

      if (!AppleUtils.validateKeyId(keyId)) {
        errors.push(
          "Key ID must be exactly 10 characters containing only uppercase letters and numbers",
        );
      }

      if (!AppleUtils.validateIssuerId(issuerId)) {
        errors.push("Issuer ID must be a valid UUID");
      }

      if (!AppleUtils.validatePrivateKey(privateKey)) {
        errors.push(
          "Private key must be a valid .p8 file content with BEGIN/END PRIVATE KEY markers",
        );
      }

      return c.json({
        valid: errors.length === 0,
        errors,
      });
    },
  );
