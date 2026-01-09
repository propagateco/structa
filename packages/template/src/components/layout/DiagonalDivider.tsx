import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import { DiamondCorner } from './DiamondCorner';

interface DiagonalDividerProps {
  className?: string;
  showDiamonds?: boolean;
}

/**
 * Diagonal slash divider - matches zed.dev's #divider-slash element
 * Creates a section break with diagonal hatching pattern and diamond corners
 */
export const DiagonalDivider: React.FC<DiagonalDividerProps> = ({
  className,
  showDiamonds = true,
}) => {
  const patternId = useId();

  return (
    <section
      className={cn(
        'relative h-4 w-full',
        // Top horizontal line (full viewport width)
        'before:absolute before:top-0 before:-left-[100vw] before:[z-index:-1] before:h-px before:w-[200vw] before:bg-blue-200/50 dark:before:bg-blue-300/8',
        // Bottom horizontal line (full viewport width)
        'after:absolute after:bottom-0 after:-left-[100vw] after:[z-index:-1] after:h-px after:w-[200vw] after:bg-blue-200/50 dark:after:bg-blue-300/8',
        className
      )}
    >
      {/* Diamond corners */}
      {showDiamonds && (
        <>
          <DiamondCorner position="top-left" />
          <DiamondCorner position="top-right" />
          <DiamondCorner position="bottom-left" />
          <DiamondCorner position="bottom-right" />
        </>
      )}

      {/* Diagonal lines SVG pattern */}
      <svg
        className={cn(
          'pointer-events-none absolute inset-0 [z-index:-1] size-full select-none',
          'text-blue-300 dark:text-blue-400/10',
          'py-[1px] !opacity-30 dark:!opacity-60'
        )}
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
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </section>
  );
};
