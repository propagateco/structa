import React from 'react';
import { cn } from '@/lib/utils';

interface MediaStackProps {
  images: Array<{
    src: string;
    alt: string;
    className?: string;
  }>;
  className?: string;
}

export const MediaStack: React.FC<MediaStackProps> = ({ images, className }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className={cn('relative w-full h-full', className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            'absolute rounded-lg overflow-hidden shadow-2xl',
            'transition-transform duration-300',
            index === 0 && 'top-0 left-0 w-[70%] z-20',
            index === 1 && 'bottom-0 right-0 w-[65%] z-10',
            index === 2 && 'top-[20%] left-[15%] w-[60%] z-5',
            image.className
          )}
          style={{
            transform: `translateY(${index * 10}px) translateX(${index * 10}px)`,
          }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};
