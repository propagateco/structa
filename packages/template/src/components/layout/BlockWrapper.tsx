import React from 'react';
import { cn } from '@/lib/utils';

export interface PaddingProps {
  top?: 'small' | 'large' | 'hero';
  bottom?: 'small' | 'large';
}

interface BlockWrapperProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
  padding?: PaddingProps;
  hero?: boolean;
  hideBackground?: boolean;
}

const paddingClasses = {
  top: {
    small: 'pt-12',
    large: 'pt-24',
    hero: 'pt-32',
  },
  bottom: {
    small: 'pb-12',
    large: 'pb-24',
  },
};

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  children,
  className,
  theme = 'light',
  padding,
  hero = false,
  hideBackground = false,
}) => {
  return (
    <div
      className={cn(
        'relative',
        hero && 'min-h-screen',
        theme === 'dark' && 'bg-gray-950 text-white',
        theme === 'light' && 'bg-white text-gray-900',
        padding?.top && paddingClasses.top[padding.top],
        padding?.bottom && paddingClasses.bottom[padding.bottom],
        hideBackground && 'bg-transparent',
        className
      )}
      data-theme={theme}
    >
      {children}
    </div>
  );
};
