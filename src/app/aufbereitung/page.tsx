import type { Metadata } from 'next';
import Image from 'next/image';
import { Car, Phone, Sparkles, SprayCan, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { InquiryForm } from '@/components/contact/inquiry-form';
import { ContactClosing } from '@/components/contact/contact-closing';
import { Reveal } from '@/components/ui/reveal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Fahrzeugaufbereitung',
  description:
    'Professionelle Fahrzeugaufbereitung bei Autokunst in Langenhagen: Innenraumreinigung, Außenreinigung, Lackaufbereitung und Politur – auch zur Vorbereitung auf die Leasingrückgabe.',
};

const SERVICES = [
  {
    icon: SprayCan,
    title: 'Innenraum',
    text: 'Gründliche Reinigung und Pflege des Innenraums – Sitze, Verkleidungen, Cockpit und Fußräume.',
  },
  {
    icon: Car,
    title: 'Außenbereich',
    text: 'Professionelle Außenreinigung und Fahrzeugpflege, inklusive Felgen und Scheiben.',
  },
  {
    icon: Sparkles,
    title: 'Lack & Politur',
    text: 'Lackaufbereitung und Politur zur optischen Auffrischung – leichte Gebrauchsspuren treten spürbar zurück.',
  },
  {
    icon: Wrench,
    title: 'Leasingrückgabe',
    text: 'Professionelle Vorbereitung des Fahrzeugs, damit es bei der Rückgabe gepflegt präsentiert wird.',
  },
];

const OCCASIONS = [
  {
    title: 'Vor dem Verkauf',
    text: 'Ein aufbereitetes Fahrzeug wirkt im Verkaufsgespräch und auf Fotos deutlich hochwertiger.',
  },
  {
    title: 'Zur Fahrzeugpflege',
    text: 'Regelmäßige Aufbereitung erhält den Zustand von Lack und Innenraum über die Jahre.',
  },
  {
    title: 'Vor der Leasingrückgabe',
    text: 'Verschmutzungen und ein ungepflegter Gesamteindruck fallen bei der Rückgabe unnötig auf.',
  },
];

export default function AufbereitungPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fahrzeugaufbereitung"
        title="Ihr Fahrzeug. Perfekt vorbereitet."
        lead="Ob für den Verkauf, die persönliche Fahrzeugpflege oder die bevorstehende Leasingrückgabe – wir bereiten Ihr Fahrzeug professionell auf und bringen es optisch wieder in Bestform."
      />

      {/* Leistungen */}
      <section className="border-b border-line bg-ink-900 py-16 md:py-20">
        <div className="container">
          <p className="eyebrow lead-rule">Unsere Leistungen</p>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 60} className="border-t border-line pt-6">
                <s.icon className="h-6 w-6 text-champagne" strokeWidth={1.25} />
                <h3 className="mt-5 font-display text-[1.0625rem] font-semibold tracking-tight text-ivory">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ivory-400">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leasingrückgabe */}
      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-6">
              <p className="eyebrow lead-rule">Leasingrückgabe</p>
              <h2 className="headline-md mt-5 text-ivory">Leasingrückgabe steht bevor?</h2>
              <div className="mt-7 space-y-5 text-pretty text-[1.0625rem] leading-relaxed text-ivory-300">
                <p>
                  Kleine Gebrauchsspuren, Verschmutzungen oder ein ungepflegter Gesamteindruck können bei der Rückgabe
                  unnötig auffallen. Wir bereiten Ihr Fahrzeug professionell auf und helfen Ihnen dabei, es sauber und
                  gepflegt zur Rückgabe zu präsentieren.
                </p>
                <p className="text-[0.9375rem] text-ivory-400">
                  Wie ein Fahrzeug bei der Rückgabe bewertet wird, richtet sich nach Ihrem Leasingvertrag und den
                  Prüfkriterien des Leasinggebers. Normale Gebrauchsspuren und Schäden werden dort unterschiedlich
                  behandelt. Wir übernehmen die Aufbereitung – die Bewertung selbst liegt beim Leasinggeber.
                </p>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#anfrage"
                  className="inline-flex h-[3.25rem] items-center justify-center bg-champagne px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-champagne-light"
                >
                  Leasingrückgabe vorbereiten
                </a>
                <a
                  href={site.phoneHref}
                  className="inline-flex h-[3.25rem] items-center justify-center gap-2.5 border border-line-strong px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors duration-150 hover:border-ivory/45 hover:bg-ivory/[0.05]"
                >
                  <Phone className="h-4 w-4 text-champagne" strokeWidth={1.75} />
                  <span className="tnum">{site.phone}</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={80} className="relative aspect-[4/5] w-full lg:col-span-6">
              <Image
                src="/editorial/ueber-uns.jpg"
                alt="Aufbereiteter Lack eines Fahrzeugs bei Autokunst"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Anlässe + Anfrage */}
      <section className="border-t border-line bg-ink-850 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow lead-rule">Wann sich eine Aufbereitung lohnt</p>
              <h2 className="headline-md mt-5 text-ivory">Drei typische Anlässe.</h2>

              <dl className="mt-10 border-t border-line">
                {OCCASIONS.map((item) => (
                  <div key={item.title} className="border-b border-line py-6">
                    <dt className="font-display text-[1.0625rem] font-medium tracking-tight text-ivory">
                      {item.title}
                    </dt>
                    <dd className="mt-3 max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-ivory-400">
                      {item.text}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 max-w-2xl text-xs leading-relaxed text-ivory-500">
                Umfang und Aufwand einer Aufbereitung hängen vom Fahrzeug und seinem Zustand ab. Sprechen Sie uns an –
                wir sehen uns das Fahrzeug an und stimmen die passenden Leistungen mit Ihnen ab.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div id="anfrage" className="scroll-mt-28 lg:sticky lg:top-[92px]">
                <InquiryForm defaultTopic="aufbereitung" title="Aufbereitung anfragen" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactClosing />
    </>
  );
}
