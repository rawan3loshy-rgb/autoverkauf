import type { Metadata } from 'next';
import Image from 'next/image';
import { Banknote, Clock, FileCheck, Truck } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { SellForm } from '@/components/sell-car/sell-form';
import { Reveal } from '@/components/ui/reveal';
import { ContactClosing } from '@/components/contact/contact-closing';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Fahrzeugankauf',
  description:
    'Fahrzeug verkaufen oder in Zahlung geben: Beschreiben Sie Ihr Fahrzeug in vier Schritten und erhalten Sie eine Einschätzung von Autokunst in Hannover.',
};

const ADVANTAGES = [
  { icon: Clock, title: 'Rückmeldung in 24 Stunden', text: 'An Werktagen melden wir uns in der Regel noch am selben oder am nächsten Tag.' },
  { icon: Banknote, title: 'Sofortige Zahlungsabwicklung', text: 'Der Kaufpreis wird bei Übergabe per Echtzeitüberweisung angewiesen.' },
  { icon: FileCheck, title: 'Abmeldung inklusive', text: 'Wir übernehmen die Abmeldung und alle Formalitäten für Sie.' },
  { icon: Truck, title: 'Deutschlandweite Abholung', text: 'Auf Wunsch holen wir das Fahrzeug bei Ihnen vor Ort ab.' },
];

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
    text: 'Wir besprechen das Angebot persönlich und kümmern uns um die nächsten Schritte.',
  },
];

export default async function AnkaufPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.anlass;
  const occasion = (Array.isArray(raw) ? raw[0] : raw) === 'inzahlungnahme' ? 'inzahlungnahme' : 'ankauf';
  const isTradeIn = occasion === 'inzahlungnahme';

  return (
    <>
      <PageHeader
        eyebrow={isTradeIn ? 'Inzahlungnahme' : 'Fahrzeugankauf'}
        title={isTradeIn ? 'Ihr Fahrzeug. Auf Ihren Kaufpreis angerechnet.' : 'Ihr Fahrzeug. Unser Angebot.'}
        lead={
          isTradeIn
            ? 'Sie möchten ein Fahrzeug aus unserem Bestand kaufen und Ihr aktuelles abgeben? Beschreiben Sie es kurz – wir bewerten es und rechnen den Betrag direkt an.'
            : 'Sie möchten Ihr Fahrzeug verkaufen? Lassen Sie uns wissen, was Sie fahren. Wir kaufen deutschlandweit an – vom gepflegten Kombi bis zum Sportwagen.'
        }
      />

      {/* Ablauf */}
      <section className="border-b border-line bg-ink-900 py-16 md:py-20">
        <div className="container">
          <p className="eyebrow lead-rule">So funktioniert der Ankauf</p>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} className="border-t border-line pt-6">
                <p className="tnum font-display text-[2rem] font-semibold leading-none tracking-tighter text-champagne/85">
                  {s.n}
                </p>
                <h3 className="mt-4 font-display text-[1.0625rem] font-semibold tracking-tight text-ivory">{s.title}</h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ivory-400">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Formular */}
      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 xl:col-span-8">
              <SellForm occasion={occasion} />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-[92px]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/editorial/ankauf-portrait.jpg"
                    alt="Fahrzeugbewertung bei Autokunst"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <ul className="mt-8 space-y-7">
                  {ADVANTAGES.map((a) => (
                    <li key={a.title} className="flex gap-4">
                      <a.icon className="mt-0.5 h-5 w-5 shrink-0 text-champagne" strokeWidth={1.25} />
                      <div>
                        <h3 className="font-display text-[0.9375rem] font-semibold tracking-tight text-ivory">{a.title}</h3>
                        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ivory-400">{a.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border border-line bg-ink-850 p-6">
                  <p className="eyebrow-muted">Lieber persönlich?</p>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-ivory-300">
                    Rufen Sie uns an – wir nehmen die Daten gemeinsam mit Ihnen auf.
                  </p>
                  <a
                    href={site.phoneHref}
                    className="tnum mt-4 inline-block font-display text-xl tracking-tight text-ivory transition-colors hover:text-champagne"
                  >
                    {site.phone}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ContactClosing />
    </>
  );
}
