import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

export const FadeInSection = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  duration = 0.6,
  className = ''
}: FadeInSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-50px' // Trigger animation 50px before element enters viewport
  });

  // Direction-based initial position
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 40, x: 0 };
      case 'down':
        return { y: -40, x: 0 };
      case 'left':
        return { x: 40, y: 0 };
      case 'right':
        return { x: -40, y: 0 };
      case 'none':
        return { y: 0, x: 0 };
      default:
        return { y: 40, x: 0 };
    }
  };

  const initialPosition = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0,
        ...initialPosition
      }}
      animate={isInView ? { 
        opacity: 1,
        x: 0,
        y: 0
      } : {}}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] // Custom easing similar to Payload
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
