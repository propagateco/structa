import React from 'react';
import { cn } from '@/lib/utils';
import { DiamondCorner } from './DiamondCorner';

interface HorizontalDividerProps {
    className?: string;
    showDiamonds?: boolean;
}

/**
 * Simple horizontal divider - matches zed.dev's #divider-main element
 * A single horizontal line spanning full viewport width with optional diamond corners
 */
export const HorizontalDivider: React.FC<HorizontalDividerProps> = ({
    className,
    showDiamonds = true,
}) => {
    return (
        <section
            className={cn(
                'relative',
                // Horizontal line (full viewport width)
                'before:absolute before:top-0 before:-left-[100vw] before:z-10 before:h-px before:w-[200vw] before:bg-ds-powder/50 dark:before:bg-ds-powder/[0.08]',
                className
            )}
        >
            {/* Diamond corners */}
            {showDiamonds && (
                <>
                    <DiamondCorner position="top-left" />
                    <DiamondCorner position="top-right" />
                </>
            )}
        </section>
    );
};
