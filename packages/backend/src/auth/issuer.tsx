import { Resource } from "sst";

import { render } from "@react-email/components";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { SendEmailCommandInput } from "@aws-sdk/client-sesv2";
import { issuer } from "@openauthjs/openauth";
import { handle } from "hono/aws-lambda";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { GoogleOidcProvider } from "@openauthjs/openauth/provider/google";

import { VerifyEmail } from "@structa/notifications/emails/VerifyEmail";
import { subjects } from "./subjects";
import * as Schema from "./schema";
import { UserService, UserModel } from "@structa/core/user";

const ses = new SESv2Client();

async function getOrCreateUser(
    email: string,
    name?: string,
    image?: string
): Promise<UserModel.SubjectType> {
    let user = await UserService.fromEmail(email);
    if (!user) {
        user = await UserService.create({
            email,
            name,
            image,
        });
    }
    return user;
}

const app = issuer({
    subjects,
    providers: {
        code: CodeProvider({
            length: 6,
            sendCode: async (claims, code) => {
                console.log("Sending code: ", code, "to email: ", claims.email);
                const sender = "Propagate <auth@" + Resource.Email.sender + ">";

                const emailHTML = await render(
                    VerifyEmail({
                        type: "sign-in",
                        validationCode: code,
                        location: null,
                    }),
                    {
                        pretty: true,
                    }
                );

                const emailParams: SendEmailCommandInput = {
                    FromEmailAddress: sender,
                    Destination: {
                        ToAddresses: [claims.email],
                    },
                    Content: {
                        Simple: {
                            Subject: {
                                Data: `${code} is your Propagate pin code`,
                            },
                            Body: {
                                Html: {
                                    Data: emailHTML,
                                },
                            },
                        },
                    },
                };

                await ses.send(new SendEmailCommand(emailParams));
            },
            request: async (req, state, _form, error) => {
                const headers = req.headers;
                const referrer = headers.get("Referer");
                const url = new URL(referrer || "");
                url.pathname = `/login/${state.type}`;
                if (error) {
                    url.searchParams.set("error", error.type);
                }

                return new Response(null, {
                    status: 302,
                    headers: {
                        Location: url.toString(),
                    },
                });
            },
        }),
        google: GoogleOidcProvider({
            clientID: Resource.GoogleOAuthClientId.value,
            scopes: ["email", "profile", "openid"],
        }),
        // apple: AppleProvider({
        // 	clientID: Resource.AppleOAuthClientId.value,
        // 	scopes: ['email', 'profile', 'openid'],
        // }),
    },
    success: async (ctx, value) => {
        let user: UserModel.SubjectType | undefined;

        if (value.provider === "code") {
            const email = value.claims.email;
            user = await getOrCreateUser(email);
        } else if (value.provider === "google") {
            const payload = Schema.google.parse(value.id);
            console.log("Parsed Payload:", payload);
            const { email, name, picture: image } = payload;
            console.log("User Info:", { email, name, image });
            user = await getOrCreateUser(email, name, image);
        }

        if (!user) {
            throw new Error("Failed to get user");
        }

        return ctx.subject("user", {
            id: user.id,
            workspaceId: user.workspaceId,
            email: user.email,
        });
    },
});

export const handler = handle(app);
