import * as React from 'react';
import { Link, type LinkProps } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ArrowLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
}

export const ArrowLink = React.forwardRef<HTMLAnchorElement, ArrowLinkProps>(
    ({ to, className, children, ...props }, ref) => {
        return (
            <Link
                to={to}
                className={cn(
                    'flex items-center text-primary dark:text-ds-powder hover:text-link cursor-pointer group',
                    className
                )}
                ref={ref}
                {...props}
            >
                <span className="text-link text-sm font-medium">
                    {children}
                </span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
        );
    }
);
ArrowLink.displayName = 'ArrowLink';
