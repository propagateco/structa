import { Hono } from "hono";
import { Resource } from "sst";
import { StripeWebhookService } from "@structa/core/stripe";

export const WebhookRoute = new Hono()
    // Stripe webhook endpoint
    .post("/stripe/connect", async (c) => {
        try {
            // Get the signature from the headers
            const signature = c.req.header("stripe-signature");
            if (!signature) {
                return c.json({ error: "Missing stripe signature" }, 400);
            }

            // Get the webhook endpoint secret from environment variables
            const endpointSecret = Resource.StripeWebhookSecret.value;
            if (!endpointSecret) {
                return c.json({ error: "Webhook secret not configured" }, 500);
            }

            // Get the raw body from the request
            const body = await c.req.raw.text();

            // Handle the webhook event
            const result = await StripeWebhookService.handleWebhookEvent({
                body,
                signature,
                endpointSecret,
            });

            return c.json({ received: true });
        } catch (error) {
            console.error("Error handling Stripe webhook:", error);
            return c.json({ error: "Webhook error" }, 400);
        }
    });
