import { StructaIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
	className?: string;
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
					<StructaIcon size="default" variant="muted" />
				</div>
				<p className="text-md font-medium text-muted-foreground max-w-sm text-center mt-5">
					Setting up your workspace...
				</p>
			</div>
		</div>
	);
}
