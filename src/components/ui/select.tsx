'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { tone?: 'dark' | 'light' }
>(({ className, children, tone = 'dark', ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex h-12 w-full items-center justify-between gap-2 border px-4 text-left text-[0.9375rem] transition-colors duration-150',
      'data-[placeholder]:text-ivory-500',
      tone === 'dark'
        ? 'border-line bg-ink-800/70 text-ivory hover:border-line-strong focus:border-champagne/60'
        : 'border-ink-900/15 bg-white text-ink-900 hover:border-ink-900/30 focus:border-champagne data-[placeholder]:text-ink-900/40',
      'focus:outline-none',
      className,
    )}
    {...props}
  >
    <span className="truncate">{children}</span>
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={4}
      className={cn(
        'relative z-[80] max-h-[19rem] min-w-[var(--radix-select-trigger-width)] overflow-hidden border border-line-strong bg-ink-850 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]',
        'data-[state=open]:animate-fade-in',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="max-h-[18rem] overflow-y-auto p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2.5 text-[0.875rem] text-ivory-300 outline-none',
      'data-[highlighted]:bg-ivory/[0.06] data-[highlighted]:text-ivory data-[state=checked]:text-ivory',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator>
      <Check className="h-3.5 w-3.5 text-champagne" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
