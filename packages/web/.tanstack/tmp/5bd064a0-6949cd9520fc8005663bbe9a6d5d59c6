import { createFileRoute } from "@tanstack/react-router";
import { LoginAppleForm } from "@/components/auth/login-apple-form";
import { LoginCodeForm } from "@/components/auth/login-code-form";
import { LoginGoogleForm } from "@/components/auth/login-google-form";
import { Divider } from "@/components/layout/divider";
import { StructaIcon } from "@/components/ui/icons";

export const Route = createFileRoute("/_login/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background text-foreground p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col items-start gap-2">
							<div className="mb-10">
								<a href="https://structa.so">
									<StructaIcon size="sm" mode="light" />
								</a>
							</div>
							<h1 className="text-2xl font-bold">Welcome to Structa</h1>
							<h2 className="text-lg font-semibold text-text-muted">
								Get started with the simplest way to create a fitness app.
							</h2>
						</div>

						<LoginCodeForm />

						<Divider text="Or" />

						<div className="grid gap-4 sm:grid-cols-2">
							<LoginAppleForm />
							<LoginGoogleForm />
						</div>
					</div>

					<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium [&_a]:transition-colors [&_a]:ease-in-out [&_a]:duration-200 hover:[&_a]:text-accent">
						By clicking continue, you agree to our{" "}
						<a href="https://structa.so/terms-of-service">Terms of Service</a>{" "}
						and <a href="https://structa.so/privacy-policy">Privacy Policy</a>.
					</div>
				</div>
			</div>
		</div>
	)
}
