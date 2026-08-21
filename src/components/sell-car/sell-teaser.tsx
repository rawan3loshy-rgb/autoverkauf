import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { site } from '@/lib/site';

const STEPS = [
  {
    n: '01',
    title: 'Fahrzeug beschreiben',
    text: 'Sie übermitteln uns die wichtigsten Daten zu Ihrem Fahrzeug – online in wenigen Minuten.',
  },
  {
    n: '02',
    title: 'Bewertung erhalten',
    text: 'Unser Team prüft die Angaben, gleicht den Markt ab und bewertet Ihr Fahrzeug.',
  },
  {
    n: '03',
    title: 'Verkauf abschließen',
    text: 'Wir besprechen das Angebot persönlich und kümmern uns um Abmeldung, Abholung und Zahlung.',
  },
];

export function SellTeaser() {
  return (
    <section id="ankauf" className="relative overflow-hidden bg-ink-900">
      <div className="absolute inset-0">
        <Image
          src="/editorial/ankauf.jpg"
          alt="Fahrzeugübergabe bei NOVA MOTORS"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,10,11,0.97)_0%,rgba(10,10,11,0.93)_36%,rgba(10,10,11,0.78)_62%,rgba(10,10,11,0.72)_100%)]" />
      </div>

      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow lead-rule">Fahrzeugankauf</p>
            <h2 className="headline-lg mt-5 text-ivory">
              Ihr Fahrzeug.
              <br />
              Unser Angebot.
            </h2>
            <p className="mt-6 max-w-md text-pretty text-[1.0625rem] leading-relaxed text-ivory-300">
              Sie möchten Ihr Fahrzeug verkaufen? Lassen Sie uns wissen, was Sie fahren – wir melden uns in der Regel
              innerhalb von 24 Stunden mit einer Einschätzung.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/ankauf"
                className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-champagne px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-champagne-light"
              >
                Fahrzeug bewerten lassen
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex h-[3.25rem] items-center justify-center gap-2.5 border border-line-strong px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors duration-150 hover:border-ivory/45 hover:bg-ivory/[0.05]"
              >
                <Phone className="h-4 w-4 text-champagne" strokeWidth={1.75} />
                Direkt anrufen
              </a>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-12 sm:grid-cols-3 md:mt-28">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <p className="tnum font-display text-[2.25rem] font-semibold leading-none tracking-tighter text-champagne/85">
                {s.n}
              </p>
              <h3 className="mt-5 font-display text-[1.0625rem] font-semibold tracking-tight text-ivory">{s.title}</h3>
              <p className="mt-2.5 max-w-xs text-[0.875rem] leading-relaxed text-ivory-400">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
