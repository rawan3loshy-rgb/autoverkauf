import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { site } from '@/lib/site';

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink-900 pb-24 pt-40">
      <div className="container">
        <p className="eyebrow lead-rule">Fehler 404</p>
        <h1 className="headline-lg mt-5 max-w-2xl text-ivory">Diese Seite steht nicht mehr im Bestand.</h1>
        <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-ivory-400">
          Möglicherweise wurde das Fahrzeug bereits verkauft oder die Adresse hat sich geändert. Im Fahrzeugbestand
          finden Sie alle aktuell verfügbaren Angebote.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/fahrzeuge"
            className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-ivory px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-white"
          >
            Zum Fahrzeugbestand
            <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
          </Link>
          <a
            href={site.phoneHref}
            className="tnum inline-flex h-[3.25rem] items-center justify-center gap-2.5 border border-line-strong px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors duration-150 hover:border-ivory/45"
          >
            <Phone className="h-4 w-4 text-champagne" strokeWidth={1.75} />
            {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
