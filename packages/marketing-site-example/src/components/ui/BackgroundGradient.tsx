import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundGradientProps {
  className?: string;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'absolute top-0 left-0 right-0 pointer-events-none',
        className
      )}
      style={{
        height: '100vh',
        maxHeight: '800px',
        zIndex: -1,
        background: 'radial-gradient(ellipse at top, rgba(120, 119, 198, 0.15), transparent 50%)',
      }}
      aria-hidden="true"
    />
  );
};
