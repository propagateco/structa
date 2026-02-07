import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'default' | 'wide' | 'narrow';
}

export const Container: React.FC<ContainerProps> = ({
    children,
    className,
    size = 'default',
}) => {
    const sizeClasses = {
        default: 'max-w-[1100px]',
        wide: 'max-w-[1300px]',
        narrow: 'max-w-[900px]',
    };

    return (
        <div
            className={cn(
                'h-full mx-auto px-3 sm:px-4 md:px-8',
                sizeClasses[size],
                className
            )}
        >
            {children}
        </div>
    );
};
