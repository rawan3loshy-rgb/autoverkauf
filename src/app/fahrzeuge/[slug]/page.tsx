import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getAllVehicles, getVehicleBySlug, getVehicleSlugs } from '@/lib/vehicle-repository';
import { fullName, similarVehicles } from '@/lib/vehicle-utils';
import { formatPrice, formatMileage, formatRegistration, ps } from '@/lib/formatting';
import { Gallery } from '@/components/vehicle-detail/gallery';
import { PurchasePanel } from '@/components/vehicle-detail/purchase-panel';
import { SpecTable } from '@/components/vehicle-detail/spec-table';
import { FeatureList } from '@/components/vehicle-detail/feature-list';
import { VehicleInquiry } from '@/components/vehicle-detail/vehicle-inquiry';
import { VehicleCard } from '@/components/vehicles/vehicle-card';

export function generateStaticParams() {
  return getVehicleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return { title: 'Fahrzeug nicht gefunden' };
  const name = fullName(vehicle);
  return {
    title: `${name} · ${formatPrice(vehicle.price)}`,
    description: `${name}, Erstzulassung ${formatRegistration(vehicle.firstRegistration)}, ${formatMileage(
      vehicle.mileage,
    )}, ${ps(vehicle.powerKw)} PS. ${vehicle.headline}`,
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const name = fullName(vehicle);
  const similar = similarVehicles(getAllVehicles(), vehicle, 3);

  return (
    <>
      <div className="bg-ink-900 pt-[6.5rem] md:pt-[8rem]">
        <div className="container">
          {/* Brotkrumen */}
          <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1.5 py-5 text-xs text-ivory-500">
            <Link href="/" className="transition-colors hover:text-ivory">
              Start
            </Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <Link href="/fahrzeuge" className="transition-colors hover:text-ivory">
              Fahrzeuge
            </Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <Link href={`/fahrzeuge?marke=${encodeURIComponent(vehicle.brand)}`} className="transition-colors hover:text-ivory">
              {vehicle.brand}
            </Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-ivory-400">{vehicle.model}</span>
          </nav>

          <div className="border-b border-line pb-8 pt-2">
            <p className="eyebrow">{vehicle.bodyType}</p>
            <h1 className="headline-md mt-3 text-ivory">
              {vehicle.brand} {vehicle.model}{' '}
              <span className="font-normal text-ivory-300">{vehicle.variant}</span>
            </h1>
            <p className="mt-3 text-[1.0625rem] text-ivory-400">{vehicle.headline}</p>
          </div>
        </div>
      </div>

      <div className="bg-ink-900 pb-20 pt-8 md:pb-28">
        <div className="container">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7 xl:col-span-8">
              <Gallery vehicle={vehicle} />
            </div>

            <div className="mt-8 lg:col-span-5 lg:mt-0 xl:col-span-4">
              <div className="lg:sticky lg:top-[92px]">
                <PurchasePanel vehicle={vehicle} />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="flex flex-wrap gap-2">
                {vehicle.highlights.map((h) => (
                  <span key={h} className="border border-line bg-ink-850 px-3 py-2 text-[0.8125rem] text-ivory-300">
                    {h}
                  </span>
                ))}
              </div>

              <div className="mt-10">
                <h2 className="headline-sm text-ivory">Zum Fahrzeug</h2>
                <p className="mt-5 max-w-2xl text-pretty text-[1.0625rem] leading-relaxed text-ivory-300">
                  {vehicle.description}
                </p>
              </div>

              <SpecTable vehicle={vehicle} className="mt-14" />
              <div className="mt-14">
                <FeatureList vehicle={vehicle} />
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <div id="anfrage" className="scroll-mt-28">
                <VehicleInquiry vehicleLabel={name} vehicleId={vehicle.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ähnliche Fahrzeuge */}
      {similar.length > 0 && (
        <section className="border-t border-line bg-ink-900 py-20 md:py-24">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="headline-md text-ivory">Ebenfalls im Bestand</h2>
              <Link
                href="/fahrzeuge"
                className="border-b border-line-strong pb-1.5 text-[0.8125rem] uppercase tracking-wider text-ivory transition-colors hover:border-champagne"
              >
                Alle Fahrzeuge
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
