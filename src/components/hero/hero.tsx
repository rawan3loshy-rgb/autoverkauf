import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { site } from '@/lib/site';
import type { Vehicle } from '@/lib/types';
import { formatPrice } from '@/lib/formatting';
import { fullName } from '@/lib/vehicle-utils';

const TRUST = ['Geprüfte Fahrzeuge', 'Professionelle Aufbereitung', 'Deutschlandweiter Ankauf'];

export function Hero({ feature }: { feature: Vehicle }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-900">
      <div className="absolute inset-0">
        <Image
          src="/editorial/hero.jpg"
          alt={`${fullName(feature)} im Showroom von ${site.name}`}
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Kinematische Abdunklung: unten schwer, oben nur so viel wie die Navigation braucht. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,11,0.97)_0%,rgba(10,10,11,0.82)_22%,rgba(10,10,11,0.35)_52%,rgba(10,10,11,0.18)_74%,rgba(10,10,11,0.6)_100%)]" />
        {/* Seitliches Scrim – hält die Textspalte links ruhig, egal was im Bild passiert. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,10,11,0.94)_0%,rgba(10,10,11,0.72)_26%,rgba(10,10,11,0.28)_52%,rgba(10,10,11,0.12)_72%,rgba(10,10,11,0.3)_100%)]" />
      </div>

      <div className="container relative z-10 pb-[7.5rem] pt-32 md:pb-[10rem]">
        <div className="max-w-[54rem]">
          <p className="eyebrow lead-rule">Fahrzeughandel · Ankauf · Aufbereitung</p>

          <h1 className="headline-xl mt-6 text-ivory">
            Automobile
            <br />
            mit Charakter.
          </h1>

          <p className="mt-7 max-w-[44rem] text-[1.0625rem] leading-relaxed text-ivory-300 md:text-lg">
            Fahrzeuge kaufen, verkaufen und professionell aufbereiten lassen.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/fahrzeuge"
              className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-ivory px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-white"
            >
              Fahrzeuge entdecken
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </Link>
            <Link
              href="/aufbereitung"
              className="inline-flex h-[3.25rem] items-center justify-center border border-line-strong px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory backdrop-blur-sm transition-colors duration-150 hover:border-ivory/45 hover:bg-ivory/[0.05]"
            >
              Aufbereitung anfragen
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 text-[0.8125rem] text-ivory-400">
                <Check className="h-3.5 w-3.5 text-champagne" strokeWidth={2} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bildunterschrift im Stil einer Magazin-Credit-Zeile */}
      <Link
        href={`/fahrzeuge/${feature.slug}`}
        className="absolute bottom-[7.5rem] right-0 z-10 hidden max-w-[17rem] border-l border-champagne/40 py-1 pl-4 pr-6 transition-colors duration-150 hover:border-champagne lg:block xl:pr-12"
      >
        <p className="eyebrow-muted">Im Bild</p>
        <p className="mt-2 text-sm leading-snug text-ivory">{fullName(feature)}</p>
        <p className="tnum mt-1 text-sm text-champagne">{formatPrice(feature.price)}</p>
      </Link>
    </section>
  );
}
