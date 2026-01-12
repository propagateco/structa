import { useId } from 'react';
import { cn } from '@/lib/utils';

interface DiagonalPatternProps {
    show?: boolean;
    className?: string;
    color?: string;
    transitionDuration?: number;
}

export const DiagonalPattern = ({
    show = true,
    className,
    color = 'text-ds-powder',
    transitionDuration = 2000
}: DiagonalPatternProps) => {
    const patternId = useId();

    return (
        <div
            className={cn(
                'absolute inset-0 pointer-events-none',
                className
            )}
        >
            <svg 
                className={cn('size-full transition-all ease-out', color)}
                style={{
                    opacity: show ? 0.5 : 0,
                    filter: show ? 'blur(0px)' : 'blur(4px)',
                    transitionDuration: `${transitionDuration}ms`
                }}
            >
                <defs>
                    <pattern
                        id={patternId}
                        width="4"
                        height="4"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                    >
                        <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </pattern>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill={`url(#${patternId})`}
                />
            </svg>
        </div>
    );
};
