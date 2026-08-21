import Link from 'next/link';
import { ArrowRight, CalendarClock, Car, PiggyBank, Repeat } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { FinanceCalculator } from './finance-calculator';

const OPTIONS = [
  { icon: PiggyBank, title: 'Finanzierung', text: 'Klassisch mit vollständiger Tilgung oder mit planbarer Schlussrate.' },
  { icon: Car, title: 'Leasing', text: 'Für Gewerbetreibende mit fester Laufzeit und vereinbarter Laufleistung.' },
  { icon: CalendarClock, title: 'Individuelle Laufzeit', text: '24 bis 72 Monate – abgestimmt auf Ihre monatliche Belastung.' },
  { icon: Repeat, title: 'Inzahlungnahme', text: 'Ihr aktuelles Fahrzeug wird bewertet und auf den Kaufpreis angerechnet.' },
];

export function FinancingSection({ price, vehicleLabel }: { price: number; vehicleLabel: string }) {
  return (
    <section id="finanzierung" className="section-y bg-ivory-100 text-ink-900">
      <div className="container">
        <SectionHeading
          tone="light"
          eyebrow="Finanzierung & Leasing"
          title={
            <>
              Ihr Fahrzeug.
              <br />
              Ihre Möglichkeiten.
            </>
          }
          lead="Ob Anzahlung, Laufzeit oder Schlussrate – wir stellen die Finanzierung so zusammen, dass die monatliche Rate zu Ihnen passt."
        />

        <div className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {OPTIONS.map((o, i) => (
            <Reveal key={o.title} delay={i * 55} className="border-t border-ink-900/[0.12] pt-5">
              <o.icon className="h-5 w-5 text-champagne-dark" strokeWidth={1.25} />
              <h3 className="mt-4 font-display text-[0.9375rem] font-semibold tracking-tight">{o.title}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-900/60">{o.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <FinanceCalculator price={price} vehicleLabel={vehicleLabel} tone="light" />
        </Reveal>

        {/* Inzahlungnahme */}
        <Reveal className="mt-10 flex flex-col gap-6 border border-ink-900/[0.12] bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-xl">
            <h3 className="headline-sm text-ink-900">Fahrzeug in Zahlung geben</h3>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-900/60">
              Sie möchten ein anderes Fahrzeug kaufen und Ihr aktuelles Fahrzeug abgeben? Wir bewerten Ihr Fahrzeug und
              rechnen den Betrag direkt auf den Kaufpreis an.
            </p>
          </div>
          <Link
            href="/ankauf?anlass=inzahlungnahme"
            className="group inline-flex h-[3.25rem] shrink-0 items-center justify-center gap-2.5 border border-ink-900 px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-ink-900 hover:text-ivory"
          >
            Inzahlungnahme anfragen
            <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
