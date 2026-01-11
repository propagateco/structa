import React from 'react';
import { cn } from '@/lib/utils';
import { DiamondCorner } from './DiamondCorner';
import { Container } from './Container';
import { Grid } from './Grid';

interface TexturedSectionProps {
    children: React.ReactNode;
    className?: string;
    showTopDivider?: boolean;
    showBottomDivider?: boolean;
    showTopDiamonds?: boolean;
    showBottomDiamonds?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    grainIntensity?: 'subtle' | 'light' | 'medium' | 'strong';
    bgColor?: string;
}

/**
 * Textured section with noise/grain overlay - matches zed.dev's schematic design
 * Uses a noise texture with configurable opacity for an architectural feel
 */
export const TexturedSection: React.FC<TexturedSectionProps> = ({
    children,
    className,
    showTopDivider = true,
    showBottomDivider = true,
    showTopDiamonds = false,
    showBottomDiamonds = false,
    padding = 'md',
    bgColor = 'bg-ds-paper dark:bg-gray-950',
}) => {
    const paddingClasses = {
        none: '',
        sm: 'px-4 py-8',
        md: 'px-4 py-12 sm:px-6 md:py-20',
        lg: 'px-6 py-16 sm:px-8 md:py-24',
    };

    return (
        <section
            className={cn(
                'relative w-full',
                // Top horizontal line (full viewport width)
                showTopDivider &&
                    'before:absolute before:top-0 before:-left-[100vw] before:z-10 before:h-px before:w-[200vw] before:bg-ds-powder/50 dark:before:bg-ds-powder/[0.08]',
                className
            )}
        >
            {/* Diamond corners at top */}
            {showTopDiamonds && (
                <>
                    <DiamondCorner position="top-left" />
                    <DiamondCorner position="top-right" />
                </>
            )}

            {/* Main Content Area */}
            <div className={cn('relative', paddingClasses[padding], bgColor)}>
                {/* Noise Texture Overlay */}
                <div
                    className={cn(
                        'pointer-events-none [z-index:0] absolute inset-0',
                        'bg-[size:180px] bg-repeat opacity-[0.035] dark:opacity-[0.012]'
                    )}
                    style={{
                        backgroundImage: `url('/noise.png')`,
                    }}
                />

                {/* Content Container */}
                <Container className="relative z-10">
                    <Grid showGrid={true} cols={4} smCols={4} mdCols={8} lgCols={8}>{children}</Grid>
                </Container>
            </div>

            {/* Diamond corners at bottom */}
            {showBottomDiamonds && (
                <>
                    <DiamondCorner position="bottom-left" />
                    <DiamondCorner position="bottom-right" />
                </>
            )}

            {/* Bottom horizontal line (full viewport width) */}
            {showBottomDivider && (
                <div className="absolute bottom-0 -left-[100vw] z-10 h-px w-[200vw] bg-ds-powder/50 dark:bg-ds-powder/[0.08]" />
            )}
        </section>
    );
};
