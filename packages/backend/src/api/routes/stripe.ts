import { Hono } from "hono";
import { Resource } from "sst";
import { authenticatedMiddleware } from "../middleware";
import {
    StripeAccountService,
    StripeController,
    StripeAccountModel,
} from "@structa/core/stripe";

export const StripeRoute = new Hono()
    .use(authenticatedMiddleware)
    .get("/oauth/url", async (c) => {
        const id = c.var.user.id;

        const redirectUri = new URL(
            "/stripe/oauth/callback",
            Resource.Domain.api
        ).toString();
        const url = StripeAccountService.generateConnectOAuthUrl(
            id,
            redirectUri
        );

        return c.json({ url });
    })

    // Get account details
    .get("/account", async (c) => {
        const id = c.var.user.id;

        // Get the user's Stripe account
        const stripeAccount = await StripeAccountService.fromUserId(id);
        if (!stripeAccount) {
            // Return 200 with connected: false when user hasn't connected Stripe yet
            // This prevents TanStack Query from treating it as an error
            return c.json({ connected: false });
        }

        // Extract business name from dedicated fields
        const businessName =
            stripeAccount.businessProfileName ||
            stripeAccount.companyName ||
            (stripeAccount.individualFirstName ||
            stripeAccount.individualLastName
                ? `${stripeAccount.individualFirstName || ""} ${stripeAccount.individualLastName || ""}`.trim()
                : null);

        // Return a sanitized version of the account details (without sensitive fields)
        const response: StripeAccountModel.StripeAccountApiResponseType = {
            id: stripeAccount.id,
            stripeAccountId: stripeAccount.stripeAccountId,
            chargesEnabled: stripeAccount.chargesEnabled,
            payoutsEnabled: stripeAccount.payoutsEnabled,
            detailsSubmitted: stripeAccount.detailsSubmitted,
            businessType: stripeAccount.businessType,
            accountType: stripeAccount.accountType,
            country: stripeAccount.country,
            currency: stripeAccount.currency,
            email: stripeAccount.email,
            businessName: businessName,
            createdAt: stripeAccount.createdAt,
        };
        return c.json(response);
    })

    // Disconnect Stripe account
    .post("/account/disconnect", async (c) => {
        const userId = c.var.user.id;
        console.log(
            "Processing Stripe disconnection request for userId:",
            userId
        );

        try {
            // First check if account exists
            const existingAccount =
                await StripeAccountService.fromUserId(userId);
            console.log(
                "Existing account Id before deletion:",
                existingAccount.id
            );

            if (!existingAccount) {
                return c.json({ connected: false });
            }

            // Hard delete all Stripe data for this user
            const { success, deletedAccount } =
                await StripeController.hardDelete(userId);

            if (!success) {
                return c.json(
                    { error: "Failed to delete Stripe account" },
                    500
                );
            }

            console.log(
                `Successfully deleted Stripe account: ${deletedAccount.id} for userId: ${userId}`
            );
            return c.json({ success: true });
        } catch (error) {
            console.error("Error disconnecting Stripe account:", error);
            if (
                error instanceof Error &&
                error.message === "No Stripe account found for user"
            ) {
                return c.json({ connected: false });
            }
            return c.json(
                { error: "Failed to disconnect Stripe account" },
                500
            );
        }
    })

    // Public routes (no auth required)
    // Stripe Connect OAuth callback endpoint
    .get("/oauth/callback", async (c) => {
        try {
            const { code, state } = c.req.query();

            // Validate required parameters
            if (!code) {
                return c.json({ error: "Invalid code parameter" }, 400);
            }

            if (!state) {
                return c.json({ error: "Invalid state parameter" }, 400);
            }

            // Parse the state parameter which should contain our user ID
            let userId: string;
            try {
                const stateObj = JSON.parse(
                    Buffer.from(state, "base64").toString()
                );
                userId = stateObj.userId;
            } catch (error) {
                console.error("Error parsing state parameter:", error);
                return c.json({ error: "Invalid state parameter" }, 400);
            }

            // Connect the Stripe account via OAuth
            const stripeAccount = await StripeAccountService.connectOAuth({
                code,
                userId,
            });
            console.log(`Connected to Stripe account ${stripeAccount.id}`);

            // Redirect to the success page
            const successUrl = new URL(
                "/settings/integrations?success=true",
                Resource.Domain.platform
            ).toString();
            return c.redirect(successUrl, 302);
        } catch (error) {
            console.error("Error in Stripe OAuth callback:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            return c.redirect(
                `/settings/integrations?error=true&message=${encodeURIComponent(errorMessage)}`
            );
        }
    });
