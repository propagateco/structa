import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DiamondCorner } from "@/components/layout/DiamondCorner";

export const Route = createFileRoute("/_auth/_onboarding")({
	component: LayoutComponent,
});

/**
 * Onboarding layout with square gutters along all edges.
 * Uses CSS Grid to create a frame effect similar to ui.sh
 * Grid structure:
 *   [padding] | 1px line | content | 1px line | [padding]
 *   with diamond corners at intersections
 */
function LayoutComponent() {
	return (
		<div className="fixed inset-0 overflow-hidden bg-background">
			{/*
                Grid layout: 5 cols × 5 rows
                - Column 1: left padding
                - Column 2: left gutter line (1px)
                - Column 3: main content
                - Column 4: right gutter line (1px)
                - Column 5: right padding

                Same pattern for rows (top padding, top line, content, bottom line, bottom padding)
            */}
			<div className="grid h-full grid-cols-[var(--padding)_1px_minmax(0,1fr)_1px_var(--padding)] grid-rows-[var(--padding)_1px_minmax(0,1fr)_1px_var(--padding)] [--padding:theme(spacing.4)] sm:[--padding:theme(spacing.10)]">
				{/* Top gutter line - spans all 5 columns */}
				<div className="relative col-span-5 col-start-1 row-start-2 bg-ds-powder/50 dark:bg-ds-powder/[0.08]" />

				{/* Bottom gutter line - spans all 5 columns */}
				<div className="relative col-span-5 col-start-1 row-start-4 bg-ds-powder/50 dark:bg-ds-powder/[0.08]" />

				{/* Left gutter line - spans all 5 rows */}
				<div className="relative col-start-2 row-span-5 row-start-1 bg-ds-powder/50 dark:bg-ds-powder/[0.08]" />

				{/* Right gutter line - spans all 5 rows */}
				<div className="relative col-start-4 row-span-5 row-start-1 bg-ds-powder/50 dark:bg-ds-powder/[0.08]" />

				{/*
                    Diamond corners at line intersections.
                    Each diamond is placed in a corner padding cell but positioned
                    at the inner corner (where the lines intersect).
                    Using OPPOSITE position values since we want the inner corners.
                */}
				<div className="relative col-start-1 row-start-1">
					<DiamondCorner position="bottom-right" />
				</div>
				<div className="relative col-start-5 row-start-1">
					<DiamondCorner position="bottom-left" />
				</div>
				<div className="relative col-start-1 row-start-5">
					<DiamondCorner position="top-right" />
				</div>
				<div className="relative col-start-5 row-start-5">
					<DiamondCorner position="top-left" />
				</div>

				{/* Main content area */}
				<main className="col-start-3 row-start-3 overflow-auto p-4 sm:p-10">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
