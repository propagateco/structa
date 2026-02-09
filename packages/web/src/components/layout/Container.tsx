import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'default' | 'full' | 'narrow';
}

export const Container: React.FC<ContainerProps> = ({
    children,
    className,
    size = 'default',
}) => {
    const sizeClasses = {
        default: 'max-w-[1100px] mx-auto px-3 sm:px-4 md:px-8',
        full: 'max-w-[1100px] h-full px-3 sm:px-4 md:px-8 flex items-center justify-between mx-3 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-auto',
        narrow: 'max-w-[900px]',
    };

    return (
        <div className="w-full h-full">
            <div className={cn(sizeClasses[size], className)}>{children}</div>
        </div>
    );
};
