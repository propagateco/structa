import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const DiagonalPlaceholder = ({ show }: { show: boolean }) => {
    const patternId = Math.random().toString(36).substring(2, 9);

    return (
        <div
            className={cn(
                'absolute inset-0 transition-all duration-1500 ease-out pointer-events-none',
                show ? 'opacity-100 blur-0' : 'opacity-0 blur-4'
            )}
        >
            <svg
                className="size-full text-ds-powder/50"
                style={{ opacity: '0.30' }}
            >
                <defs>
                    <pattern
                        id={patternId}
                        width="4"
                        height="4"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                    >
                        <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </pattern>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill={`url(#${patternId})`}
                />
            </svg>
        </div>
    );
};

interface LogoItem {
    name: string;
    colSpan?: 1 | 2;
}

interface LogoShowcaseProps {
    logos: (string | LogoItem)[];
    className?: string;
}

const normalizeLogos = (logos: (string | LogoItem)[]): LogoItem[] => {
    return logos.map(logo =>
        typeof logo === 'string' ? { name: logo, colSpan: 1 } : logo
    );
};

const LogoShowcase = ({
    logos: rawLogos,
    className = '',
}: LogoShowcaseProps) => {
    const allLogos = normalizeLogos(rawLogos);
    const NUM_VISIBLE_SLOTS = 6;
    const TRANSITION_DURATION = 3000;
    const FADE_OUT_DURATION = 1500;
    const PLACEHOLDER_DURATION = 1000;
    const FADE_IN_DURATION = 1500;

    const [currentLogos, setCurrentLogos] = useState<LogoItem[]>(
        allLogos.slice(0, NUM_VISIBLE_SLOTS)
    );
    const [fadingSlots, setFadingSlots] = useState<Set<number>>(new Set());
    const [showingPlaceholder, setShowingPlaceholder] = useState<Set<number>>(new Set());
    const nextIndexRef = useRef(NUM_VISIBLE_SLOTS);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const normalized = normalizeLogos(rawLogos);
        setCurrentLogos(normalized.slice(0, NUM_VISIBLE_SLOTS));
        nextIndexRef.current = NUM_VISIBLE_SLOTS;
    }, [rawLogos]);

    useEffect(() => {
        if (allLogos.length <= NUM_VISIBLE_SLOTS) {
            return;
        }

        const interval = setInterval(() => {
            const slotToReplace = Math.floor(Math.random() * NUM_VISIBLE_SLOTS);
            const logoToShow = allLogos[nextIndexRef.current % allLogos.length];

            // Stage 1: Start fading out the current logo
            setFadingSlots(prev => new Set(prev).add(slotToReplace));

            // Stage 2: After fade out completes, show diagonal placeholder
            setTimeout(() => {
                setShowingPlaceholder(prev => new Set(prev).add(slotToReplace));
            }, FADE_OUT_DURATION);

            // Stage 3: After placeholder is shown, fade it out and swap in new logo
            setTimeout(() => {
                setShowingPlaceholder(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(slotToReplace);
                    return newSet;
                });
                setCurrentLogos(prev => {
                    const newLogos = [...prev];
                    newLogos[slotToReplace] = logoToShow;
                    return newLogos;
                });
            }, FADE_OUT_DURATION + PLACEHOLDER_DURATION);

            // Stage 4: Fade in the new logo
            setTimeout(() => {
                setFadingSlots(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(slotToReplace);
                    return newSet;
                });
            }, FADE_OUT_DURATION + PLACEHOLDER_DURATION + FADE_IN_DURATION);

            nextIndexRef.current = (nextIndexRef.current + 1) % allLogos.length;
        }, TRANSITION_DURATION);

        return () => {
            clearInterval(interval);
        };
    }, [allLogos]);

    return (
        <div className={cn('w-full', className)}>
            <div className={cn('grid w-full', 'grid-cols-4 md:grid-cols-8')}>
                {currentLogos.map((logo, index) => (
                    <div
                        key={`slot-${index}`}
                        className={cn(
                            'aspect-square',
                            'flex items-center justify-center p-4 sm:p-6 lg:p-8 relative dark:bg-gray-950 overflow-hidden',
                            'border-r border-ds-powder/50 dark:border-ds-powder/[0.08]',
                            'md:col-span-2 lg:col-span-1 border-t',
                            logo.colSpan === 2 && 'col-span-2',
                            index === 0 &&
                                'col-start-2 md:col-start-3 lg:col-start-2',
                            index === 3 && 'md:col-start-1 lg:col-start-auto',
                            index >= 4 && 'border-t-0 lg:border-t',
                            index === 0 && 'border-l',
                            index === 3 && 'border-l lg:border-l-0',
                            index === 5 && 'border-r',
                            index < 3 && 'border-b md:border-b',
                            index >= 3 && 'border-b lg:border-b'
                        )}
                    >
                        <div className="flex items-center justify-center w-full h-full">
                            <DiagonalPlaceholder show={showingPlaceholder.has(index)} />
                            <span
                                className={cn(
                                    'text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-muted-foreground/70 text-center',
                                    'transition-all duration-1000 ease-in-out'
                                )}
                                style={{
                                    opacity: fadingSlots.has(index) ? 0 : 1,
                                    filter: fadingSlots.has(index)
                                        ? 'blur(8px)'
                                        : 'blur(0px)',
                                }}
                            >
                                {logo.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogoShowcase;
