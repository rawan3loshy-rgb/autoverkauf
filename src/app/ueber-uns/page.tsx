import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/page-header';
import { StatsBand } from '@/components/trust/stats-band';
import { QualitySection } from '@/components/trust/quality-section';
import { ShowroomSection } from '@/components/showroom/showroom-section';
import { ContactClosing } from '@/components/contact/contact-closing';
import { Reveal } from '@/components/ui/reveal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Über uns',
  description: `NOVA MOTORS aus ${site.city}: Ankauf und Verkauf ausgewählter Gebrauchtwagen seit über 15 Jahren. Geprüfte Fahrzeuge, dokumentierte Historie, persönliche Beratung.`,
};

const PRINCIPLES = [
  {
    title: 'Weniger Fahrzeuge, bessere Fahrzeuge',
    text: 'Wir halten den Bestand bewusst klein. Jedes Fahrzeug, das hier steht, haben wir selbst geprüft und würden es auch selbst fahren. Was nicht überzeugt, kaufen wir nicht an.',
  },
  {
    title: 'Der Zustandsbericht kommt vor dem Preis',
    text: 'Sie erfahren, was am Fahrzeug gemacht wurde und was noch ansteht – vor der Probefahrt, nicht danach. Ein Steinschlag bleibt ein Steinschlag, auch im Verkaufsgespräch.',
  },
  {
    title: 'Ein Ansprechpartner, vom ersten Anruf bis zur Übergabe',
    text: 'Keine Warteschleife, keine wechselnden Zuständigkeiten. Wer Ihr Fahrzeug bewertet, begleitet Sie auch durch Finanzierung, Zulassung und Übergabe.',
  },
];

export default function UeberUnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Über uns"
        title="Automobile mit Charakter."
        lead="NOVA MOTORS ist ein inhabergeführter Fahrzeughandel in Hannover. Wir kaufen und verkaufen ausgewählte Fahrzeuge – seit über 15 Jahren, mit einem kleinen Team und einem klaren Anspruch."
      />

      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-6">
              <p className="eyebrow lead-rule">Unser Weg</p>
              <h2 className="headline-md mt-5 text-ivory">
                Aus einer Halle in der Südstadt wurde ein Bestand mit Handschrift.
              </h2>
              <div className="mt-7 space-y-5 text-pretty text-[1.0625rem] leading-relaxed text-ivory-300">
                <p>
                  Angefangen haben wir 2011 mit vier Stellplätzen und dem Anspruch, Fahrzeuge so zu verkaufen, wie wir
                  sie selbst kaufen würden: vollständig dokumentiert, technisch geprüft und ohne Überraschungen nach der
                  Übergabe.
                </p>
                <p>
                  Heute betreuen wir Kundinnen und Kunden in ganz Deutschland. Der Anspruch ist derselbe geblieben. Wir
                  verkaufen keine Fahrzeuge, die wir nicht kennen – und wir kaufen keine an, bei denen sich die Historie
                  nicht nachvollziehen lässt.
                </p>
                <p>
                  Ein großer Teil unseres Bestands kommt aus dem direkten Ankauf von Privatpersonen aus der Region. Das
                  ist aufwendiger als der Zukauf über Auktionen, aber wir wissen dadurch, woher ein Fahrzeug kommt.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80} className="relative aspect-[4/5] w-full lg:col-span-6">
              <Image
                src="/editorial/ueber-uns.jpg"
                alt={`Fahrzeuge im Showroom von ${site.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </Reveal>
          </div>

          <div className="mt-20 grid gap-x-8 gap-y-10 border-t border-line pt-12 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <p className="tnum eyebrow-muted">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-4 font-display text-[1.0625rem] font-semibold tracking-tight text-ivory">{p.title}</h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ivory-400">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatsBand tone="dark" />
      <QualitySection />
      <ShowroomSection />
      <ContactClosing />
    </>
  );
}
