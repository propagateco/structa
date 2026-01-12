import { Hono } from "hono";
import { createClient } from "@openauthjs/openauth/client";
import { subjects } from "../../auth/subjects";
import { Resource } from "sst";
import { deleteSession, getSession, setSession } from "../sessions";

const client = createClient({
    issuer: Resource.Auth.url,
    clientID: "web-client",
});

export const OAuthRoute = new Hono()
    .get("/", async (c) => {
        const { access, refresh } = getSession(c);

        if (!access || !refresh) {
            return c.json(
                { error: "No access or refresh token in cookie" },
                401
            );
        }

        try {
            const verified = await client.verify(subjects, access!, {
                refresh,
            });
            if (verified.err) {
                console.error("Verification error:", verified.err);
                throw new Error("Invalid access token");
            }
            if (verified.tokens) {
                setSession(c, verified.tokens.access, verified.tokens.refresh);
                console.log("Session set with new tokens");
            }
            return c.json(verified.subject, 200);
        } catch (e) {
            console.error("Error during token verification:", e);
            return c.json({ error: "Error during token verification" }, 401);
        }
    })
    .get("/authorize", async (c) => {
        try {
            const provider =
                (c.req.query("provider") as "google" | "code" | undefined) ||
                "code";
            const { url } = await client.authorize(
                Resource.Domain.api + "/auth/callback",
                "code",
                {
                    provider,
                }
            );
            return c.json({ url });
        } catch (error) {
            console.error("Error in /authorize route:", error);
            return c.json({ error: "Internal server error" }, 500);
        }
    })
    .get("/callback", async (c) => {
        const referrer = c.req.header("Referer");
        const url = new URL(referrer || "");
        try {
            const code = c.req.query("code");
            const error = c.req.query("error");
            const errorDescription = c.req.query("error_description");

            if (error) {
                return new Response(
                    `Error: ${error}, Description: ${errorDescription}`,
                    {
                        status: 400,
                    }
                );
            }

            if (!code) throw new Error("Missing code");

            const exchanged = await client.exchange(
                code,
                Resource.Domain.api + "/auth/callback"
            );
            if (exchanged.err) {
                console.log("Exchanged error: ", exchanged.err);
                return new Response(
                    "Exchanged error: " + exchanged.err.toString(),
                    {
                        status: 400,
                    }
                );
            }

            setSession(c, exchanged.tokens.access, exchanged.tokens.refresh);
            return c.redirect(Resource.Domain.platform, 302);
        } catch (e: any) {
            console.error("Error caught:", e);
            if (e.response) {
                console.error("Response:", e.response);
            }
            if (e.stack) {
                console.error("Stack trace:", e.stack);
            }
            return new Response(`Error: ${e.message}`, { status: 500 });
        }
    })
    .get("/logout", (c) => {
        try {
            deleteSession(c);
            return c.json({ message: "Logged out" }, 200);
        } catch (error) {
            console.error("Error deleting cookies:", error);
            return c.json({ message: "Failed to log out" }, 500);
        }
    });
