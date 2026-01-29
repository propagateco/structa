import React from 'react';
import { cn } from '@/lib/utils';
import { DiamondCorner } from './DiamondCorner';
import { Container } from './Container';

interface GridBackgroundSectionProps {
    children: React.ReactNode;
    className?: string;
    showTopDivider?: boolean;
    showBottomDivider?: boolean;
    showDiamonds?: boolean;
    showGridBackground?: boolean;
    variant?: 'hero' | 'content';
}

export const GridBackgroundSection: React.FC<GridBackgroundSectionProps> = ({
    children,
    className,
    showTopDivider = true,
    showBottomDivider = true,
    showDiamonds = true,
    showGridBackground = true,
    variant = 'content',
}) => {
    const patternId = React.useId();

    const variantClasses = {
        hero: 'bg-gradient-to-t from-ds-azure/20 dark:from-ds-azure/20 py-12 md:py-0 md:py-12 md:pb-36',
        content:
            'bg-gradient-to-b from-ds-azure/10 via-ds-azure/40 to-ds-azure/[0.03] dark:from-ds-azure/[0.03] dark:via-transparent dark:to-ds-azure/10',
    };

    return (
        <section
            className={cn(
                'relative w-full',
                showTopDivider &&
                    'before:absolute before:top-0 before:-left-[100vw] before:z-10 before:h-px before:w-[200vw] before:bg-ds-powder/50 dark:before:bg-ds-powder/[0.08]',
                className
            )}
        >
            {/* Diamond corners at top */}
            {showDiamonds && (
                <>
                    <DiamondCorner position="top-left" />
                    <DiamondCorner position="top-right" />
                </>
            )}

            {/* Main content area with gradient background */}
            <div
                className={cn(
                    'relative py-12 md:py-20',
                    variantClasses[variant]
                )}
            >
                {/* Grid Background SVG Pattern */}
                {showGridBackground && (
                    <svg
                        className={cn(
                            'pointer-events-none absolute inset-0 z-0 size-full',
                            'text-accent',
                            'opacity-[.30] dark:opacity-[.25]'
                        )}
                        aria-hidden="true"
                        style={{
                            fill: 'currentColor',
                            stroke: 'currentColor',
                            maskImage:
                                variant === 'hero'
                                    ? 'linear-gradient(to top, black 40%, transparent 100%)'
                                    : 'linear-gradient(to bottom, transparent 10%, black 60%, transparent 100%)',
                            maskSize: '100% 100%',
                            maskRepeat: 'no-repeat',
                        }}
                    >
                        <defs>
                            <pattern
                                id={patternId}
                                width="12"
                                height="12"
                                patternUnits="userSpaceOnUse"
                                x="-1"
                                y="-1"
                            >
                                <path
                                    d="M.5 12V.5H12"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width="100%"
                            height="100%"
                            fill={`url(#${patternId})`}
                        />
                    </svg>
                )}

                {/* Content Container - full width with centered content */}
                <Container className="relative z-20">
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-0">
                        {children}
                    </div>
                </Container>
            </div>

            {/* Diamond corners at bottom */}
            {showDiamonds && (
                <>
                    <DiamondCorner position="bottom-left" />
                    <DiamondCorner position="bottom-right" />
                </>
            )}

            {/* Bottom horizontal line (full viewport width) */}
            {showBottomDivider && (
                <div className="absolute bottom-0 -left-[100vw] z-10 h-px w-[200vw] bg-ds-powder/50 dark:bg-ds-powder/[0.08]" />
            )}
        </section>
    );
};
