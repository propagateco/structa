import { createMiddleware } from "hono/factory";
import { auth } from "../auth/auth";

export type Env = {
    Bindings: Record<string, never>;
    Variables: {
        user: typeof auth.$Infer.Session.user;
        session: typeof auth.$Infer.Session.session;
    };
};

export const authenticatedMiddleware = createMiddleware<Env>(
    async (c, next) => {
        console.log("Running authenticated middleware...");

        const session = await auth.api.getSession({
            headers: c.req.raw.headers,
        });

        if (!session) {
            console.error("No valid session found");
            return c.json({ error: "No valid session found" }, 401);
        }

        c.set("user", session.user);
        c.set("session", session.session);

        console.log("Authenticated middleware successful!");

        return next();
    }
);
