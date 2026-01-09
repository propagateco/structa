import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import { DiamondCorner } from './DiamondCorner';

interface GridBackgroundSectionProps {
    children: React.ReactNode;
    className?: string;
    showTopDivider?: boolean;
    showBottomDivider?: boolean;
    showDiamonds?: boolean;
    showGridBackground?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'hero' | 'content';
}

export const GridBackgroundSection: React.FC<GridBackgroundSectionProps> = ({
    children,
    className,
    showTopDivider = true,
    showBottomDivider = true,
    showDiamonds = true,
    showGridBackground = true,
    padding = 'md',
    variant = 'content',
}) => {
    const patternId = useId();

    const variantClasses = {
        hero: 'bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5',
        content:
            'bg-gradient-to-b from-blue-100/10 via-amber-50/40 to-blue-500/[0.03] dark:from-blue-900/[0.03] dark:via-transparent dark:to-blue-800/[0.02]',
    };

    const paddingClasses = {
        none: '',
        sm: 'px-4 py-8',
        md: 'px-4 py-12 sm:px-6 md:py-20',
        lg: 'px-6 py-16 sm:px-8 md:py-24',
    };

    return (
        <section
            className={cn(
                'relative w-full',
                showTopDivider &&
                    'before:absolute before:top-0 before:-left-[100vw] before:[z-index:-1] before:h-px before:w-[200vw] before:bg-blue-200/50 dark:before:bg-blue-300/[0.08]',
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
                    'relative px-4 py-12 sm:px-6 md:py-20',
                    variantClasses[variant]
                )}
            >
                {/* Grid Background SVG Pattern - matches zed.dev exactly with fade mask */}
                {showGridBackground && (
                    <svg
                        className={cn(
                            'pointer-events-none absolute inset-0 [z-index:-1] size-full',
                            'fill-blue-500/50 stroke-blue-500/50',
                            'opacity-[.30] dark:opacity-[.15]'
                        )}
                        aria-hidden="true"
                        style={{
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
                <div className="mx-auto max-w-[1400px] relative z-10">
                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-0">
                        {children}
                    </div>
                </div>
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
                <div className="absolute bottom-0 -left-[100vw] [z-index:-1] h-px w-[200vw] bg-blue-200/50 dark:bg-blue-300/[0.08]" />
            )}
        </section>
    );
};
