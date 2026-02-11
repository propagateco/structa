import { Link } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";
import * as React from "react";
import { LoginAppleForm } from "@/components/auth/login-apple-form";
import { LoginCodeForm } from "@/components/auth/login-code-form";
import { LoginGoogleForm } from "@/components/auth/login-google-form";
import { VerifyCodeFormDrawer } from "@/components/auth/verify-code-form-drawer";
import { Divider } from "@/components/layout/divider";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	GatedDrawerContent,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

type View = "initial" | "verify";

interface AuthDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	title?: string;
	description?: React.ReactNode;
	showLegalLinks?: boolean;
	children?: React.ReactNode;
}

/**
 * AuthDrawer - A reusable authentication drawer with animated view transitions
 *
 * @example
 * ```tsx
 * // Landing page example
 * <AuthDrawer
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Start Your Free Account"
 *   description="Join thousands of home renovators..."
 *   onSuccess={() => console.log('Authenticated')}
 * >
 *   <Button>Get Started</Button>
 * </AuthDrawer>
 * ```
 *
 * @example
 * ```tsx
 * // Pricing page example
 * <AuthDrawer
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Start Your Pro Trial"
 *   description="14 days free, no credit card required"
 *   showLegalLinks={true}
 * >
 *   <Button>Start Trial</Button>
 * </AuthDrawer>
 * ```
 *
 * @example
 * ```tsx
 * // Guide/blog post example
 * <AuthDrawer
 *   open={drawerOpen}
 *   onOpenChange={setDrawerOpen}
 *   onSuccess={() => {
 *     console.log('User successfully authenticated');
 *   }}
 * >
 *   <Button>Continue Reading</Button>
 * </AuthDrawer>
 * ```
 */
export function AuthDrawer({
	open,
	onOpenChange,
	onSuccess,
	title,
	description,
	showLegalLinks = true,
	children,
}: AuthDrawerProps) {
	const [view, setView] = React.useState<View>("initial");
	const [email, setEmail] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	// Reset state when drawer closes
	React.useEffect(() => {
		if (!open) {
			setView("initial");
			setEmail(null);
			setIsLoading(false);
		}
	}, [open]);

	const handleEmailSent = (emailAddress: string) => {
		setEmail(emailAddress);
		setView("verify");
	};

	const handleVerificationSuccess = () => {
		setIsLoading(false);
		onSuccess?.();
		onOpenChange(false);
	};

	const handleBack = () => {
		setView("initial");
		setEmail(null);
	};

	const defaultDescription = showLegalLinks ? (
		<span className="text-sm text-balance text-center">
			By clicking continue, you agree to our{" "}
			<Link
				to="/terms-of-service"
				className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
			>
				Terms of Service
			</Link>{" "}
			and{" "}
			<Link
				to="/privacy-policy"
				className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
			>
				Privacy Policy
			</Link>
			.
		</span>
	) : null;

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			{children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
			<GatedDrawerContent>
				<div className="px-lg mx-auto max-w-md md:max-w-xl">
					<DrawerHeader className="space-y-3">
						<DrawerTitle className="font-heading font-light text-4xl text-center">
							{title || "Sign up to continue"}
						</DrawerTitle>
						<DrawerDescription>
							{description || defaultDescription}
						</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter className="mx-auto max-w-sm md:max-w-md">
						<div className="relative overflow-hidden min-h-[200px]">
							{/* Initial View */}
							<div
								className={cn(
									"absolute inset-0 flex flex-col gap-4 md:gap-5 transition-all duration-300 ease-in-out",
									view === "initial"
										? "translate-x-0 opacity-100"
										: "-translate-x-full opacity-0 pointer-events-none",
								)}
							>
								{/* Social login buttons */}
								<div className="flex flex-col gap-3">
									<LoginGoogleForm />
									<LoginAppleForm />
								</div>

								{/* Email form with callback */}
								<Divider text="Or" />
								<LoginCodeForm onEmailSent={handleEmailSent} />
							</div>

							{/* Verify View */}
							<div
								className={cn(
									"absolute inset-0 flex flex-col gap-4 md:gap-5 transition-all duration-300 ease-in-out",
									view === "verify"
										? "translate-x-0 opacity-100"
										: "translate-x-full opacity-0 pointer-events-none",
								)}
							>
								<VerifyCodeFormDrawer
									email={email || ""}
									onBack={handleBack}
									onSuccess={handleVerificationSuccess}
								/>
							</div>
						</div>

						<DrawerClose asChild>
							<Button variant="ghost" className="text-text-muted my-3">
								Close
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</GatedDrawerContent>
		</Drawer>
	);
}
