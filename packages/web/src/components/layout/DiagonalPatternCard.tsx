import { cn } from '@/lib/utils';
import { DiagonalPattern } from '../ui/DiagonalPattern';
import { Crosshair } from './Crosshair';

interface DiagonalPatternCardProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * A card component with a diagonal pattern background that changes to accent color on hover.
 * Features crosshairs in top-left and bottom-right corners that appear with blur/opacity transition on hover.
 */
export function DiagonalPatternCard({
    children,
    className,
}: DiagonalPatternCardProps) {
    return (
        <div
            className={cn(
                'relative rounded-lg border border-border',
                'cursor-pointer group',
                'hover:border-accent transition-colors duration-300',
                className
            )}
        >
            {/* DiagonalPattern Background - changes to accent on hover */}
            <DiagonalPattern
                show={true}
                color="text-ds-powder dark:text-ds-powder/10 group-hover:text-accent"
                transitionDuration={300}
            />

            {/* Content with padding */}
            <div className="relative z-10 p-5 h-full">{children}</div>

            {/* Crosshairs - fade in from blurry to clear on hover, blur out on exit */}
            <Crosshair
                position="top-left"
                className="transition-all duration-500 ease-in-out [filter:blur(8px)] group-hover:[filter:blur(0px)] opacity-0 group-hover:opacity-100"
            />
            <Crosshair
                position="bottom-right"
                className="transition-all duration-500 ease-in-out [filter:blur(8px)] group-hover:[filter:blur(0px)] opacity-0 group-hover:opacity-100"
            />
        </div>
    );
}
