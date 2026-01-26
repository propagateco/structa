import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const gridVariants = cva("mx-auto grid max-w-7xl grid-cols-1", {
	variants: {
		cols: {
			3: "xs:grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6",
			4: "xs:grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6",
		},
		size: {
			none: "auto-rows-auto",
			xs: "auto-rows-[3rem] lg:auto-rows-[4rem] xl:auto-rows-[6rem] 2xl:auto-rows-[128px]",
			small: "auto-rows-[12rem] lg:auto-rows-[15rem] xl:auto-rows-[25rem]",
			medium: "auto-rows-[304px]",
			large: "auto-rows-[11rem] lg:auto-rows-[15rem] xl:auto-rows-[25rem]",
		},
	},
	defaultVariants: {
		cols: 3,
		size: "medium",
	},
});

export interface GridProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof gridVariants> {}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
	({ className, children, cols, size }, ref) => {
		return (
			<div ref={ref} className={cn(gridVariants({ cols, size }), className)}>
				{children}
			</div>
		);
	},
);

const cellVariants = cva(
	"block group/bento row-span-1 rounded-xl border border-border bg-background",
	{
		variants: {
			cols: {
				1: "col-span-1",
				2: "col-span-2",
				3: "col-span-3",
				4: "col-span-4",
				none: "hidden",
			},
			colsS: {
				1: "sm:col-span-1 sm:block",
				2: "sm:col-span-2 sm:block",
				3: "sm:col-span-3 sm:block",
				4: "sm:col-span-4 sm:block",
				none: "sm:hidden",
			},
			colsM: {
				1: "md:col-span-1 md:block",
				2: "md:col-span-2 md:block",
				3: "md:col-span-3 md:block",
				4: "md:col-span-4 md:block",
				none: "md:hidden",
			},
			colsL: {
				1: "lg:col-span-1 lg:block",
				2: "lg:col-span-2 lg:block",
				3: "lg:col-span-3 lg:block",
				4: "lg:col-span-4 lg:block",
				none: "lg:hidden",
			},
			colsXL: {
				1: "xl:col-span-1 xl:block",
				2: "xl:col-span-2 xl:block",
				3: "xl:col-span-3 xl:block",
				4: "xl:col-span-4 xl:block",
				none: "xl:hidden",
			},
			cols2XL: {
				1: "2xl:col-span-1 2xl:block",
				2: "2xl:col-span-2 2xl:block",
				3: "2xl:col-span-3 2xl:block",
				4: "2xl:col-span-4 2xl:block",
				none: "2xl:hidden",
			},
			rows: {
				1: "row-span-1",
				2: "row-span-2",
				3: "row-span-3",
				4: "row-span-4",
				none: "hidden",
			},
			rowsS: {
				1: "sm:row-span-1 sm:block",
				2: "sm:row-span-2 sm:block",
				3: "sm:row-span-3 sm:block",
				4: "sm:row-span-4 sm:block",
				none: "sm:hidden",
			},
			rowsM: {
				1: "md:row-span-1 md:block",
				2: "md:row-span-2 md:block",
				3: "md:row-span-3 md:block",
				4: "md:row-span-4 md:block",
				none: "md:hidden",
			},
			rowsL: {
				1: "lg:row-span-1 lg:block",
				2: "lg:row-span-2 lg:block",
				3: "lg:row-span-3 lg:block",
				4: "lg:row-span-4 lg:block",
				none: "lg:hidden",
			},
			rowsXL: {
				1: "xl:row-span-1 xl:block",
				2: "xl:row-span-2 xl:block",
				3: "xl:row-span-3 xl:block",
				4: "xl:row-span-4 xl:block",
			},
			rows2XL: {
				1: "2xl:row-span-1 2xl:block",
				2: "2xl:row-span-2 2xl:block",
				3: "2xl:row-span-3 2xl:block",
				4: "2xl:row-span-4 2xl:block",
				none: "2xl:hidden",
			},
		},
		defaultVariants: {
			cols: 1,
		},
	},
);

export interface CellProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cellVariants> {}

export const Cell = React.forwardRef<HTMLDivElement, CellProps>(
	(
		{
			className,
			children,
			cols,
			colsS,
			colsM,
			colsL,
			colsXL,
			cols2XL,
			rows,
			rowsM,
			rowsL,
			rowsXL,
			rows2XL,
		},
		ref,
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					cellVariants({
						cols,
						colsS,
						colsM,
						colsL,
						colsXL,
						cols2XL,
						rows,
						rowsM,
						rowsL,
						rowsXL,
						rows2XL,
					}),
					className,
				)}
			>
				{children}
			</div>
		);
	},
);
