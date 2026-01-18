const GridOverlay = () => {
    // Vertical lines matching section divider style - blue-200/50, solid lines
    // Based on 12-column responsive grid system
    const gridLines = [
        { gridColumn: "1 / 2" }, // Left edge
        { gridColumn: "3 / 4" }, // After col 2
        { gridColumn: "5 / 6" }, // After col 4
        { gridColumn: "7 / 8" }, // Center
        { gridColumn: "9 / 10" }, // After col 8
        { gridColumn: "11 / 12" }, // After col 10
        { gridColumn: "13 / 14" }, // Right edge
    ];

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[-1]"
            aria-hidden="true"
        >
            {/* Subtle gradient fade at top and bottom - matches zed.dev mask effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100/20 via-transparent to-blue-100/20 dark:from-blue-900/10 dark:via-transparent dark:to-blue-900/10" />
            <div className="h-full w-full sm:max-w-[1100px] sm:mx-auto sm:relative">
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 h-full gap-0 px-3 sm:px-8 lg:px-12">
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
