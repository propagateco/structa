import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/aws-lambda";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { UserRoute } from "./routes/user";
import { OAuthRoute } from "./routes/oauth";
import { AuthRoute } from "./routes/auth";
import { BrandingRoute } from "./routes/branding";
import { AppRoute } from "./routes/app";
import { StorageRoute } from "./routes/storage";
import { ProductRoute } from "./routes/product";
import { WebhookRoute } from "./routes/webhook";
import { StripeRoute } from "./routes/stripe";
import { SalesRoute } from "./routes/sales";
import { AppleRoute } from "./routes/apple";
import { ExpoRoute } from "./routes/expo";
import { TestRoute } from "./routes/test";

export class VisibleError extends Error {
    constructor(
        public code: string,
        message: string
    ) {
        super(message);
    }
}

const app = new Hono().use(logger()).onError((error, c) => {
    if (error instanceof VisibleError) {
        return c.json(
            {
                code: error.code,
                message: error.message,
            },
            400
        );
    }
    if (error instanceof HTTPException) {
        return c.json(
            {
                message: error.message,
            },
            error.status
        );
    }
    if (error instanceof ZodError) {
        const e = error.errors[0];
        if (e) {
            return c.json(
                {
                    code: e?.code,
                    message: e?.message,
                },
                400
            );
        }
    }
    if (error instanceof Error) {
        return c.json(
            {
                code: error.name,
                message: error.message,
            },
            500
        );
    }
    return c.json(
        {
            code: "internal",
            message: "Internal server error",
        },
        500
    );
});

const routes = app
    .route("/auth", AuthRoute)
    .route("/oauth", OAuthRoute)
    .route("/user", UserRoute)
    .route("/app", AppRoute)
    .route("/branding", BrandingRoute)
    .route("/storage", StorageRoute)
    .route("/product", ProductRoute)
    .route("/webhook", WebhookRoute)
    .route("/stripe", StripeRoute)
    .route("/sales", SalesRoute)
    .route("/apple", AppleRoute)
    .route("/expo", ExpoRoute)
    .route("/test", TestRoute);

export const handler = handle(routes);
export type RoutesType = typeof routes;
