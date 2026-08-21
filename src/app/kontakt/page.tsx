import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ContactPanel } from '@/components/contact/contact-panel';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: `NOVA MOTORS in ${site.city}: Telefon ${site.phone}, ${site.email}. Probefahrt, Beratung, Finanzierung und Ankauf – wir melden uns innerhalb eines Werktages.`,
};

export default async function KontaktPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.anlass;
  const anlass = Array.isArray(raw) ? raw[0] : raw;
  const vehicleRaw = params.fahrzeug;
  const vehicleSlug = Array.isArray(vehicleRaw) ? vehicleRaw[0] : vehicleRaw;

  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        title="Sprechen wir über Ihr nächstes Fahrzeug."
        lead="Am schnellsten geht es telefonisch. Schriftliche Anfragen beantworten wir innerhalb eines Werktages – vollständig und ohne Rückfrageschleifen."
      />

      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <ContactPanel anlass={anlass} vehicleSlug={vehicleSlug} />
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-line bg-ink-850">
                <div className="space-y-7 p-6 md:p-8">
                  <Item icon={Phone} label="Telefon">
                    <a href={site.phoneHref} className="tnum font-display text-xl tracking-tight text-ivory transition-colors hover:text-champagne">
                      {site.phone}
                    </a>
                    <p className="mt-1.5 text-[0.8125rem] text-ivory-500">Direkt zum Verkaufsteam</p>
                  </Item>

                  <Item icon={Mail} label="E-Mail">
                    <a href={`mailto:${site.email}`} className="text-[0.9375rem] text-ivory transition-colors hover:text-champagne">
                      {site.email}
                    </a>
                    <p className="mt-1.5 text-[0.8125rem] text-ivory-500">Antwort innerhalb eines Werktages</p>
                  </Item>

                  <Item icon={MapPin} label="Showroom">
                    <address className="text-[0.9375rem] not-italic leading-relaxed text-ivory">
                      {site.legalName}
                      <br />
                      {site.street}
                      <br />
                      {site.zip} {site.city}
                    </address>
                  </Item>

                  <Item icon={Clock} label="Öffnungszeiten">
                    <dl className="tnum space-y-1.5 text-[0.9375rem]">
                      {site.hours.map((h) => (
                        <div key={h.days} className="flex justify-between gap-6">
                          <dt className="text-ivory-400">{h.days}</dt>
                          <dd className="text-ivory">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </Item>
                </div>

                <div className="border-t border-line bg-ink-800/60 px-6 py-5 md:px-8">
                  <p className="text-[0.8125rem] leading-relaxed text-ivory-400">
                    Anfahrt: Aus der Innenstadt über die Hildesheimer Straße Richtung Süden, Parkplätze befinden sich
                    direkt am Gebäude. Besichtigungen außerhalb der Öffnungszeiten sind nach Absprache möglich.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function Item({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-1 h-4 w-4 shrink-0 text-champagne" strokeWidth={1.5} />
      <div className="min-w-0 flex-1">
        <p className="eyebrow-muted">{label}</p>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
