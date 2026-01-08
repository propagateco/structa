import { useState, useEffect, useRef } from 'react';

interface LogoShowcaseProps {
  logos: string[];
  className?: string;
}

const LogoShowcase = ({ logos, className = '' }: LogoShowcaseProps) => {
  const NUM_SLOTS = 5; // Number of visible logo slots (5 logos to fit flexbox layout)
  const TRANSITION_DURATION = 3000; // Time each logo is visible (ms)
  
  // Initialize with first N logos
  const [currentLogos, setCurrentLogos] = useState<string[]>(
    logos.slice(0, NUM_SLOTS)
  );
  const [fadingSlots, setFadingSlots] = useState<Set<number>>(new Set());
  const nextIndexRef = useRef(NUM_SLOTS);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Reinitialize when logos prop changes
  useEffect(() => {
    setCurrentLogos(logos.slice(0, NUM_SLOTS));
    nextIndexRef.current = NUM_SLOTS;
  }, [logos, NUM_SLOTS]);

  useEffect(() => {
    if (logos.length < NUM_SLOTS) {
      // If we have fewer logos than slots, just show them all
      return;
    }

    const interval = setInterval(() => {
      // Pick a random slot to replace
      const slotToReplace = Math.floor(Math.random() * NUM_SLOTS);
      
      // Get the next logo (cycling through the array)
      const logoToShow = logos[nextIndexRef.current % logos.length];
      
      // Start fade out
      setFadingSlots(prev => new Set(prev).add(slotToReplace));
      
      // After fade out completes, swap logo and fade in
      timeoutRef.current = setTimeout(() => {
        setCurrentLogos(prev => {
          const newLogos = [...prev];
          newLogos[slotToReplace] = logoToShow;
          return newLogos;
        });
        
        // Remove from fading set to trigger fade in
        setTimeout(() => {
          setFadingSlots(prev => {
            const newSet = new Set(prev);
            newSet.delete(slotToReplace);
            return newSet;
          });
        }, 50);
      }, 500); // Half of transition duration for smooth effect
      
      // Move to next logo
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
    <div className={`${className}`}>
      <div className="flex w-full border-l border-t border-gray-200">
        {currentLogos.map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            className="flex-1 aspect-square border-r border-b border-gray-200 flex items-center justify-center p-8 relative bg-white overflow-hidden"
          >
            <div className="flex items-center justify-center w-full h-full">
              <span 
                key={logo}
                className="text-2xl font-semibold tracking-tight text-muted-foreground/50 text-center transition-all duration-1000 ease-in-out"
                style={{
                  opacity: fadingSlots.has(index) ? 0 : 1,
                  filter: fadingSlots.has(index) ? 'blur(8px)' : 'blur(0px)'
                }}
              >
                {logo}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoShowcase;
