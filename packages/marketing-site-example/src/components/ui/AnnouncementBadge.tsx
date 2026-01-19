import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementBadgeProps {
  label?: string;
  text: string;
  href?: string;
  className?: string;
}

export const AnnouncementBadge: React.FC<AnnouncementBadgeProps> = ({
  label,
  text,
  href,
  className,
}) => {
  const content = (
    <>
      <div className="flex items-center gap-2">
        {label && (
          <>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            <span className="font-semibold text-sm">{label}</span>
            <span className="text-sm text-muted-foreground">:</span>
          </>
        )}
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
      <ArrowRight className="w-4 h-4 ml-2 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </>
  );

  const baseClasses = cn(
    'inline-flex items-center gap-2 px-4 py-2',
    'border border-border rounded-full',
    'hover:border-primary/50 transition-colors',
    'group',
    className
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return <div className={baseClasses}>{content}</div>;
};
