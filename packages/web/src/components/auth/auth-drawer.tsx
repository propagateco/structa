import { useEffect, useState } from "react";

import { Divider } from "@/components/layout/divider";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { LoginAppleForm } from "./login-apple-form";
import { LoginCodeForm } from "./login-code-form";
import { LoginGoogleForm } from "./login-google-form";
import { VerifyCodeFormDrawer } from "./verify-code-form-drawer";

interface AuthDrawerInitialViewProps {
	onEmailSent: (email: string) => void;
}

function AuthDrawerInitialView({ onEmailSent }: AuthDrawerInitialViewProps) {
	return (
		<div className="flex flex-col gap-2">
			<LoginGoogleForm />
			<LoginAppleForm />
			<Divider text="Or" />
			<LoginCodeForm onEmailSent={onEmailSent} />
		</div>
	);
}

interface AuthDrawerVerifyViewProps {
	email: string;
	onBack: () => void;
	onSuccess: () => void;
}

function AuthDrawerVerifyView({
	email,
	onBack,
	onSuccess,
}: AuthDrawerVerifyViewProps) {
	return (
		<VerifyCodeFormDrawer email={email} onBack={onBack} onSuccess={onSuccess} />
	);
}

// TODO: Implement in subsequent task - Reusable description with Terms/Privacy links
function defaultDescription() {
	return (
		<p className="text-sm text-muted-foreground">
			By continuing, you agree to our{" "}
			<a href="/terms" className="text-foreground underline">
				Terms of Service
			</a>{" "}
			and{" "}
			<a href="/privacy" className="text-foreground underline">
				Privacy Policy
			</a>
		</p>
	);
}

export interface AuthDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	title?: string;
	description?: React.ReactNode;
	showLegalLinks?: boolean;
}

type ViewState = "initial" | "verify";

export function AuthDrawer({
	open,
	onOpenChange,
	onSuccess,
	title = "Sign In",
	description,
	showLegalLinks = false,
}: AuthDrawerProps) {
	// Internal state for view transitions
	const [view, setView] = useState<ViewState>("initial");
	const [email, setEmail] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Reset state when drawer closes
	useEffect(() => {
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

	const handleBack = () => {
		setView("initial");
		setEmail(null);
	};

	const handleSuccess = () => {
		setIsLoading(true);
		// Give auth session a moment to update
		setTimeout(() => {
			onSuccess?.();
			onOpenChange(false);
		}, 300);
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="max-w-md mx-auto">
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					{description || (showLegalLinks && defaultDescription())}
				</DrawerHeader>

				<div className="px-4 pb-4 relative overflow-hidden">
					{/* Initial View - slides left when transitioning to verify */}
					<div
						className={`absolute inset-0 transition-all duration-300 ease-in-out ${
							view === "initial"
								? "translate-x-0 opacity-100"
								: "-translate-x-full opacity-0"
						}`}
					>
						<AuthDrawerInitialView onEmailSent={handleEmailSent} />
					</div>

					{/* Verify View - slides in from right when view is verify */}
					{email && (
						<div
							className={`absolute inset-0 transition-all duration-300 ease-in-out ${
								view === "verify"
									? "translate-x-0 opacity-100"
									: "translate-x-full opacity-0"
							}`}
						>
							<AuthDrawerVerifyView
								email={email}
								onBack={handleBack}
								onSuccess={handleSuccess}
							/>
						</div>
					)}
				</div>

				<DrawerClose />
			</DrawerContent>
		</Drawer>
	);
}
