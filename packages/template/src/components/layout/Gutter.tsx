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
        leftGutter && 'pl-8',
        rightGutter && 'pr-8',
        disableMobile && 'max-md:px-4',
        className
      )}
    >
      {children}
    </div>
  );
};
