import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-sans text-[0.8125rem] font-medium uppercase tracking-wider transition-[background-color,color,border-color,opacity] duration-150 ease-premium disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        /** Elfenbein auf Dunkel – der primäre Weg durch die Seite. */
        primary: 'bg-ivory text-ink-900 hover:bg-white',
        /** Auf hellen Sektionen. */
        dark: 'bg-ink-900 text-ivory hover:bg-ink-700',
        outline: 'border border-line-strong text-ivory hover:border-ivory/45 hover:bg-ivory/[0.04]',
        outlineDark: 'border border-ink-900/20 text-ink-900 hover:border-ink-900/45 hover:bg-ink-900/[0.03]',
        champagne: 'bg-champagne text-ink-900 hover:bg-champagne-light',
        ghost: 'text-ivory-400 hover:text-ivory',
        link: 'h-auto p-0 text-ivory underline-offset-4 hover:text-champagne',
      },
      size: {
        sm: 'h-10 px-4',
        md: 'h-12 px-6',
        lg: 'h-[3.25rem] px-8',
        icon: 'h-11 w-11 px-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
