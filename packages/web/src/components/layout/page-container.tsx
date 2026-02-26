import { cn } from "@/lib/utils";

export function PageContainer({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className="flex flex-col items-center h-full w-full">
			<div className={cn("w-full h-full p-4 max-w-screen-xl", className)}>
				{children}
			</div>
		</div>
	);
}
