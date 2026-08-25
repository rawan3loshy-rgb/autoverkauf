import Image from 'next/image';
import { FileSearch, Handshake, SprayCan, Wrench } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const PILLARS = [
  {
    icon: FileSearch,
    title: 'Geprüfte Historie',
    text: 'Fahrzeugbrief, Vorbesitzer, Serviceeinträge und Laufleistung werden abgeglichen, bevor wir ein Fahrzeug übernehmen.',
  },
  {
    icon: Wrench,
    title: 'Technische Prüfung',
    text: 'Antrieb, Fahrwerk, Bremsen und Elektronik durchlaufen eine Prüfung in unserer Partnerwerkstatt.',
  },
  {
    icon: SprayCan,
    title: 'Professionelle Aufbereitung',
    text: 'Lack, Innenraum und Felgen werden aufbereitet – nicht kaschiert. Was nicht in Ordnung ist, wird instand gesetzt.',
  },
  {
    icon: Handshake,
    title: 'Transparente Beratung',
    text: 'Sie erhalten den Zustandsbericht vor dem Kauf. Auch die Punkte, die gegen ein Fahrzeug sprechen.',
  },
];

export function QualitySection() {
  return (
    <section className="section-y bg-ivory-100 text-ink-900">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow lead-rule text-champagne-dark">Auswahlkriterien</p>
            <h2 className="headline-lg mt-5 max-w-xl text-ink-900">
              Nicht jedes Fahrzeug schafft es in unsere Auswahl.
            </h2>
            <p className="mt-6 max-w-lg text-pretty text-[1.0625rem] leading-relaxed text-ink-900/65">
              Wir prüfen Fahrzeuge nicht nur auf den ersten Blick. Historie, Zustand und technische Details werden
              sorgfältig bewertet, bevor ein Fahrzeug Teil unseres Bestands wird.
            </p>
          </Reveal>

          <Reveal delay={80} className="relative aspect-[4/3] w-full overflow-hidden lg:col-span-5 lg:aspect-auto">
            <Image
              src="/editorial/qualitaet.jpg"
              alt="Fahrzeugprüfung in der Partnerwerkstatt von Autokunst"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-10 border-t border-ink-900/[0.12] pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 60} className="flex flex-col">
              <p.icon className="h-6 w-6 text-champagne-dark" strokeWidth={1.25} />
              <h3 className="mt-5 font-display text-[1.0625rem] font-semibold tracking-tight text-ink-900">{p.title}</h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-900/60">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
