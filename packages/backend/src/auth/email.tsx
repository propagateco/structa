import type { SendEmailCommandInput } from "@aws-sdk/client-sesv2";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { render } from "@react-email/components";
import { desc, eq } from "drizzle-orm";
import { Resource } from "sst";
import { verification } from "../../../core/src/auth/auth.sql";
import { db } from "../../../core/src/drizzle";

import { VerifyEmail } from "../../../notifications/emails/VerifyEmail";

const ses = new SESv2Client();

type OTPType = "sign-in" | "email-verification" | "forget-password";
type SendOTPProps = {
	email: string;
	otp: string;
	type: OTPType;
};

export async function sendVerificationOTP({ email, otp, type }: SendOTPProps) {
	console.log("Sending code: ", otp, "to email: ", email, "for type: ", type);
	console.log(Resource.AuthEmail.sender);
	const sender = "Structa <auth@" + Resource.AuthEmail.sender + ">";
	console.log("Sender: ", sender);

	// Query verification table for location data
	let location: { city: string; country: string } | null = null;

	try {
		// Find the most recent verification record for this email
		const verificationRecords = await db
			.select()
			.from(verification)
			.where(eq(verification.identifier, `sign-in-otp-${email}`))
			.orderBy(desc(verification.createdAt))
			.limit(1);

		if (verificationRecords[0]?.city && verificationRecords[0]?.country) {
			location = {
				city: verificationRecords[0].city,
				country: verificationRecords[0].country,
			};
			console.log(
				`Email location enrichment: ${location.city}, ${location.country}`,
			);
		}
	} catch (error) {
		console.warn("Failed to fetch verification location:", error);
	}

	let emailHTML: string;
	let subject: string;

	if (type === "sign-in") {
		emailHTML = await render(
			VerifyEmail({ type: type, validationCode: otp, location }),
			{
				pretty: true,
			},
		);
		subject = `${otp} - Structa Sign-in Verification`;
	} else if (type === "email-verification") {
		emailHTML = await render(
			VerifyEmail({ type: type, validationCode: otp, location }),
			{
				pretty: true,
			},
		);
		subject = `${otp} - Structa Sign-up Verification`;
	} else if (type === "forget-password") {
		throw new Error(`Unsupported OTP type: ${type}`);
	} else {
		throw new Error(`Unsupported OTP type: ${type}`);
	}

	const emailParams: SendEmailCommandInput = {
		FromEmailAddress: sender,
		Destination: {
			ToAddresses: [email],
		},
		Content: {
			Simple: {
				Subject: {
					Data: subject,
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
}
