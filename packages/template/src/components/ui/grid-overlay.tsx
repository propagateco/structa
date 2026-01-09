const GridOverlay = () => {
    // Vertical lines matching section divider style - blue-200/50, solid lines
    // Based on 16-column responsive grid system
    const gridLines = [
        { gridColumn: "1 / 1" }, // Column 1
        { gridColumn: "3 / 3" }, // Column 3
        { gridColumn: "5 / 5" }, // Column 5
        { gridColumn: "7 / 7" }, // Column 7
        { gridColumn: "9 / 9" }, // Column 9 (center)
        { gridColumn: "11 / 11" }, // Column 11
        { gridColumn: "13 / 13" }, // Column 13
        { gridColumn: "15 / 15" }, // Column 15
        { gridColumn: "17 / 17" }, // Column 17 (right edge)
    ];

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[-1]"
            aria-hidden="true"
        >
            {/* Subtle gradient fade at top and bottom - matches zed.dev mask effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100/20 via-transparent to-blue-100/20 dark:from-blue-900/10 dark:via-transparent dark:to-blue-900/10" />
            <div className="h-full w-full max-w-[1400px] mx-auto relative">
                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 h-full gap-0">
                    {gridLines.map((line, index) => (
                        <div
                            key={index}
                            className="h-full w-px bg-blue-200/50 dark:bg-blue-300/[0.08]"
                            style={{ gridColumn: line.gridColumn }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GridOverlay;
