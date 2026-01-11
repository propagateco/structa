import { Hono } from "hono";
import {
    BrandingService,
    BrandingController,
    BrandingModel,
} from "@structa/core/branding";
import { zValidator } from "@hono/zod-validator";
import { authenticatedMiddleware } from "../middleware";

export const BrandingRoute = new Hono()
    .use(authenticatedMiddleware)
    .post(
        "/",
        zValidator(
            "json",
            BrandingModel.Schema.pick({
                appId: true,
            })
        ),
        async (c) => {
            const { appId: providedAppId } = await c.req.json();
            const appId = providedAppId || c.var.user.workspaceId;

            if (!appId) {
                return c.json(
                    { error: "User has not completed onboarding" },
                    400
                );
            }
            const branding = await BrandingService.create({
                appId,
            });
            return c.json({ branding }, 201);
        }
    )
    .get("/", async (c) => {
        const appId = c.var.user.workspaceId;
        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }
        const branding = await BrandingService.fromAppId(appId);
        return c.json(branding, 200);
    })
    .put(
        "/icon",
        zValidator("json", BrandingModel.Branding.pick({ icon: true })),
        async (c) => {
            const appId = c.var.user.workspaceId;
            if (!appId) {
                return c.json(
                    { error: "User has not completed onboarding" },
                    400
                );
            }
            const { icon: iconKey } = await c.req.json();
            const branding = await BrandingController.updateIconFromAppId({
                appId,
                iconKey,
            });
            return c.json(branding, 200);
        }
    )
    .put(
        "/logo/light/large",
        zValidator(
            "json",
            BrandingModel.Branding.pick({ lightLargeLogo: true })
        ),
        async (c) => {
            const appId = c.var.user.workspaceId;
            if (!appId) {
                return c.json(
                    { error: "User has not completed onboarding" },
                    400
                );
            }
            const { lightLargeLogo: lightLargeLogoKey } = await c.req.json();
            const branding =
                await BrandingController.updateLightLargeLogoFromAppId({
                    appId,
                    lightLargeLogoKey,
                });
            return c.json(branding, 200);
        }
    )
    .put(
        "/logo/dark/large",
        zValidator(
            "json",
            BrandingModel.Branding.pick({ darkLargeLogo: true })
        ),
        async (c) => {
            const appId = c.var.user.workspaceId;
            if (!appId) {
                return c.json(
                    { error: "User has not completed onboarding" },
                    400
                );
            }
            const { darkLargeLogo } = await c.req.json();
            const branding = await BrandingService.updateDarkLargeLogoFromAppId(
                {
                    appId,
                    darkLargeLogo,
                }
            );
            return c.json(branding, 200);
        }
    )
    .put(
        "/font",
        zValidator("json", BrandingModel.Branding.pick({ font: true })),
        async (c) => {
            const appId = c.var.user.workspaceId;
            if (!appId) {
                return c.json(
                    { error: "User has not completed onboarding" },
                    400
                );
            }
            const { font } = await c.req.json();
            const branding = await BrandingService.updateFontFromId({
                appId,
                font,
            });
            return c.json(branding, 200);
        }
    )
    .put("/colours", zValidator("json", BrandingModel.Colours), async (c) => {
        const appId = c.var.user.workspaceId;
        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }
        const colours = await c.req.json();
        const branding = await BrandingService.updateColoursFromAppId({
            appId,
            ...colours,
        });
        return c.json(branding, 200);
    })
    .delete("/icon", async (c) => {
        const appId = c.var.user.workspaceId;
        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }
        const branding = await BrandingController.deleteIconFromAppId({
            appId,
        });
        return c.json(branding, 200);
    })
    .delete("/logo/light/large", async (c) => {
        const appId = c.var.user.workspaceId;
        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }
        const branding = await BrandingController.deleteLightLargeLogoFromAppId(
            { appId }
        );
        return c.json(branding, 200);
    })
    .post("/publish", async (c) => {
        const appId = c.var.user.workspaceId;
        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }
        const branding = await BrandingController.publishBranding({ appId });
        return c.json(branding, 200);
    });
