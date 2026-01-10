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

const GRID_LINE_CLASSES: Record<GridColCount, string> = {
    1: '',
    2: 'bg-[linear-gradient(to_right,theme(colors.ds.powder/50)_0%,transparent_0%,transparent_50%,theme(colors.ds.powder/50)_50%,theme(colors.ds.powder/50)_100%)] dark:bg-[linear-gradient(to_right,theme(colors.ds.powder/50/[0.08])_0%,transparent_0%,transparent_50%,theme(colors.ds.powder/50/[0.08])_50%,theme(colors.ds.powder/50/[0.08])_100%)]',
    3: 'bg-[linear-gradient(to_right,theme(colors.ds.powder/50)_0%,transparent_0%,transparent_33.33%,theme(colors.ds.powder/50)_33.33%,theme(colors.ds.powder/50)_66.66%,transparent_66.66%,transparent_100%,theme(colors.ds.powder/50)_100%)] dark:bg-[linear-gradient(to_right,theme(colors.ds.powder/50/[0.08])_0%,transparent_0%,transparent_33.33%,theme(colors.ds.powder/50/[0.08])_33.33%,theme(colors.ds.powder/50/[0.08])_66.66%,transparent_66.66%,transparent_100%,theme(colors.ds.powder/50/[0.08])_100%)]',
    4: 'bg-[linear-gradient(to_right,theme(colors.ds.powder/50)_0%,transparent_0%,transparent_25%,theme(colors.ds.powder/50)_25%,theme(colors.ds.powder/50)_50%,transparent_50%,transparent_75%,theme(colors.ds.powder/50)_75%,theme(colors.ds.powder/50)_100%)] dark:bg-[linear-gradient(to_right,theme(colors.ds.powder/50/[0.08])_0%,transparent_0%,transparent_25%,theme(colors.ds.powder/50/[0.08])_25%,theme(colors.ds.powder/50/[0.08])_50%,transparent_50%,transparent_75%,theme(colors.ds.powder/50/[0.08])_75%,theme(colors.ds.powder/50/[0.08])_100%)]',
    6: 'bg-[linear-gradient(to_right,theme(colors.ds.powder/50)_0%,transparent_0%,transparent_16.66%,theme(colors.ds.powder/50)_16.66%,theme(colors.ds.powder/50)_33.33%,transparent_33.33%,transparent_50%,theme(colors.ds.powder/50)_50%,theme(colors.ds.powder/50)_66.66%,transparent_66.66%,transparent_83.33%,theme(colors.ds.powder/50)_83.33%,theme(colors.ds.powder/50)_100%)] dark:bg-[linear-gradient(to_right,theme(colors.ds.powder/50/[0.08])_0%,transparent_0%,transparent_16.66%,theme(colors.ds.powder/50/[0.08])_16.66%,theme(colors.ds.powder/50/[0.08])_33.33%,transparent_33.33%,transparent_50%,theme(colors.ds.powder/50/[0.08])_50%,theme(colors.ds.powder/50/[0.08])_66.66%,transparent_66.66%,transparent_83.33%,theme(colors.ds.powder/50/[0.08])_83.33%,theme(colors.ds.powder/50/[0.08])_100%)]',
    8: 'bg-[linear-gradient(to_right,theme(colors.ds.powder/50)_0%,transparent_0%,transparent_12.5%,theme(colors.ds.powder/50)_12.5%,theme(colors.ds.powder/50)_25%,transparent_25%,transparent_37.5%,theme(colors.ds.powder/50)_37.5%,theme(colors.ds.powder/50)_50%,transparent_50%,transparent_62.5%,theme(colors.ds.powder/50)_62.5%,theme(colors.ds.powder/50)_75%,transparent_75%,transparent_87.5%,theme(colors.ds.powder/50)_87.5%,theme(colors.ds.powder/50)_100%)] dark:bg-[linear-gradient(to_right,theme(colors.ds.powder/50/[0.08])_0%,transparent_0%,transparent_12.5%,theme(colors.ds.powder/50/[0.08])_12.5%,theme(colors.ds.powder/50/[0.08])_25%,transparent_25%,transparent_37.5%,theme(colors.ds.powder/50/[0.08])_37.5%,theme(colors.ds.powder/50/[0.08])_50%,transparent_50%,transparent_62.5%,theme(colors.ds.powder/50/[0.08])_62.5%,theme(colors.ds.powder/50/[0.08])_75%,transparent_75%,transparent_87.5%,theme(colors.ds.powder/50/[0.08])_87.5%,theme(colors.ds.powder/50/[0.08])_100%)]',
    12: 'bg-[linear-gradient(to_right,theme(colors.ds.powder/50)_0%,transparent_0%,transparent_8.33%,theme(colors.ds.powder/50)_8.33%,theme(colors.ds.powder/50)_16.66%,transparent_16.66%,transparent_25%,theme(colors.ds.powder/50)_25%,theme(colors.ds.powder/50)_33.33%,transparent_33.33%,transparent_41.66%,theme(colors.ds.powder/50)_41.66%,theme(colors.ds.powder/50)_50%,transparent_50%,transparent_58.33%,theme(colors.ds.powder/50)_58.33%,theme(colors.ds.powder/50)_66.66%,transparent_66.66%,transparent_75%,theme(colors.ds.powder/50)_75%,theme(colors.ds.powder/50)_83.33%,transparent_83.33%,transparent_91.66%,theme(colors.ds.powder/50)_91.66%,theme(colors.ds.powder/50)_100%)] dark:bg-[linear-gradient(to_right,theme(colors.ds.powder/50/[0.08])_0%,transparent_0%,transparent_8.33%,theme(colors.ds.powder/50/[0.08])_8.33%,theme(colors.ds.powder/50/[0.08])_16.66%,transparent_16.66%,transparent_25%,theme(colors.ds.powder/50/[0.08])_25%,theme(colors.ds.powder/50/[0.08])_33.33%,transparent_33.33%,transparent_41.66%,theme(colors.ds.powder/50/[0.08])_41.66%,theme(colors.ds.powder/50/[0.08])_50%,transparent_50%,transparent_58.33%,theme(colors.ds.powder/50/[0.08])_58.33%,theme(colors.ds.powder/50/[0.08])_66.66%,transparent_66.66%,transparent_75%,theme(colors.ds.powder/50/[0.08])_75%,theme(colors.ds.powder/50/[0.08])_83.33%,transparent_83.33%,transparent_91.66%,theme(colors.ds.powder/50/[0.08])_91.66%,theme(colors.ds.powder/50/[0.08])_100%)]',
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
        `sm:${GRID_COL_CLASSES[smCols]}`,
        mdCols && `md:${GRID_COL_CLASSES[mdCols]}`,
        `lg:${GRID_COL_CLASSES[lgCols]}`,
        xlCols && `xl:${GRID_COL_CLASSES[xlCols]}`,
        showGrid && GRID_LINE_CLASSES[getMaxColumnCount({ cols, smCols, mdCols, lgCols, xlCols })],
        className
    );

    const fadeOverlayClasses = cn(
        'absolute left-0 right-0 pointer-events-none z-10 h-1/2',
        fadeColor
    );

    return (
        <div className={gridClasses}>
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
