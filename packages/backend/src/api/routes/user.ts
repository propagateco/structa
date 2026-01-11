import { Hono } from "hono";
import { UserController, UserService, UserModel } from "@structa/core/user";
import { zValidator } from "@hono/zod-validator";
import { authenticatedMiddleware } from "../middleware";

export const UserRoute = new Hono()
    .use(authenticatedMiddleware)
    .get("/", async (c) => {
        const id = c.var.user.id;
        const user = await UserService.fromID(id);
        return c.json(user);
    })
    .put(
        "/name",
        zValidator("json", UserModel.User.pick({ name: true })),
        async (c) => {
            const id = c.var.user.id;
            const { name } = await c.req.json();
            const user = await UserService.updateNameFromId({ id, name });

            return c.json({ user }, 200);
        }
    )
    .put("/onboarding", zValidator("json", UserModel.Onboarding), async (c) => {
        const id = c.var.user.id;
        const { name, workspaceName, product, plan } = await c.req.json();
        // workspaceId will be auto-generated in updateProfileFromOnboarding
        // unless user is joining existing workspace via invitation (future feature)
        const user = await UserService.updateProfileFromOnboarding({
            id,
            name,
            workspaceName,
            product,
            plan,
        });

        return c.json({ user }, 200);
    })
    .put("/settings", zValidator("json", UserModel.Settings), async (c) => {
        const id = c.var.user.id;
        const { name, workspaceName, avatarKey } = await c.req.json();
        const user = await UserController.updateProfileFromSettings({
            id,
            name,
            workspaceName,
            avatarKey,
        });
        return c.json({ user }, 200);
    });
