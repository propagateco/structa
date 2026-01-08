const GridOverlay = () => {
  // Payload uses 4-5 main vertical lines positioned at specific grid columns
  // Based on their 16-column grid system
  const gridLines = [
    { gridColumn: '1 / 1', delay: 0 },      // Far left
    { gridColumn: '5 / 5', delay: 80 },     // Left-center
    { gridColumn: '9 / 9', delay: 120 },    // Center
    { gridColumn: '13 / 13', delay: 80 },   // Right-center
    { gridColumn: '17 / 17', delay: 0 },    // Far right
  ];

  return (
    <div 
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: -2 }}
      aria-hidden="true"
    >
      <div className="mx-auto h-full w-full max-w-[1400px] px-8 relative">
        <div className="grid h-full gap-0 relative">
          {gridLines.map((line, index) => (
            <div
              key={index}
              className="h-full w-px"
              style={{
                gridColumn: line.gridColumn,
                background: `linear-gradient(to bottom, transparent ${line.delay}px, rgba(var(--grid-line-rgb, 200, 200, 200), 0.15) 240px)`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridOverlay;
