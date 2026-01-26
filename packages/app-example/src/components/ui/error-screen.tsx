import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorScreenProps {
	className?: string;
	onRetry?: () => void;
}

export function ErrorScreen({ className, onRetry }: ErrorScreenProps = {}) {
	return (
		<div
			className={cn(
				"flex min-h-screen items-center justify-center bg-background",
				className,
			)}
		>
			<div className="flex flex-col items-center">
				<img
					src="/logo/outline/logo-light-sm.svg"
					alt="Structa"
					className="opacity-60 w-auto h-8 dark:invert mb-5"
				/>
				<p className="text-md font-medium text-muted-foreground max-w-sm text-center mb-8">
					Something went wrong. Please try again or contact support if the
					problem persists.
				</p>
				<div className="flex flex-row items-center gap-3">
					<Button size="sm" onClick={onRetry}>
						Retry
					</Button>
					<a
						href="mailto:support@structa.so"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button variant="outline" size="sm">
							Contact Support
						</Button>
					</a>
				</div>
			</div>
		</div>
	);
}
