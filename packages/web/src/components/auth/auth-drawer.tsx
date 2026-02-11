import { useEffect, useState } from "react";

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

// TODO: Implement in subsequent task
interface AuthDrawerInitialViewProps {
	onEmailSent: (email: string) => void;
	onSuccess: () => void;
}

function AuthDrawerInitialView({
	onEmailSent,
	onSuccess,
}: AuthDrawerInitialViewProps) {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-sm text-muted-foreground">
				TODO: Implement AuthDrawerInitialView with social login forms
			</p>
		</div>
	);
}

// TODO: Implement in subsequent task
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
		<div className="flex flex-col gap-2">
			<p className="text-sm text-muted-foreground">
				TODO: Implement AuthDrawerVerifyView with verification form
			</p>
		</div>
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

				<div className="px-4 pb-4">
					{view === "initial" && (
						<AuthDrawerInitialView
							onEmailSent={handleEmailSent}
							onSuccess={handleSuccess}
						/>
					)}

					{view === "verify" && email && (
						<AuthDrawerVerifyView
							email={email}
							onBack={handleBack}
							onSuccess={handleSuccess}
						/>
					)}
				</div>

				<DrawerClose />
			</DrawerContent>
		</Drawer>
	);
}
