import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { site } from '@/lib/site';

export function ShowroomSection() {
  return (
    <section id="showroom" className="bg-ink-900">
      <div className="grid lg:grid-cols-2">
        <Reveal className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[42rem]">
          <Image
            src="/editorial/showroom.jpg"
            alt={`Showroom von ${site.name} in ${site.city}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/35 to-transparent lg:from-transparent lg:to-ink-900/30" />
        </Reveal>

        <div className="flex items-center px-5 py-20 sm:px-8 md:py-28 lg:px-14 xl:px-20">
          <Reveal className="w-full max-w-lg">
            <p className="eyebrow lead-rule">Showroom {site.city}</p>
            <h2 className="headline-lg mt-5 text-ivory">Erleben Sie Automobile anders.</h2>
            <p className="mt-6 text-pretty text-[1.0625rem] leading-relaxed text-ivory-300">
              Besuchen Sie unseren Showroom und erleben Sie ausgewählte Fahrzeuge persönlich. Für eine Probefahrt oder
              eine ausführliche Besichtigung vereinbaren wir gerne einen Termin – auch außerhalb der Öffnungszeiten.
            </p>

            <div className="mt-10 border-t border-line pt-8">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" strokeWidth={1.5} />
                <address className="text-sm not-italic leading-relaxed text-ivory-300">
                  <span className="block text-ivory">{site.city}</span>
                  {site.street}
                  <br />
                  {site.zip} {site.city}
                </address>
              </div>

              <dl className="tnum mt-7 space-y-2 text-sm">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-6 border-b border-line pb-2 last:border-0">
                    <dt className="text-ivory-400">{h.days}</dt>
                    <dd className="text-ivory">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Link
              href="/kontakt?anlass=termin"
              className="group mt-9 inline-flex h-[3.25rem] items-center justify-center gap-2.5 border border-line-strong px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors duration-150 hover:border-ivory/45 hover:bg-ivory/[0.05]"
            >
              Termin vereinbaren
              <ArrowRight className="h-4 w-4 text-champagne transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
