import React from 'react';
import { cn } from '@/lib/utils';
import { DiamondCorner } from './DiamondCorner';

interface GridBackgroundSectionProps {
  children: React.ReactNode;
  className?: string;
  showTopDivider?: boolean;
  showBottomDivider?: boolean;
  showDiamonds?: boolean;
  /** Use 'hero' for top-of-page blue gradient, 'content' for mid-page sections */
  variant?: 'hero' | 'content';
}

/**
 * Grid background section - matches zed.dev's schematic design
 * Uses gradient backgrounds with blue tones and optional diamond corners
 */
export const GridBackgroundSection: React.FC<GridBackgroundSectionProps> = ({
  children,
  className,
  showTopDivider = true,
  showBottomDivider = true,
  showDiamonds = true,
  variant = 'content',
}) => {
  // Match zed.dev's gradient classes
  const variantClasses = {
    // Hero section: bg-linear-to-t from-blue-100/20 dark:from-blue-900/5
    hero: 'bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5',
    // Content section: via-cream-50/40 bg-linear-to-b from-blue-100/10 to-blue-500/3 dark:from-blue-900/3 dark:via-transparent dark:to-blue-800/2
    content: 'bg-gradient-to-b from-blue-100/10 via-amber-50/40 to-blue-500/[0.03] dark:from-blue-900/[0.03] dark:via-transparent dark:to-blue-800/[0.02]',
  };

  return (
    <section
      className={cn(
        'relative w-full',
        // Top horizontal line (full viewport width) - matches zed.dev's before pseudo
        showTopDivider && 'before:absolute before:top-0 before:-left-[100vw] before:[z-index:-1] before:h-px before:w-[200vw] before:bg-blue-200/50 dark:before:bg-blue-300/[0.08]',
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
        {/* Content Container - full width with centered content */}
        <div className="mx-auto max-w-[1400px] px-4 relative z-10">
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
