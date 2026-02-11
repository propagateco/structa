import { Hono } from "hono";
import { auth } from "../../auth/auth";

export const AuthRoute = new Hono().on(["POST", "GET"], "/*", (c) => {
	return auth.handler(c.req.raw);
});
