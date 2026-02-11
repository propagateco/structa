import { useState } from "react";

import { AuthDrawerInitialView } from "@/components/auth/auth-drawer-initial-view";
import { AuthDrawerVerifyView } from "@/components/auth/auth-drawer-verify-view";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export interface AuthDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	title?: string;
	description?: React.ReactNode;
	showLegalLinks?: boolean;
}

/**
 * AuthDrawer - A reusable authentication drawer component
 *
 * Manages two views: 'initial' (social login + email input) and 'verify' (code verification)
 * Transitions between views with fade+slide animations (300ms)
 *
 * @example
 * // Landing page example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <AuthDrawer
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Start Your Free Account"
 *   description="Join thousands of home renovators..."
 *   onSuccess={() => console.log('User authenticated!')}
 * />
 * <Button onClick={() => setOpen(true)}>Sign Up</Button>
 * ```
 *
 * @example
 * // Pricing page example
 * ```tsx
 * <AuthDrawer
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Start Your Pro Trial"
 *   description="14 days free, no credit card required"
 *   onSuccess={() => navigate('/dashboard')}
 * />
 * ```
 *
 * @example
 * // Blog/gated content example (minimal)
 * ```tsx
 * <AuthDrawer
 *   open={drawerOpen}
 *   onOpenChange={setDrawerOpen}
 *   onSuccess={handleAuthSuccess}
 *   showLegalLinks={false}
 * />
 * ```
 */
export function AuthDrawer({
	open,
	onOpenChange,
	onSuccess,
	title,
	description,
	showLegalLinks = true,
}: AuthDrawerProps) {
	const [view, setView] = useState<"initial" | "verify">("initial");
	const [email, setEmail] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Reset state when drawer closes
	if (!open && (view !== "initial" || email !== null)) {
		setView("initial");
		setEmail(null);
		setIsLoading(false);
	}

	const handleEmailSent = (emailAddress: string) => {
		setEmail(emailAddress);
		setView("verify");
	};

	const handleBack = () => {
		setView("initial");
		setEmail(null);
	};

	const handleSuccess = () => {
		if (onSuccess) {
			onSuccess();
		}
		onOpenChange(false);
		// Reset state after successful auth
		setView("initial");
		setEmail(null);
		setIsLoading(false);
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					{title && <DrawerTitle>{title}</DrawerTitle>}
					{description && <DrawerDescription>{description}</DrawerDescription>}
					{!description && showLegalLinks && (
						<DrawerDescription>
							By continuing, you agree to our{" "}
							<a
								href="/terms"
								className="underline underline-offset-4 hover:text-primary"
							>
								Terms
							</a>{" "}
							and{" "}
							<a
								href="/privacy"
								className="underline underline-offset-4 hover:text-primary"
							>
								Privacy Policy
							</a>
						</DrawerDescription>
					)}
				</DrawerHeader>

				{/* View Container with fade+slide animations */}
				<div className="relative overflow-hidden">
					{/* Initial View */}
					<div
						className={cn(
							"transition-all duration-300 ease-in-out",
							view === "initial"
								? "translate-x-0 opacity-100"
								: "-translate-x-full opacity-0 absolute inset-0",
						)}
					>
						<AuthDrawerInitialView onEmailSent={handleEmailSent} />
					</div>

					{/* Verify View */}
					<div
						className={cn(
							"transition-all duration-300 ease-in-out",
							view === "verify"
								? "translate-x-0 opacity-100"
								: "translate-x-full opacity-0 absolute inset-0",
						)}
					>
						{email && (
							<AuthDrawerVerifyView
								email={email}
								onBack={handleBack}
								onSuccess={handleSuccess}
							/>
						)}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
