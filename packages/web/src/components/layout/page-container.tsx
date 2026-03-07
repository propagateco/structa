import { cn } from "@/lib/utils";

interface PageContainerProps {
	children: React.ReactNode;
	className?: string;
	/** Container width variant */
	size?: "narrow" | "wide" | "default";
}

export function PageContainer({
	children,
	className,
	size = "default",
}: PageContainerProps) {
	return (
		<div className="flex flex-1 flex-col items-center overflow-auto">
			{(() => {
				switch (size) {
					case "narrow":
						return (
							<NarrowResponsiveContainer className={className}>
								{children}
							</NarrowResponsiveContainer>
						);
					case "wide":
						return (
							<ResponsiveContainer className={className}>
								{children}
							</ResponsiveContainer>
						);
					case "default":
					default:
						return (
							<ResponsiveContainer className={className}>
								{children}
							</ResponsiveContainer>
						);
				}
			})()}
		</div>
	);
}

interface ResponsiveContainerProps {
	children: React.ReactNode;
	className?: string;
}

function ResponsiveContainer({
	children,
	className,
}: ResponsiveContainerProps) {
	return (
		<div
			className={cn(
				"w-full h-full p-4",
				"max-w-screen-xs sm:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-xl 2xl:max-w-screen-xl",
				className,
			)}
		>
			{children}
		</div>
	);
}

function NarrowResponsiveContainer({
	children,
	className,
}: ResponsiveContainerProps) {
	return (
		<div className={cn("w-full p-4 max-w-screen-md", className)}>
			{children}
		</div>
	);
}
