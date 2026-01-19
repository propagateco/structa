import React from 'react';
import { cn } from '@/lib/utils';

interface RichTextProps {
  children: React.ReactNode;
  className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'rich-text',
        '[&_h1]:font-heading [&_h1]:font-bold [&_h1]:mb-6',
        '[&_h2]:font-heading [&_h2]:font-bold [&_h2]:mb-4',
        '[&_h3]:font-heading [&_h3]:font-semibold [&_h3]:mb-3',
        '[&_p]:mb-4 [&_p]:leading-relaxed',
        '[&_strong]:font-semibold [&_strong]:text-foreground',
        '[&_a]:text-primary [&_a]:underline [&_a]:hover:no-underline',
        '[&>*:last-child]:mb-0',
        className
      )}
    >
      {children}
    </div>
  );
};
