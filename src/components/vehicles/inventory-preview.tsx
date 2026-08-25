import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { MobileDeLink } from './mobile-de-band';
import { VehicleCard } from './vehicle-card';
import type { Vehicle } from '@/lib/types';

export function InventoryPreview({ vehicles, total }: { vehicles: Vehicle[]; total: number }) {
  return (
    <section id="fahrzeuge" className="section-y bg-ink-900">
      <div className="container">
        <SectionHeading
          eyebrow="Aktueller Bestand"
          title="Aktuelle Fahrzeuge"
          lead="Entdecken Sie unsere aktuellen Fahrzeuge und finden Sie das passende Automobil für Ihre nächste Fahrt."
          action={
            <Link
              href="/fahrzeuge"
              className="group inline-flex items-center gap-2.5 border-b border-line-strong pb-2 text-[0.8125rem] uppercase tracking-wider text-ivory transition-colors duration-150 hover:border-champagne"
            >
              Alle {total} Fahrzeuge
              <ArrowRight
                className="h-4 w-4 text-champagne transition-transform duration-200 ease-premium group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </Link>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
          ))}
        </div>

        <MobileDeLink className="mt-12" />
      </div>
    </section>
  );
}
