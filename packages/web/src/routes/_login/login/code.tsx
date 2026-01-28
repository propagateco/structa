import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { VerifyCodeForm } from "@/components/auth/verify-code-form";
import { Divider } from "@/components/layout/divider";
import { StructaIcon } from "@/components/ui/icons";

const searchSchema = z.object({
	email: z.string().email(),
});

export const Route = createFileRoute("/_login/login/code")({
	validateSearch: searchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { email } = Route.useSearch();

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6 items-center">
					<div className="flex flex-col items-start gap-2">
						<div className="mb-10">
							<a href="https://structa.so">
								<StructaIcon size="sm" mode="light" />
							</a>
						</div>
						<h1 className="text-2xl font-bold">Let&apos;s verify your email</h1>
						<h2 className="text-lg text-text-muted">
							If you have an account, we have sent a code to{" "}
							<span className="font-semibold">{email}</span>. Enter it below.{" "}
						</h2>
					</div>
					<VerifyCodeForm email={email} />
					<Divider />
					<div className="mt-6 text-center text-md text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							to="/login"
							search={{ email }}
							className="font-medium text-primary underline-offset-4 hover:underline"
						>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
