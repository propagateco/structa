import type React from 'react';
import { cn } from '@/lib/utils';

interface TexturedDivProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Textured div with noise/grain overlay - matches zed.dev's schematic design
 * Renders as a relative positioned container with noise texture overlay
 * Functions as a normal div - accepts children and all standard div props
 */
export const TexturedDiv: React.FC<TexturedDivProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div className={cn('relative', className)} {...props}>
            {/* Noise texture overlay - absolute positioned, pointer-events-none */}
            <div
                className={
                    'pointer-events-none [z-index:0] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.035] dark:opacity-[0.012]'
                }
                style={{
                    backgroundImage: `url('/noise.png')`,
                }}
            />
            {/* Content - z-index ensures it sits above the noise texture */}
            {children && <div className="relative z-10">{children}</div>}
        </div>
    );
};
