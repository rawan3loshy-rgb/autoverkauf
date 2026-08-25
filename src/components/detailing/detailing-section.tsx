import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Car, Phone, Sparkles, SprayCan, Wrench } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { site } from '@/lib/site';

const SERVICES = [
  {
    icon: SprayCan,
    title: 'Innenraum',
    text: 'Gründliche Reinigung und Pflege des Innenraums.',
  },
  {
    icon: Car,
    title: 'Außenbereich',
    text: 'Professionelle Außenreinigung und Fahrzeugpflege.',
  },
  {
    icon: Sparkles,
    title: 'Lack & Politur',
    text: 'Aufbereitung und Politur zur optischen Auffrischung des Fahrzeugs.',
  },
  {
    icon: Wrench,
    title: 'Leasingrückgabe',
    text: 'Professionelle Vorbereitung des Fahrzeugs vor der Rückgabe.',
  },
];

/**
 * Zweites Standbein neben dem Handel. Bewusst im hellen Abschnitt platziert – dort
 * stand vorher die Finanzierung, der Hell-Dunkel-Rhythmus der Seite bleibt damit intakt.
 */
export function DetailingSection() {
  return (
    <section id="aufbereitung" className="section-y bg-ivory-100 text-ink-900">
      <div className="container">
        <SectionHeading
          tone="light"
          eyebrow="Fahrzeugaufbereitung"
          title={
            <>
              Ihr Fahrzeug.
              <br />
              Perfekt vorbereitet.
            </>
          }
          lead="Ob für den Verkauf, die persönliche Fahrzeugpflege oder die bevorstehende Leasingrückgabe – wir bereiten Ihr Fahrzeug professionell auf und bringen es optisch wieder in Bestform."
        />

        <div className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 55} className="border-t border-ink-900/[0.12] pt-5">
              <s.icon className="h-5 w-5 text-champagne-dark" strokeWidth={1.25} />
              <h3 className="mt-4 font-display text-[0.9375rem] font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-900/60">{s.text}</p>
            </Reveal>
          ))}
        </div>

        {/* Leasingrückgabe – der Anlass, mit dem die meisten Anfragen hereinkommen. */}
        <Reveal className="mt-14 grid overflow-hidden border border-ink-900/[0.12] bg-white lg:grid-cols-12">
          <div className="relative aspect-[16/10] w-full lg:col-span-5 lg:aspect-auto">
            <Image
              src="/editorial/ueber-uns.jpg"
              alt="Aufbereiteter Lack eines Fahrzeugs bei Autokunst"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-6 md:p-10 lg:col-span-7">
            <p className="eyebrow lead-rule text-champagne-dark">Leasingrückgabe</p>
            <h3 className="headline-sm mt-5 text-ink-900">Leasingrückgabe steht bevor?</h3>
            <p className="mt-4 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-ink-900/65">
              Kleine Gebrauchsspuren, Verschmutzungen oder ein ungepflegter Gesamteindruck können bei der Rückgabe
              unnötig auffallen. Wir bereiten Ihr Fahrzeug professionell auf und helfen Ihnen dabei, es sauber und
              gepflegt zur Rückgabe zu präsentieren.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/aufbereitung#anfrage"
                className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-ink-900 px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors duration-150 hover:bg-ink-800"
              >
                Aufbereitung anfragen
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex h-[3.25rem] items-center justify-center gap-2.5 border border-ink-900/25 px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:border-ink-900 hover:bg-ink-900/[0.04]"
              >
                <Phone className="h-4 w-4 text-champagne-dark" strokeWidth={1.75} />
                Jetzt anrufen
              </a>
            </div>

            <p className="mt-5 max-w-xl text-[0.8125rem] leading-relaxed text-ink-900/50">
              Wie ein Fahrzeug bei der Rückgabe bewertet wird, richtet sich nach Ihrem Leasingvertrag und den
              Prüfkriterien des Leasinggebers. Wir übernehmen die Aufbereitung – die Bewertung selbst liegt beim
              Leasinggeber.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
