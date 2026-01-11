import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const headerVariants = cva('font-serif text-primary', {
    variants: {
        size: {
            h1: 'text-4xl font-medium tracking-tight lg:text-5xl',
            h2: 'text-3xl font-medium tracking-tight lg:text-4xl',
            h3: 'text-2xl font-medium tracking-tight lg:text-3xl',
            h4: 'text-xl font-medium tracking-tight lg:text-2xl',
            h5: 'text-lg font-medium tracking-tight lg:text-xl',
            h6: 'text-base font-medium tracking-tight lg:text-lg',
        },
    },
    defaultVariants: {
        size: 'h1',
    },
});

export interface HeaderProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
        VariantProps<typeof headerVariants> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(
    ({ className, size, as, ...props }, ref) => {
        const Component = as || size || 'h1';
        return (
            <Component
                className={cn(headerVariants({ size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Header.displayName = 'Header';

export { Header, headerVariants };
