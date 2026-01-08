const GridOverlay = () => {
  // Create 16 vertical lines (Payload uses 16-column grid)
  const columns = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[-1]"
      aria-hidden="true"
    >
      <div className="mx-auto h-full w-full max-w-[1400px] px-8 relative">
        <div className="grid grid-cols-16 h-full gap-0">
          {columns.map((col) => (
            <div
              key={col}
              className="h-full relative"
            >
              {col > 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200/40 dark:bg-gray-700/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridOverlay;
