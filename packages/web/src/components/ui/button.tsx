import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium hover:cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 transition-colors duration-300 ease-in-out',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground hover:bg-foreground',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                remove: 'border border-input bg-background text-text-secondary hover:bg-muted hover:text-text active:bg-muted',
                outline:
                    'bg-background hover:bg-foreground hover:text-primary-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-ds-powder/40 hover:text-primary dark:hover:bg-accent/20 dark:hover:text-text',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                xs: 'h-6 px-2 gap-1 text-xs [&_svg]:size-3 [&_svg]:shrink-0',
                sm: 'h-8 px-4',
                lg: 'h-11 px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading = false,
            icon,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button';

        // When using asChild, don't pass button-specific props like disabled
        const componentProps = asChild
            ? { className: cn(buttonVariants({ variant, size, className })) }
            : {
                  className: cn(buttonVariants({ variant, size, className })),
                  ref,
                  disabled: isLoading || props.disabled,
                  ...props,
              };

        return (
            <Comp {...componentProps}>
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <div className="[&>svg]:hidden">{children}</div>
                    </>
                ) : (
                    <>
                        {icon}
                        {children}
                    </>
                )}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
