import React from 'react';
import { cn } from '@/lib/utils';

interface GutterProps {
  children: React.ReactNode;
  className?: string;
  leftGutter?: boolean;
  rightGutter?: boolean;
  disableMobile?: boolean;
}

export const Gutter: React.FC<GutterProps> = ({
  children,
  className,
  leftGutter = true,
  rightGutter = true,
  disableMobile = false,
}) => {
  return (
    <div
      className={cn(
        'relative',
        leftGutter && 'pl-8',
        rightGutter && 'pr-8',
        disableMobile && 'max-md:px-4',
        className
      )}
    >
      {/* Noise Texture Overlay - matches zed.dev's pattern */}
      <div
        className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.035] dark:opacity-[0.012] [z-index:0] opacity-[.03]!"
        style={{
          backgroundImage: `url('/noise.png')`,
        }}
      />
      {children}
    </div>
  );
};
