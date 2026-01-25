import * as React from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login/")({
	component: LoginComponent,
});

function LoginComponent() {
	const router = useRouter();
	const [email, setEmail] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "sign-in",
				fetchOptions: {
					onError: (ctx: any) => {
						toast.error(ctx.error.message || "Failed to send code");
					},
				},
			});

			if (result?.error) {
				toast.error(result.error.message || "Failed to send code");
				return;
			}

			toast.success("Code sent to your email!");
			router.navigate({ to: ("/login/code") as any, search: { email } as any });
		} catch (error) {
			toast.error("An error occurred. Please try again.");
			console.error("Login error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setIsGoogleLoading(true);
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/app",
				fetchOptions: {
					onError: (ctx: any) => {
						toast.error(ctx.error.message || "Google sign-in failed");
					},
				},
			});
		} catch (error) {
			toast.error("Google sign-in failed");
			console.error("Google sign-in error:", error);
		} finally {
			setIsGoogleLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
			<Card className="w-full max-w-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Enter your email to receive a login code
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isLoading}
							className="h-12"
						/>
					</div>

					<Button
						type="submit"
						className="w-full h-12 bg-teal-600 hover:bg-teal-700"
						disabled={isLoading || !email}
					>
						{isLoading ? "Sending..." : "Send Code"}
					</Button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Don't have an account?{" "}
						<button
							type="button"
							className="text-teal-600 hover:underline font-medium"
							onClick={() => toast.info("Sign up coming soon!")}
						>
							Sign up
						</button>
					</p>
				</div>

				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-gray-300 dark:border-gray-600" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					<Button
						type="button"
						variant="outline"
						className="w-full mt-4 h-12"
						onClick={handleGoogleSignIn}
						disabled={isGoogleLoading}
					>
						{isGoogleLoading ? (
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
						) : (
							<svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
								<title>Google</title>
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
						)}
						Google
					</Button>
				</div>

				<div className="mt-6 text-center">
					<Link to="/">
						<Button variant="ghost" className="text-sm text-gray-600 dark:text-gray-400">
							← Back to home
						</Button>
					</Link>
				</div>
			</Card>
		</div>
	);
}
