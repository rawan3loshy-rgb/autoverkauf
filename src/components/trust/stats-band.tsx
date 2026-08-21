import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

const STATS = [
  { value: '15+', label: 'Jahre Erfahrung' },
  { value: '500+', label: 'Fahrzeuge verkauft' },
  { value: '4,9 / 5', label: 'Kundenbewertung' },
  { value: 'Deutschlandweit', label: 'Fahrzeugankauf' },
];

export function StatsBand({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const light = tone === 'light';
  return (
    <section className={cn('border-t py-14 md:py-16', light ? 'border-ink-900/[0.12] bg-ivory-100' : 'border-line bg-ink-850')}>
      <div className="container">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 60}>
              <dd
                className={cn(
                  'tnum font-display text-[1.75rem] font-semibold leading-none tracking-tighter md:text-[2.125rem]',
                  light ? 'text-ink-900' : 'text-ivory',
                )}
              >
                {s.value}
              </dd>
              <dt className={cn('mt-3 text-[0.8125rem]', light ? 'text-ink-900/55' : 'text-ivory-400')}>{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
