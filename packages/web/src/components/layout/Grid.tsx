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

const generateGridLineGradient = (cols: number, opacity: number): string => {
    if (cols <= 1) return 'none';

    const color = `hsl(var(--ds-powder) / ${opacity})`;
    const stops: string[] = [];

    stops.push(`${color} 0px`);
    stops.push(`${color} 1px`);
    stops.push(`transparent 1px`);

    for (let i = 1; i < cols; i++) {
        const pos = (i / cols) * 100;
        stops.push(`transparent calc(${pos}% - 0.5px)`);
        stops.push(`${color} calc(${pos}% - 0.5px)`);
        stops.push(`${color} calc(${pos}% + 0.5px)`);
        stops.push(`transparent calc(${pos}% + 0.5px)`);
    }

    stops.push(`transparent calc(100% - 1px)`);
    stops.push(`${color} calc(100% - 1px)`);
    stops.push(`${color} 100%`);

    return `linear-gradient(to right, ${stops.join(', ')})`;
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
    fadeColor = 'bg-background',
    cols = 4,
    smCols = 6,
    mdCols,
    lgCols = 8,
    xlCols,
}) => {
    const gridId = React.useId();

    const gridClasses = cn(
        'grid gap-0 relative',
        GRID_COL_CLASSES[cols],
        SM_GRID_COL_CLASSES[smCols],
        mdCols && MD_GRID_COL_CLASSES[mdCols],
        LG_GRID_COL_CLASSES[lgCols],
        xlCols && XL_GRID_COL_CLASSES[xlCols],
        className
    );

    const fadeOverlayClasses = cn(
        'absolute left-0 right-0 pointer-events-none z-10 h-1/2',
        fadeColor
    );

    const gridLineStyles = showGrid
        ? `
          [data-grid-id="${gridId}"] {
            background-image: ${generateGridLineGradient(cols, 0.5)};
          }
          @media (min-width: 640px) {
            [data-grid-id="${gridId}"] {
              background-image: ${generateGridLineGradient(smCols, 0.5)};
            }
          }
          ${
              mdCols
                  ? `@media (min-width: 768px) {
              [data-grid-id="${gridId}"] {
                background-image: ${generateGridLineGradient(mdCols, 0.5)};
              }
            }`
                  : ''
          }
          @media (min-width: 1024px) {
            [data-grid-id="${gridId}"] {
              background-image: ${generateGridLineGradient(lgCols, 0.5)};
            }
          }
          ${
              xlCols
                  ? `@media (min-width: 1280px) {
              [data-grid-id="${gridId}"] {
                background-image: ${generateGridLineGradient(xlCols, 0.5)};
              }
            }`
                  : ''
          }
          @media (prefers-color-scheme: dark) {
            [data-grid-id="${gridId}"] {
              background-image: ${generateGridLineGradient(cols, 0.08)};
            }
            @media (min-width: 640px) {
              [data-grid-id="${gridId}"] {
                background-image: ${generateGridLineGradient(smCols, 0.08)};
              }
            }
            ${
                mdCols
                    ? `@media (min-width: 768px) {
                [data-grid-id="${gridId}"] {
                  background-image: ${generateGridLineGradient(mdCols, 0.08)};
                }
              }`
                    : ''
            }
            @media (min-width: 1024px) {
              [data-grid-id="${gridId}"] {
                background-image: ${generateGridLineGradient(lgCols, 0.08)};
              }
            }
            ${
                xlCols
                    ? `@media (min-width: 1280px) {
              [data-grid-id="${gridId}"] {
                background-image: ${generateGridLineGradient(xlCols, 0.08)};
              }
            }`
                    : ''
            }
          }
        `
        : '';

    return (
        <>
            {showGrid && (
                <style dangerouslySetInnerHTML={{ __html: gridLineStyles }} />
            )}
            <div
                className={gridClasses}
                data-grid-id={showGrid ? gridId : undefined}
            >
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
        </>
    );
};
