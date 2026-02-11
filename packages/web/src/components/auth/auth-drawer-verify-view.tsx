import { VerifyCodeFormDrawer } from "@/components/auth/verify-code-form-drawer";

interface AuthDrawerVerifyViewProps {
	email: string;
	onBack: () => void;
	onSuccess: () => void;
}

/**
 * AuthDrawerVerifyView - Code verification view
 *
 * Renders verification form with email display and back button
 */
export function AuthDrawerVerifyView({
	email,
	onBack,
	onSuccess,
}: AuthDrawerVerifyViewProps) {
	return (
		<VerifyCodeFormDrawer email={email} onBack={onBack} onSuccess={onSuccess} />
	);
}
