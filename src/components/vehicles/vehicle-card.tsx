import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import { formatMileage, formatPrice, formatRegistration, ps } from '@/lib/formatting';

export function StatusBadge({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  if (vehicle.status === 'Verkauft') {
    return <Badge className={cn('bg-ink-900/85 text-ivory-300', className)}>Verkauft</Badge>;
  }
  if (vehicle.status === 'Reserviert') {
    return <Badge className={cn('bg-ink-900/85 text-champagne-light', className)}>Reserviert</Badge>;
  }
  if (vehicle.featured) {
    return <Badge className={cn('bg-champagne text-ink-900', className)}>Top Fahrzeug</Badge>;
  }
  return null;
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1.5 text-[0.625rem] font-medium uppercase tracking-widest backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function VehicleCard({
  vehicle,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: {
  vehicle: Vehicle;
  priority?: boolean;
  sizes?: string;
}) {
  const sold = vehicle.status === 'Verkauft';

  return (
    <article className="group relative">
      <Link href={`/fahrzeuge/${vehicle.slug}`} className="block focus-visible:outline-none">
        <div className="relative aspect-[3/2] overflow-hidden bg-ink-800">
          <Image
            src={vehicle.images[0].src}
            alt={vehicle.images[0].alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn(
              'object-cover transition-transform duration-700 ease-premium will-change-transform group-hover:scale-[1.035]',
              sold && 'opacity-[0.62] grayscale',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent opacity-70" />

          <div className="absolute left-0 top-0">
            <StatusBadge vehicle={vehicle} />
          </div>

          {/* Erscheint erst beim Hover – auf Touch-Geräten stört es nicht. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3.5 opacity-0 transition-opacity duration-200 ease-premium group-hover:opacity-100">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-ivory">Details ansehen</span>
            <ArrowUpRight className="h-4 w-4 text-ivory" strokeWidth={1.75} />
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate font-display text-[1.0625rem] font-medium tracking-tight text-ivory">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="mt-0.5 truncate text-[0.8125rem] text-ivory-400">{vehicle.variant}</p>
            </div>
            <p
              className={cn(
                'tnum shrink-0 font-display text-[1.0625rem] font-semibold tracking-tight',
                sold ? 'text-ivory-500 line-through decoration-1' : 'text-ivory',
              )}
            >
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <dl className="tnum mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-3.5 text-[0.75rem] text-ivory-400">
            <Spec label="Erstzulassung" value={formatRegistration(vehicle.firstRegistration)} />
            <Dot />
            <Spec label="Kilometerstand" value={formatMileage(vehicle.mileage)} />
            <Dot />
            <Spec label="Kraftstoff" value={vehicle.fuel.replace(/ \(.*\)/, '')} />
            <Dot />
            <Spec label="Leistung" value={`${ps(vehicle.powerKw)} PS`} />
          </dl>
        </div>
      </Link>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="contents">
      <dt className="sr-only">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Dot() {
  return <span aria-hidden className="text-ivory-500/50">·</span>;
}
