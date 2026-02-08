import React from 'react';
import { cn } from '@/lib/utils';

interface GridPatternProps {
    className?: string;
}

export const GridPattern: React.FC<GridPatternProps> = ({ className }) => {
    const patternId = React.useId();

    return (
        <svg
            className={cn(
                'pointer-events-none absolute inset-0 z-0 size-full',
                'opacity-[.30] dark:opacity-[.25]',
                className
            )}
            aria-hidden="true"
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
    );
};
