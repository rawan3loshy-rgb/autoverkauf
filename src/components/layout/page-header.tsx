import { cn } from '@/lib/utils';

/** Einheitlicher Seitenkopf für alle Unterseiten – ruhig, viel Weißraum, kein Bild. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  aside,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('border-b border-line bg-ink-900 pb-12 pt-[8.5rem] md:pb-16 md:pt-[11rem]', className)}>
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow lead-rule">{eyebrow}</p>
            <h1 className="headline-lg mt-5 text-ivory">{title}</h1>
            {lead && <p className="mt-5 max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-ivory-400">{lead}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
