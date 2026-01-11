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
    const logos = normalizeLogos(rawLogos);
    const NUM_SLOTS = logos.length;
    const TRANSITION_DURATION = 3000;

    const [currentLogos, setCurrentLogos] = useState<LogoItem[]>(logos);
    const [fadingSlots, setFadingSlots] = useState<Set<number>>(new Set());
    const nextIndexRef = useRef(NUM_SLOTS);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        setCurrentLogos(normalizeLogos(rawLogos));
        nextIndexRef.current = normalizeLogos(rawLogos).length;
    }, [rawLogos]);

    useEffect(() => {
        if (logos.length <= NUM_SLOTS) {
            return;
        }

        const interval = setInterval(() => {
            const slotToReplace = Math.floor(Math.random() * NUM_SLOTS);
            const logoToShow = logos[nextIndexRef.current % logos.length];

            setFadingSlots(prev => new Set(prev).add(slotToReplace));

            timeoutRef.current = setTimeout(() => {
                setCurrentLogos(prev => {
                    const newLogos = [...prev];
                    newLogos[slotToReplace] = logoToShow;
                    return newLogos;
                });

                setTimeout(() => {
                    setFadingSlots(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(slotToReplace);
                        return newSet;
                    });
                }, 50);
            }, 500);

            nextIndexRef.current = (nextIndexRef.current + 1) % logos.length;
        }, TRANSITION_DURATION);

        return () => {
            clearInterval(interval);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [logos, NUM_SLOTS]);

    return (
        <div className={cn('w-full', className)}>
            <div
                className={cn(
                    'grid w-full border-ds-powder/50 dark:border-ds-powder/[0.08]',
                    'grid-cols-4 md:grid-cols-8'
                )}
            >
                {currentLogos.map((logo, index) => (
                    <div
                        key={`${logo.name}-${index}`}
                        className={cn(
                            'aspect-square border border-b border-ds-powder/50 dark:border-ds-powder/[0.08]',
                            'flex items-center justify-center p-4 sm:p-6 lg:p-8 relative bg-white dark:bg-gray-950 overflow-hidden',
                            'md:col-span-2 lg:col-span-1',
                            logo.colSpan === 2 && 'col-span-2',
                            index === currentLogos.length - 1 && 'border-r',
                            index === 0 &&
                                'col-start-2 md:col-start-3 lg:col-start-2',
                            index === 2 && 'md:border-r lg:border-r-0',
                            index === 3 && 'md:col-start-1 lg:col-start-auto'
                        )}
                    >
                        <div className="flex items-center justify-center w-full h-full">
                            <span
                                key={logo.name}
                                className={cn(
                                    'text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-muted-foreground/50 text-center',
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
