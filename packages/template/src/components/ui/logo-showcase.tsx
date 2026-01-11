import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

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

    const [currentLogos, setCurrentLogos] = useState<LogoItem[]>(
        allLogos.slice(0, NUM_VISIBLE_SLOTS)
    );
    const [fadingSlots, setFadingSlots] = useState<Set<number>>(new Set());
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

            setFadingSlots(prev => new Set(prev).add(slotToReplace));

            setTimeout(() => {
                setCurrentLogos(prev => {
                    const newLogos = [...prev];
                    newLogos[slotToReplace] = logoToShow;
                    return newLogos;
                });
            }, 600);

            setTimeout(() => {
                setFadingSlots(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(slotToReplace);
                    return newSet;
                });
            }, 650);

            nextIndexRef.current = (nextIndexRef.current + 1) % allLogos.length;
        }, TRANSITION_DURATION);

        return () => {
            clearInterval(interval);
        };
    }, [allLogos]);

    return (
        <div className={cn('w-full', className)}>
            <div
                className={cn(
                    'grid w-full border border-ds-powder/50 dark:border-ds-powder/[0.08]',
                    'grid-cols-4 md:grid-cols-8',
                    'gap-px bg-ds-powder/50 dark:bg-ds-powder/[0.08]'
                )}
            >
                {currentLogos.map((logo, index) => (
                    <div
                        key={`slot-${index}`}
                        className={cn(
                            'aspect-square',
                            'flex items-center justify-center p-4 sm:p-6 lg:p-8 relative bg-white dark:bg-gray-950 overflow-hidden',
                            'md:col-span-2 lg:col-span-1',
                            logo.colSpan === 2 && 'col-span-2',
                            index === 0 &&
                                'col-start-2 md:col-start-3 lg:col-start-2',
                            index === 3 && 'md:col-start-1 lg:col-start-auto'
                        )}
                    >
                        <div className="flex items-center justify-center w-full h-full">
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
