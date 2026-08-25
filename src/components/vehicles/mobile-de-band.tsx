import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Verbindung zur offiziellen Händlerseite. Bewusst als ruhiges Band direkt unter dem
 * Bestand – mobile.de ist kein fremder Anbieter, sondern die etablierte Bestandsseite
 * von Autokunst. Die technische Anbindung folgt in einer späteren Phase.
 */
export function MobileDeBand({ className }: { className?: string }) {
  return (
    <section className={cn('border-t border-line bg-ink-850', className)}>
      <div className="container py-14 md:py-16">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow lead-rule">Autokunst auf mobile.de</p>
            <h2 className="headline-md mt-5 text-ivory">Unser aktueller Fahrzeugbestand</h2>
            <p className="mt-5 text-pretty text-[1.0625rem] leading-relaxed text-ivory-400">
              Alle aktuell angebotenen Fahrzeuge finden Sie auch auf unserer offiziellen mobile.de Händlerseite – seit
              Jahren dort präsent und laufend aktualisiert.
            </p>
          </div>

          <a
            href={site.mobileDe}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex h-[3.25rem] shrink-0 items-center justify-center gap-2.5 bg-champagne px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-champagne-light"
          >
            Fahrzeugbestand auf mobile.de ansehen
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/** Kompakter Sekundärverweis für Flächen, auf denen der Bestand ohnehin schon im Fokus steht. */
export function MobileDeLink({ className, label = 'Kompletten Bestand auf mobile.de ansehen' }: { className?: string; label?: string }) {
  return (
    <a
      href={site.mobileDe}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        'group inline-flex items-center gap-2 text-[0.8125rem] text-ivory-400 transition-colors duration-150 hover:text-ivory',
        className,
      )}
    >
      {label}
      <ArrowUpRight
        className="h-3.5 w-3.5 text-champagne transition-transform duration-200 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </a>
  );
}
