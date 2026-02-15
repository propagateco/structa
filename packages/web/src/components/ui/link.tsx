import { Link, type LinkProps, useLocation } from '@tanstack/react-router';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import * as React from 'react';
import {
    StructaIcon,
    type structaIconColorVariants,
    type structaIconSizeVariants,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const pageLinkVariants = cva(
    'inline-flex items-center gap-1.5 font-medium transition-colors duration-300 cursor-pointer group [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'hover:text-accent',
                primary:
                    'text-primary hover:text-accent dark:hover:text-ds-powder',
                secondary: 'text-text-secondary hover:text-accent',
                muted: 'text-text-muted hover:text-accent',
            },
            size: {
                default: 'text-sm sm:text-base [&_svg]:size-4',
                xs: 'text-xs [&_svg]:size-3',
                sm: 'text-sm [&_svg]:size-4',
                lg: 'text-sm sm:text-base [&_svg]:size-4',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    }
);

export interface PageLinkProps
    extends LinkProps, VariantProps<typeof pageLinkVariants> {
    children: React.ReactNode;
    className?: string;
    arrowForward?: boolean;
    arrowBack?: boolean;
}

export const PageLink = React.forwardRef<HTMLAnchorElement, PageLinkProps>(
    (
        {
            variant,
            size,
            arrowForward,
            arrowBack,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const showForwardArrow = arrowForward;
        const showBackArrow = !arrowForward && arrowBack;

        return (
            <Link
                ref={ref}
                className={cn(pageLinkVariants({ variant, size, className }))}
                {...props}
            >
                {showBackArrow && (
                    <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
                )}
                <span>{children}</span>
                {showForwardArrow && (
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                )}
            </Link>
        );
    }
);
PageLink.displayName = 'PageLink';

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
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const HomeIconLink = React.forwardRef<
    HTMLAnchorElement,
    HomeIconLinkProps
>(({ className, variant, size, onClick, ...props }, ref) => {
    const location = useLocation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        onClick?.(e);
    };

    return (
        <Link
            to="/"
            className={cn(
                'flex items-center hover:opacity-80 transition-opacity cursor-pointer',
                className
            )}
            ref={ref}
            onClick={handleClick}
            {...props}
        >
            <StructaIcon size={size} variant={variant} />
        </Link>
    );
});
HomeIconLink.displayName = 'HomeIconLink';

/**
 * A link that scrolls to the top of the current page if we're already on that route,
 * instead of doing a no-op navigation.
 */
export interface ScrollToTopLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const ScrollToTopLink = React.forwardRef<
    HTMLAnchorElement,
    ScrollToTopLinkProps
>(({ to, className, onClick, children, ...props }, ref) => {
    const location = useLocation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (location.pathname === to) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        onClick?.(e);
    };

    return (
        <Link
            to={to}
            className={className}
            ref={ref}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    );
});
ScrollToTopLink.displayName = 'ScrollToTopLink';
