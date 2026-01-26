import { cn } from "@/lib/utils";

interface LoadingScreenProps {
	className?: string;
}

// Inline SVG logo component for faster loading
function Logo({ className }: { className?: string }) {
	return (
		<svg
			width="93"
			height="53"
			viewBox="0 0 93 53"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M3 34.8488C12.3163 56.6712 22.8509 56.0943 31.9522 34.8488C49.2949 -8.94959 71.7257 -8.94959 90 34.8488H3Z"
				stroke="currentColor"
				strokeWidth="3"
			/>
		</svg>
	);
}

export function LoadingScreen({ className }: LoadingScreenProps = {}) {
	return (
		<div
			className={cn(
				"flex min-h-screen items-center justify-center bg-background",
				className,
			)}
		>
			<div className="flex flex-col items-center">
				<div className="animate-pulse">
					<Logo className="opacity-60 w-auto h-8 dark:invert mb-5" />
				</div>
				<p className="text-md font-medium text-text-muted max-w-sm text-center mb-8">
					Setting up your workspace...
				</p>
			</div>
		</div>
	);
}
