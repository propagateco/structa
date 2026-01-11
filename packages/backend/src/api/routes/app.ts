import { Hono } from "hono";
import {
    AppService,
    AppModel,
    AppController,
    AppPricingService,
    AppPricingModel,
} from "@structa/core/app";
import {
    StripeSalesController,
    StripeAccountService,
} from "@structa/core/stripe";
import { zValidator } from "@hono/zod-validator";
import { authenticatedMiddleware, type Env } from "../middleware";

export const AppRoute = new Hono<Env>()
    .use(authenticatedMiddleware)
    .get("/", async (c) => {
        const appId = c.var.user.workspaceId;
        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }
        const app = await AppService.fromID(appId);
        return c.json(app);
    })
    .post(
        "/",
        zValidator(
            "json",
            AppModel.App.pick({ name: true, id: true }).partial({
                id: true,
            })
        ),
        async (c) => {
            const userId = c.var.user.id;
            const { name, id } = await c.req.json();
            
            // Use provided id (during onboarding) or fall back to workspaceId (for existing users)
            const appId = id || c.var.user.workspaceId;
            
            if (!appId) {
                return c.json(
                    { error: "User has not completed onboarding" },
                    400
                );
            }
            
            const app = await AppService.create({
                id: appId,
                userId,
                name,
            });
            return c.json({ app }, 201);
        }
    )
    .put(
        "/branding",
        zValidator(
            "json",
            AppModel.App.pick({ name: true, description: true }).partial()
        ),
        async (c) => {
            const appId = c.var.user.workspaceId;
            if (!appId) {
                return c.json(
                    { error: "User has not completed onboarding" },
                    400
                );
            }
            const { name, description } = await c.req.json();
            const app = await AppController.updateAppFromBrandingPage({
                id: appId,
                name,
                description,
            });
            return c.json({ app }, 200);
        }
    )
    .post("/publish", async (c) => {
        const appId = c.var.user.workspaceId;
        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }
        const app = await AppController.publishApp({ id: appId });
        return c.json(app, 200);
    })
    // Get pricing for a specific app
    .get("/pricing", async (c) => {
        const userId = c.var.user.id;
        const appId = c.var.user.workspaceId;

        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }

        try {
            // Verify the user owns this app
            const app = await AppService.fromID(appId);
            if (!app || app.userId !== userId) {
                return c.json({ error: "App not found or access denied" }, 404);
            }

            // Get app pricing
            const appPricing = await AppPricingService.fromAppId(appId);

            if (!appPricing) {
                // Return default pricing structure
                return c.json({
                    appId,
                    monthlyPrice: null,
                    quarterlyPrice: null,
                    annualPrice: null,
                    currency: "usd",
                    hasStripeAccount: false,
                });
            }

            // Check if user has Stripe account
            const stripeAccount = await StripeAccountService.fromUserId(userId);
            const hasStripeAccount = !!stripeAccount;

            return c.json({
                appId: appPricing.appId,
                monthlyPrice: appPricing.monthlyPrice
                    ? parseFloat(appPricing.monthlyPrice)
                    : null,
                quarterlyPrice: appPricing.quarterlyPrice
                    ? parseFloat(appPricing.quarterlyPrice)
                    : null,
                annualPrice: appPricing.annualPrice
                    ? parseFloat(appPricing.annualPrice)
                    : null,
                currency: appPricing.currency,
                hasStripeAccount,
                isActive: appPricing.isActive,
                updatedAt: appPricing.updatedAt,
            });
        } catch (error) {
            console.error("Error fetching app pricing:", error);
            return c.json({ error: "Failed to fetch pricing" }, 500);
        }
    })

    // Update pricing for a specific app
    .put(
        "/pricing",
        zValidator("json", AppPricingModel.MutationClient),
        async (c) => {
            const userId = c.var.user.id;
            const appId = c.var.user.workspaceId;

            if (!appId) {
                return c.json(
                    { error: "User has not completed onboarding" },
                    400
                );
            }

            const pricing = c.req.valid("json");

            try {
                // Verify the user owns this app
                const app = await AppService.fromID(appId);
                if (!app || app.userId !== userId) {
                    return c.json(
                        { error: "App not found or access denied" },
                        404
                    );
                }

                // Check if user has Stripe account
                const stripeAccount =
                    await StripeAccountService.fromUserId(userId);
                if (!stripeAccount) {
                    return c.json(
                        { error: "No Stripe account connected" },
                        400
                    );
                }

                // Create or update Stripe products and app pricing
                const result =
                    await StripeSalesController.createOrUpdateSubscriptionProducts(
                        {
                            appId,
                            userId,
                            pricing,
                            appName: app.name,
                        }
                    );

                return c.json({
                    success: true,
                    appPricing: {
                        appId: result.appPricing.appId,
                        monthlyPrice: result.appPricing.monthlyPrice
                            ? parseFloat(result.appPricing.monthlyPrice)
                            : null,
                        quarterlyPrice: result.appPricing.quarterlyPrice
                            ? parseFloat(result.appPricing.quarterlyPrice)
                            : null,
                        annualPrice: result.appPricing.annualPrice
                            ? parseFloat(result.appPricing.annualPrice)
                            : null,
                        currency: result.appPricing.currency,
                        updatedAt: result.appPricing.updatedAt,
                    },
                    stripeProductId: result.stripeProduct.id,
                    priceIds: result.priceIds,
                });
            } catch (error) {
                console.error("Error updating app pricing:", error);
                if (
                    error instanceof Error &&
                    error.message === "No Stripe account connected"
                ) {
                    return c.json({ error: error.message }, 400);
                }
                return c.json({ error: "Failed to update pricing" }, 500);
            }
        }
    );
