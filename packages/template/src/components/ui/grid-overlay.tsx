const GridOverlay = () => {
    // Show vertical lines every 2 columns for more granular alignment guidance
    // Based on 16-column responsive grid system
    const gridLines = [
        { gridColumn: "1 / 1", delay: 0 }, // Column 1
        { gridColumn: "3 / 3", delay: 40 }, // Column 3
        { gridColumn: "5 / 5", delay: 80 }, // Column 5
        { gridColumn: "7 / 7", delay: 120 }, // Column 7
        { gridColumn: "9 / 9", delay: 120 }, // Column 9 (center)
        { gridColumn: "11 / 11", delay: 120 }, // Column 11
        { gridColumn: "13 / 13", delay: 80 }, // Column 13
        { gridColumn: "15 / 15", delay: 40 }, // Column 15
        { gridColumn: "17 / 17", delay: 0 }, // Column 17 (right edge)
    ];

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[-1]"
            aria-hidden="true"
        >
            <div className="mx-auto h-full w-full max-w-[1400px] px-8 relative">
                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 h-full gap-0 relative">
                    {gridLines.map((line, index) => (
                        <div
                            key={index}
                            className="h-full w-px"
                            style={{
                                gridColumn: line.gridColumn,
                                background: `linear-gradient(to bottom, transparent ${line.delay}px, rgba(var(--grid-line-rgb, 200, 200, 200), 0.15) 240px)`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GridOverlay;
