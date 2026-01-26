import { cn } from "@/lib/utils";

export const BentoGrid = ({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 md:auto-rows-[15rem] lg:auto-rows-[15rem] xl:auto-rows-[25rem]",
				className,
			)}
		>
			{children}
		</div>
	);
};

export const BentoGridItem = ({
	className,
	title,
	description,
	content,
	icon,
}: {
	className?: string;
	title?: string | React.ReactNode;
	description?: string | React.ReactNode;
	content?: React.ReactNode;
	icon?: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-border bg-background p-4 transition duration-200",
				className,
			)}
		>
			{content}
			<div className="transition duration-200">
				{icon}
				<div className="mt-2 mb-2 font-sans font-bold text-foreground">
					{title}
				</div>
				<div className="font-sans text-xs font-normal text-muted-foreground">
					{description}
				</div>
			</div>
		</div>
	);
};
