'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Eine einzige, sehr zurückhaltende Bewegung: Inhalt steigt beim ersten Sichtbarwerden
 * 14px auf. Kein Parallax, kein Stagger-Feuerwerk. Wird bewusst nur für Sektionsköpfe
 * und Kennzahlen eingesetzt.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'header' | 'li';
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-premium will-change-[opacity,transform] motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-[14px] opacity-0',
        className,
      )}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Component>
  );
}
