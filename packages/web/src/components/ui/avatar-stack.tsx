import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface AvatarItem {
    src: string;
    alt: string;
    fallback?: string;
}

interface AvatarStackProps extends React.ComponentProps<"div"> {
    avatars: AvatarItem[];
    className?: string;
    maxDisplay?: number;
}

/**
 * AvatarStack - Displays overlapping avatars in a stack layout
 * Inspired by ui.sh creator avatars
 * Leftmost avatar appears on top (higher z-index)
 */
function AvatarStack({
    avatars,
    className,
    maxDisplay = 3,
    ref,
    ...props
}: AvatarStackProps) {
        const displayAvatars = avatars.slice(0, maxDisplay);
        const remainingCount = avatars.length - maxDisplay;
        const lastIndex = displayAvatars.length - 1;

        return (
            <div
                ref={ref}
                data-slot="avatar-stack"
                className={cn('flex shrink-0', className)}
                {...props}
            >
                {displayAvatars.map((avatar, index) => (
                    <Avatar
                        key={avatar.src}
                        className={cn(
                            'size-10 ring-2 ring-ds-mono-100 dark:ring-ds-mono-900',
                            index > 0 && '-ml-3', // Overlap avatars
                            'relative' // Enable z-index stacking
                        )}
                        style={{ zIndex: lastIndex - index }} // Leftmost has highest z-index
                    >
                        <AvatarImage src={avatar.src} alt={avatar.alt} />
                        <AvatarFallback>
                            {avatar.fallback ||
                                avatar.alt.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {remainingCount > 0 && (
                    <Avatar className="size-10 ring-2 ring-background dark:ring-neutral-950 -ml-3">
                        <AvatarFallback className="text-xs">
                            +{remainingCount}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        );
}

export { AvatarStack };
export type { AvatarStackProps, AvatarItem };
