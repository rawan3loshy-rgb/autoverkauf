'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

/** Schlanker Regler – 2px Schiene, quadratischer Griff. Kein Schatten, kein Glanz. */
export const Range = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { tone?: 'dark' | 'light' }
>(({ className, tone = 'light', ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex h-6 w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn('relative h-[2px] w-full grow overflow-hidden', tone === 'light' ? 'bg-ink-900/15' : 'bg-ivory/15')}
    >
      <SliderPrimitive.Range className="absolute h-full bg-champagne" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        'block h-5 w-5 cursor-grab border transition-colors duration-150 active:cursor-grabbing',
        tone === 'light' ? 'border-ink-900 bg-ink-900 hover:bg-ink-700' : 'border-ivory bg-ivory hover:bg-white',
      )}
      aria-label="Wert wählen"
    />
  </SliderPrimitive.Root>
));
Range.displayName = 'Range';
