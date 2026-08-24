import { cn } from '@/lib/utils';

/**
 * Bildmarke: drei geneigte Balken, die nach rechts kürzer werden – abstrahierte
 * Bewegung, kein Auto-Piktogramm. Bewusst als 1-Farb-Marke angelegt.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 20" aria-hidden="true" className={cn('h-[1.15rem] w-auto', className)} fill="none">
      <path d="M4.6 0H10.2L5.6 20H0L4.6 0Z" fill="currentColor" />
      <path d="M13.4 0H19L15.2 16.4H9.6L13.4 0Z" fill="currentColor" opacity="0.55" />
      <path d="M22.2 0H26L23.4 11.2H19.6L22.2 0Z" fill="currentColor" opacity="0.28" />
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
  compact = false,
}: {
  className?: string;
  markClassName?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 leading-none', className)}>
      <Mark className={cn('text-champagne', markClassName)} />
      <span className="font-display text-[0.95rem] font-semibold uppercase leading-none tracking-[0.16em]">
        Auto
        <span className={cn('font-normal tracking-[0.16em]', compact ? 'tracking-[0.12em]' : '')}>kunst</span>
      </span>
    </span>
  );
}
