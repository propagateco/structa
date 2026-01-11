import React from 'react';
import { cn } from '@/lib/utils';

type GridColCount = 1 | 2 | 3 | 4 | 6 | 8 | 12;

const GRID_COL_CLASSES: Record<GridColCount, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    8: 'grid-cols-8',
    12: 'grid-cols-12',
};

const SM_GRID_COL_CLASSES: Record<GridColCount, string> = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    6: 'sm:grid-cols-6',
    8: 'sm:grid-cols-8',
    12: 'sm:grid-cols-12',
};

const MD_GRID_COL_CLASSES: Record<GridColCount, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    6: 'md:grid-cols-6',
    8: 'md:grid-cols-8',
    12: 'md:grid-cols-12',
};

const LG_GRID_COL_CLASSES: Record<GridColCount, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    6: 'lg:grid-cols-6',
    8: 'lg:grid-cols-8',
    12: 'lg:grid-cols-12',
};

const XL_GRID_COL_CLASSES: Record<GridColCount, string> = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    6: 'xl:grid-cols-6',
    8: 'xl:grid-cols-8',
    12: 'xl:grid-cols-12',
};

const generateGridLineGradient = (cols: GridColCount, opacity: number): string => {
    if (cols === 1) return 'none';
    
    const interval = 100 / cols;
    const stops: string[] = [];
    const color = `hsl(var(--ds-powder) / ${opacity})`;
    
    for (let i = 0; i <= cols; i++) {
        const position = i * interval;
        if (i === 0) {
            stops.push(`${color} ${position}%`);
            stops.push(`transparent ${position}%`);
        } else if (i === cols) {
            stops.push(`transparent ${position}%`);
            stops.push(`${color} ${position}%`);
        } else {
            stops.push(`transparent ${position}%`);
            stops.push(`${color} ${position}%`);
        }
    }
    
    return `linear-gradient(to right, ${stops.join(', ')})`;
};

interface GridColumnConfig {
    cols?: GridColCount;
    smCols?: GridColCount;
    mdCols?: GridColCount;
    lgCols?: GridColCount;
    xlCols?: GridColCount;
}

const getMaxColumnCount = (config: GridColumnConfig): GridColCount => {
    if (config.xlCols) return config.xlCols;
    if (config.lgCols) return config.lgCols;
    if (config.mdCols) return config.mdCols;
    if (config.smCols) return config.smCols;
    return config.cols || 4;
};

export interface GridProps {
    children: React.ReactNode;
    className?: string;
    showGrid?: boolean;
    fadeTop?: boolean;
    fadeBottom?: boolean;
    fadeColor?: string;
    cols?: GridColCount;
    smCols?: GridColCount;
    mdCols?: GridColCount;
    lgCols?: GridColCount;
    xlCols?: GridColCount;
}

export const Grid: React.FC<GridProps> = ({
    children,
    className,
    showGrid = false,
    fadeTop = false,
    fadeBottom = false,
    fadeColor = 'bg-ds-paper dark:bg-gray-950',
    cols = 4,
    smCols = 6,
    mdCols,
    lgCols = 12,
    xlCols,
}) => {
    const gridClasses = cn(
        'grid gap-0 relative',
        GRID_COL_CLASSES[cols],
        SM_GRID_COL_CLASSES[smCols],
        mdCols && MD_GRID_COL_CLASSES[mdCols],
        LG_GRID_COL_CLASSES[lgCols],
        xlCols && XL_GRID_COL_CLASSES[xlCols],
        className
    );

    const maxCols = getMaxColumnCount({ cols, smCols, mdCols, lgCols, xlCols });
    const gridLineStyle: React.CSSProperties = showGrid
        ? { backgroundImage: generateGridLineGradient(maxCols, 0.5) }
        : {};

    const fadeOverlayClasses = cn(
        'absolute left-0 right-0 pointer-events-none z-10 h-1/2',
        fadeColor
    );

    return (
        <div className={gridClasses} style={gridLineStyle}>
            {children}

            {fadeTop && (
                <div className={cn(fadeOverlayClasses, 'top-0')}>
                    <div className="h-full w-full bg-gradient-to-t from-current to-transparent" />
                </div>
            )}

            {fadeBottom && (
                <div className={cn(fadeOverlayClasses, 'bottom-0')}>
                    <div className="h-full w-full bg-gradient-to-b from-current to-transparent" />
                </div>
            )}
        </div>
    );
};
