import React from 'react';
import { cn } from '@/lib/utils';

interface DiamondCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

/**
 * Diamond corner marker - matches zed.dev's schematic design
 * A small rotated square that marks section corners
 */
export const DiamondCorner: React.FC<DiamondCornerProps> = ({ position, className }) => {
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: '-3.5px', left: '-4.5px' },
    'top-right': { top: '-3.5px', right: '-4.5px' },
    'bottom-left': { bottom: '-3.5px', left: '-4.5px' },
    'bottom-right': { bottom: '-3.5px', right: '-4.5px' },
  };

  return (
    <div
      className={cn(
        'absolute z-10 size-2 rotate-45 rounded-[1px]',
        'border border-blue-200 dark:border-blue-300/20',
        'bg-white dark:bg-black',
        className
      )}
      style={positionStyles[position]}
    />
  );
};
