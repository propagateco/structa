import type * as React from "react";
import { useEffect, useState } from "react";
import { LoginAppleForm } from "@/components/auth/login-apple-form";
import { LoginCodeForm } from "@/components/auth/login-code-form";
import { LoginGoogleForm } from "@/components/auth/login-google-form";
import { VerifyCodeFormDrawer } from "@/components/auth/verify-code-form-drawer";
import { Divider } from "@/components/layout/divider";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

/**
 * AuthDrawer Component
 *
 * A reusable authentication drawer with fade+slide animations between initial and verification views.
 * Designed for use across marketing pages to provide a seamless authentication experience without
 * navigating away from the current page.
 *
 * @example
 * ```tsx
 * <AuthDrawer
 *   open={drawerOpen}
 *   onOpenChange={setDrawerOpen}
 *   onSuccess={() => console.log('User authenticated')}
 *   title="Sign up to continue reading"
 *   description="By clicking continue, you agree to our Terms and Privacy Policy."
 *   showLegalLinks={true}
 * />
 * ```
 */
export interface AuthDrawerProps {
	/** Whether the drawer is open */
	open: boolean;
	/** Callback when drawer open state changes */
	onOpenChange: (open: boolean) => void;
	/** Callback when authentication succeeds */
	onSuccess?: () => void;
	/** Optional title to display */
	title?: string;
	/** Optional description or custom content */
	description?: React.ReactNode;
	/** Whether to show legal links (Terms/Privacy) in description */
	showLegalLinks?: boolean;
}

type ViewType = "initial" | "verify";

export function AuthDrawer({
	open,
	onOpenChange,
	onSuccess,
	title = "Sign up to continue reading for free",
	description,
	showLegalLinks = true,
}: AuthDrawerProps) {
	// View state: 'initial' shows social login + email form, 'verify' shows code verification
	const [view, setView] = useState<ViewType>("initial");
	// Email state to pass between views
	const [email, setEmail] = useState<string | null>(null);
	// Loading state for verification
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Reset state when drawer closes
	 */
	useEffect(() => {
		if (!open) {
			// Small delay to allow animations to complete before resetting
			const timeoutId = setTimeout(() => {
				setView("initial");
				setEmail(null);
				setIsLoading(false);
			}, 300);
			return () => clearTimeout(timeoutId);
		}
	}, [open]);

	/**
	 * Handle email submission from LoginCodeForm
	 * Transitions to verify view with the submitted email
	 */
	const handleEmailSent = (submittedEmail: string) => {
		setEmail(submittedEmail);
		setView("verify");
	};

	/**
	 * Handle successful code verification
	 * Closes drawer and calls onSuccess callback
	 */
	const handleVerificationSuccess = () => {
		setIsLoading(true);
		// Small delay to ensure session is updated
		setTimeout(() => {
			onOpenChange(false);
			onSuccess?.();
		}, 300);
	};

	/**
	 * Handle back button in verify view
	 * Returns to initial view
	 */
	const handleBack = () => {
		setView("initial");
		setEmail(null);
	};

	/**
	 * Default description with Terms/Privacy links
	 */
	const defaultDescription = (
		<p className="text-sm text-balance text-center">
			By clicking continue, you agree to our{" "}
			<a
				href="/terms-of-service"
				className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
			>
				Terms of Service
			</a>{" "}
			and{" "}
			<a
				href="/privacy-policy"
				className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
			>
				Privacy Policy
			</a>
			.
		</p>
	);

	const descriptionToShow =
		description || (showLegalLinks ? defaultDescription : null);

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<div className="px-lg mx-auto max-w-md md:max-w-xl">
					<DrawerHeader className="space-y-3">
						<DrawerTitle className="font-heading font-light text-4xl text-center">
							{view === "initial" ? title : "Enter your code"}
						</DrawerTitle>
						<DrawerDescription>
							{view === "initial" ? (
								descriptionToShow
							) : (
								<p className="text-sm text-balance text-center">
									Enter the 6-digit code sent to{" "}
									<span className="font-medium">{email}</span>
								</p>
							)}
						</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter className="mx-auto max-w-sm md:max-w-md">
						<div className="flex flex-col gap-4 md:gap-5">
							{/* Initial View: Social login + email form */}
							<ViewContainer isActive={view === "initial"} direction="left">
								<div className="flex flex-col gap-3">
									<LoginGoogleForm />
									<LoginAppleForm />
								</div>
								<Divider text="Or" />
								<LoginCodeForm onEmailSent={handleEmailSent} />
							</ViewContainer>

							{/* Verify View: Code entry with email context */}
							<ViewContainer isActive={view === "verify"} direction="right">
								{email && (
									<VerifyCodeFormDrawer
										email={email}
										onBack={handleBack}
										onSuccess={handleVerificationSuccess}
									/>
								)}
							</ViewContainer>

							<DrawerClose asChild>
								<Button variant="ghost" className="text-text-muted my-3">
									Close
								</Button>
							</DrawerClose>
						</div>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

/**
 * ViewContainer - Handles fade+slide animations between views
 *
 * @param isActive - Whether this view is currently visible
 * @param direction - 'left' for initial view (slides left on exit), 'right' for verify view (slides from right on enter)
 */
interface ViewContainerProps {
	isActive: boolean;
	direction: "left" | "right";
	children: React.ReactNode;
}

function ViewContainer({ isActive, direction, children }: ViewContainerProps) {
	return (
		<div
			className={`
                transition-all duration-300 ease-in-out
                ${
									isActive
										? "translate-x-0 opacity-100"
										: direction === "left"
											? "-translate-x-full opacity-0"
											: "translate-x-full opacity-0"
								}
            `}
		>
			{children}
		</div>
	);
}
