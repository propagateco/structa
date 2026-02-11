import { LoginAppleForm } from "@/components/auth/login-apple-form";
import { LoginCodeForm } from "@/components/auth/login-code-form";
import { LoginGoogleForm } from "@/components/auth/login-google-form";
import { Separator } from "@/components/ui/separator";

interface AuthDrawerInitialViewProps {
	onEmailSent: (email: string) => void;
}

/**
 * AuthDrawerInitialView - Initial authentication view
 *
 * Renders social login buttons and email input form
 */
export function AuthDrawerInitialView({
	onEmailSent,
}: AuthDrawerInitialViewProps) {
	return (
		<div className="flex flex-col gap-4 px-4 pb-4">
			<LoginGoogleForm />
			<LoginAppleForm />
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">Or</span>
				</div>
			</div>
			<LoginCodeForm onEmailSent={onEmailSent} />
		</div>
	);
}
