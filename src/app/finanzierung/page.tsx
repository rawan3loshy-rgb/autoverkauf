import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { FinanceCalculator } from '@/components/financing/finance-calculator';
import { InquiryForm } from '@/components/contact/inquiry-form';
import { Reveal } from '@/components/ui/reveal';
import { getVehicleBySlug, getFeaturedVehicles } from '@/lib/vehicle-repository';
import { fullName } from '@/lib/vehicle-utils';

export const metadata: Metadata = {
  title: 'Finanzierung & Leasing',
  description:
    'Finanzierung, Leasing und Inzahlungnahme bei Autokunst. Beispielrechnung mit Anzahlung, Laufzeit und optionaler Schlussrate.',
};

const FAQ = [
  {
    q: 'Welche Unterlagen werden benötigt?',
    a: 'Für eine Finanzierungsanfrage genügen zunächst Personalausweis, die letzten drei Gehaltsnachweise und die Bankverbindung. Bei Selbstständigen treten die Einkommensteuerbescheide der letzten beiden Jahre an deren Stelle.',
  },
  {
    q: 'Was unterscheidet die 3-Wege-Finanzierung?',
    a: 'Bei der 3-Wege-Finanzierung bleibt ein Teil des Kaufpreises als Schlussrate stehen. Die monatliche Belastung sinkt dadurch spürbar. Am Ende der Laufzeit entscheiden Sie: Schlussrate zahlen, anschließend finanzieren oder das Fahrzeug zurückgeben.',
  },
  {
    q: 'Kann ich mein aktuelles Fahrzeug anrechnen lassen?',
    a: 'Ja. Wir bewerten Ihr Fahrzeug und rechnen den Betrag als Anzahlung an. Die Bewertung starten Sie über das Ankaufsformular – die Angaben dauern etwa drei Minuten.',
  },
  {
    q: 'Ist Leasing auch für Privatpersonen möglich?',
    a: 'Wir vermitteln Leasing überwiegend an Gewerbetreibende und Freiberufler. Für Privatkunden ist die Finanzierung in den meisten Fällen die wirtschaftlichere Variante – wir rechnen beide Wege gerne gegenüber.',
  },
];

export default function FinanzierungPage() {
  const vehicle = getVehicleBySlug('bmw-m4-competition-xdrive') ?? getFeaturedVehicles(1)[0];

  return (
    <>
      <PageHeader
        eyebrow="Finanzierung & Leasing"
        title="Ihr Fahrzeug. Ihre Möglichkeiten."
        lead="Anzahlung, Laufzeit, Schlussrate: Wir stellen die Finanzierung so zusammen, dass die monatliche Rate zu Ihrer Situation passt – und rechnen Ihnen die Alternativen offen vor."
      />

      <section className="bg-ink-900 py-16 md:py-20">
        <div className="container">
          <Reveal>
            <FinanceCalculator
              price={vehicle.price}
              vehicleLabel={fullName(vehicle)}
              tone="dark"
              requestHref="#anfrage"
            />
          </Reveal>

          <Reveal className="mt-6 flex flex-col gap-4 border border-line bg-ink-850 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9375rem] text-ivory-300">
              Rechnung für ein konkretes Fahrzeug aus dem Bestand ansehen?
            </p>
            <Link
              href="/fahrzeuge"
              className="group inline-flex items-center gap-2.5 border-b border-line-strong pb-1.5 text-[0.8125rem] uppercase tracking-wider text-ivory transition-colors hover:border-champagne"
            >
              Zum Fahrzeugbestand
              <ArrowRight className="h-4 w-4 text-champagne transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Fragen */}
      <section className="border-t border-line bg-ink-850 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow lead-rule">Häufige Fragen</p>
              <h2 className="headline-md mt-5 text-ivory">Was Sie vorher wissen sollten.</h2>

              <dl className="mt-10 border-t border-line">
                {FAQ.map((item) => (
                  <div key={item.q} className="border-b border-line py-6">
                    <dt className="font-display text-[1.0625rem] font-medium tracking-tight text-ivory">{item.q}</dt>
                    <dd className="mt-3 max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-ivory-400">
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 max-w-2xl text-xs leading-relaxed text-ivory-500">
                Hinweis: Sämtliche Angaben auf dieser Seite gehören zu einem Demonstrationsprojekt. Es werden keine
                Finanzierungen vermittelt, keine Konditionen zugesagt und keine Bonitätsprüfungen durchgeführt.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div id="anfrage" className="scroll-mt-28 lg:sticky lg:top-[92px]">
                <InquiryForm defaultTopic="finanzierung" title="Finanzierung anfragen" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
