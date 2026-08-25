import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { VehicleExplorer } from '@/components/vehicles/vehicle-explorer';
import { MobileDeBand } from '@/components/vehicles/mobile-de-band';
import { getAllVehicles, countByStatus } from '@/lib/vehicle-repository';
import { parseFilters, parseSort } from '@/lib/filter-params';

export const metadata: Metadata = {
  title: 'Fahrzeugbestand',
  description:
    'Geprüfte Gebrauchtwagen von BMW, Mercedes-Benz, Porsche, Audi, Volkswagen und Land Rover. Filtern Sie nach Marke, Karosserie, Preis, Kilometerstand und Leistung.',
};

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const all = getAllVehicles();
  const { total, available, reserved } = countByStatus();

  return (
    <>
      <PageHeader
        eyebrow="Fahrzeugbestand"
        title="Ihr nächstes Automobil wartet hier."
        lead="Jedes Fahrzeug in unserem Bestand haben wir selbst geprüft, aufbereitet und dokumentiert. Was Sie hier sehen, steht in Langenhagen."
        aside={
          <dl className="tnum flex gap-8 md:flex-col md:gap-4 md:border-l md:border-line md:pl-8">
            <div>
              <dt className="eyebrow-muted">Im Bestand</dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ivory">{total}</dd>
            </div>
            <div>
              <dt className="eyebrow-muted">Sofort verfügbar</dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ivory">{available}</dd>
            </div>
            <div>
              <dt className="eyebrow-muted">Reserviert</dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-champagne">{reserved}</dd>
            </div>
          </dl>
        }
      />

      <VehicleExplorer all={all} initialFilters={parseFilters(params)} initialSort={parseSort(params)} />
      <MobileDeBand />
    </>
  );
}
