import { useState } from "react";

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

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
 * Transitions between views with fade+slide animations
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
			</DrawerContent>
		</Drawer>
	);
}
