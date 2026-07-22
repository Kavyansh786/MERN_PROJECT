import React, { useState } from 'react';
import { cva } from 'class-variance-authority';
import { useVirtualTryOnContext } from '../../contexts/VirtualTryOnContext';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'virtual-tryon-button inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white hover:from-[#B8941F] hover:to-[#D4AF37] focus:ring-[#D4AF37]',
        secondary: 'border-2 border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37] hover:text-white focus:ring-[#D4AF37]',
        minimal: 'text-[#D4AF37] hover:text-[#B8941F] underline hover:no-underline focus:ring-[#D4AF37]',
      },
      size: {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

const TryOnButton = ({ 
  product, 
  className,
  variant,
  size,
  disabled = false 
}) => {
  const { startTryOn, isSupported } = useVirtualTryOnContext();
  const [isLoading, setIsLoading] = useState(false);

  // Check if product supports virtual try-on
  const isProductSupported = product && 
    ['necklace', 'necklaces', 'earrings'].includes(product.category?.toLowerCase()) &&
    product.model3d;

  const handleTryOn = async () => {
    if (!isProductSupported || disabled || isLoading) return;

    try {
      setIsLoading(true);
      await startTryOn(product);
    } catch (error) {
      console.error('Failed to start virtual try-on:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if not supported
  if (!isSupported || !isProductSupported) {
    return null;
  }

  return (
    <button
      onClick={handleTryOn}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, className }))}
      aria-label={`Try on ${product.name} virtually`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
          <span>Loading...</span>
        </>
      ) : (
        <>
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
          <span>Try On</span>
        </>
      )}
    </button>
  );
};

export default TryOnButton;