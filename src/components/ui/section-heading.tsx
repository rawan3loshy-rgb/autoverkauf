import { cn } from '@/lib/utils';
import { Reveal } from './reveal';

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = 'dark',
  align = 'left',
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
  className?: string;
  action?: React.ReactNode;
}) {
  const centered = align === 'center';

  return (
    <Reveal
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        centered && 'md:flex-col md:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'text-center')}>
        {eyebrow && (
          <p className={cn('lead-rule', tone === 'dark' ? 'eyebrow' : 'eyebrow text-champagne-dark')}>{eyebrow}</p>
        )}
        <h2 className={cn('headline-lg mt-5', tone === 'dark' ? 'text-ivory' : 'text-ink-900')}>{title}</h2>
        {lead && (
          <p
            className={cn(
              'mt-5 text-pretty text-[1.0625rem] leading-relaxed',
              tone === 'dark' ? 'text-ivory-400' : 'text-ink-900/65',
            )}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
