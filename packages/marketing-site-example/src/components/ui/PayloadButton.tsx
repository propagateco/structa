import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PayloadButtonProps {
  label: string;
  icon?: 'arrow' | 'none';
  appearance?: 'default' | 'primary' | 'secondary';
  fullWidth?: boolean;
  hideHorizontalBorders?: boolean;
  size?: 'default' | 'large';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const PayloadButton: React.FC<PayloadButtonProps> = ({
  label,
  icon = 'none',
  appearance = 'default',
  fullWidth = false,
  hideHorizontalBorders = false,
  size = 'default',
  href,
  onClick,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const animationDuration = 550;

  useEffect(() => {
    let inTimer: NodeJS.Timeout, outTimer: NodeJS.Timeout;

    if (isHovered) {
      setIsAnimating(true);
      setIsAnimatingIn(true);

      inTimer = setTimeout(() => {
        setIsAnimating(false);
        setIsAnimatingIn(false);
      }, animationDuration);

      setIsAnimatingOut(false);
    } else {
      setIsAnimating(true);
      setIsAnimatingIn(false);
      setIsAnimatingOut(true);

      outTimer = setTimeout(() => {
        setIsAnimating(false);
        setIsAnimatingOut(false);
      }, animationDuration);
    }

    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, [isHovered]);

  const buttonClasses = cn(
    'relative overflow-hidden',
    'font-mono text-sm font-medium',
    'transition-all duration-300',
    'border',
    
    // Appearance styles
    appearance === 'default' && [
      'bg-transparent border-gray-800',
      'hover:border-gray-700 hover:bg-gray-900/50',
    ],
    appearance === 'primary' && [
      'bg-primary text-primary-foreground border-primary',
      'hover:bg-primary/90',
    ],
    appearance === 'secondary' && [
      'bg-secondary text-secondary-foreground border-secondary',
      'hover:bg-secondary/80',
    ],
    
    // Size styles
    size === 'default' && 'px-6 py-3',
    size === 'large' && 'px-8 py-4 text-base',
    
    // Layout styles
    fullWidth && 'w-full',
    hideHorizontalBorders && 'border-l-0 border-r-0',
    
    // Rounded corners
    'rounded-lg',
    
    className
  );

  const content = appearance === 'default' ? (
    <div className="relative h-full w-full">
      {/* Default label */}
      <div
        className={cn(
          'flex items-center justify-between',
          'transition-transform duration-550 ease-out',
          isAnimatingIn && 'translate-y-[-100%]',
          isAnimatingOut && 'translate-y-0'
        )}
      >
        <span>{label}</span>
        {icon === 'arrow' && (
          <ArrowRight className={cn(
            'w-4 h-4 ml-2 transition-transform',
            isHovered && 'translate-x-1'
          )} />
        )}
      </div>

      {/* Hover label */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-between',
          'transition-transform duration-550 ease-out',
          !isAnimatingIn && 'translate-y-[100%]',
          isAnimatingIn && 'translate-y-0'
        )}
        aria-hidden="true"
      >
        <span>{label}</span>
        {icon === 'arrow' && (
          <ArrowRight className="w-4 h-4 ml-2" />
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      {icon === 'arrow' && (
        <ArrowRight className={cn(
          'w-4 h-4 ml-2 transition-transform',
          isHovered && 'translate-x-1'
        )} />
      )}
    </div>
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
};
