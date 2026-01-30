import * as React from 'react';
import { Link, type LinkProps } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';
import {
    StructaIcon,
    structaIconColorVariants,
    structaIconSizeVariants,
} from '@/components/ui/icons';

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
                    'flex items-center text-primary hover:text-accent dark:hover:text-accent cursor-pointer group',
                    className
                )}
                ref={ref}
                {...props}
            >
                <span className=" text-sm font-medium">{children}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
        );
    }
);
ArrowLink.displayName = 'ArrowLink';

export interface HomeIconLinkProps
    extends
        Omit<LinkProps, 'to'>,
        VariantProps<typeof structaIconColorVariants>,
        VariantProps<typeof structaIconSizeVariants> {
    className?: string;
}

export const HomeIconLink = React.forwardRef<
    HTMLAnchorElement,
    HomeIconLinkProps
>(({ className, variant, size, ...props }, ref) => {
    return (
        <Link
            to="/"
            className={cn(
                'flex items-center hover:opacity-80 transition-opacity cursor-pointer',
                className
            )}
            ref={ref}
            {...props}
        >
            <StructaIcon size={size} variant={variant} />
        </Link>
    );
});
HomeIconLink.displayName = 'HomeIconLink';
