'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { vehicles } from '@/data/vehicles';
import { emptyFilters, facets, filterVehicles, modelsForBrands, type VehicleFilters } from '@/lib/vehicle-utils';
import { serializeFilters } from '@/lib/filter-params';
import { formatNumber } from '@/lib/formatting';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BodyType, Fuel } from '@/lib/types';

const ANY = '__alle__';

const PRICE_OPTIONS = [30000, 50000, 75000, 100000, 150000];
const MILEAGE_OPTIONS = [10000, 25000, 50000, 75000, 100000];

/**
 * Suchmodul, das den unteren Bereich des Heros überlagert.
 * Die Trefferzahl aktualisiert sich beim Tippen – die Suche fühlt sich damit an,
 * als würde sie bereits laufen, bevor man sie absendet.
 */
export function HeroSearch() {
  const router = useRouter();
  const f = facets(vehicles);

  const [brand, setBrand] = React.useState(ANY);
  const [model, setModel] = React.useState(ANY);
  const [priceMax, setPriceMax] = React.useState(ANY);
  const [fuel, setFuel] = React.useState(ANY);
  const [mileageMax, setMileageMax] = React.useState(ANY);
  const [body, setBody] = React.useState(ANY);

  const filters: VehicleFilters = React.useMemo(
    () => ({
      ...emptyFilters,
      brands: brand === ANY ? [] : [brand],
      models: model === ANY ? [] : [model],
      bodyTypes: body === ANY ? [] : [body as BodyType],
      fuels: fuel === ANY ? [] : [fuel as Fuel],
      priceMax: priceMax === ANY ? null : Number(priceMax),
      mileageMax: mileageMax === ANY ? null : Number(mileageMax),
    }),
    [brand, model, body, fuel, priceMax, mileageMax],
  );

  const count = React.useMemo(() => filterVehicles(vehicles, filters).length, [filters]);
  const models = React.useMemo(() => modelsForBrands(vehicles, brand === ANY ? [] : [brand]), [brand]);

  // Modell zurücksetzen, sobald es nicht mehr zur gewählten Marke gehört.
  React.useEffect(() => {
    if (model !== ANY && !models.includes(model)) setModel(ANY);
  }, [models, model]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    router.push(`/fahrzeuge${serializeFilters(filters)}`);
  };

  return (
    <div className="container relative z-20 -mt-[4.5rem] md:-mt-[6rem]">
      <form
        onSubmit={submit}
        className="border border-line-strong bg-ink-850/[0.92] p-5 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl md:p-7"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-lg font-medium tracking-tight text-ivory">Was suchen Sie?</h2>
          <p className="tnum text-[0.8125rem] text-ivory-400">
            <span className="text-ivory">{formatNumber(count)}</span>{' '}
            {count === 1 ? 'Fahrzeug' : 'Fahrzeuge'} im Bestand
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Field label="Marke">
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger aria-label="Marke">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Alle Marken</SelectItem>
                {f.brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Modell">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger aria-label="Modell">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Alle Modelle</SelectItem>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Preis bis">
            <Select value={priceMax} onValueChange={setPriceMax}>
              <SelectTrigger aria-label="Preis bis">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Beliebig</SelectItem>
                {PRICE_OPTIONS.map((p) => (
                  <SelectItem key={p} value={String(p)}>
                    bis {formatNumber(p)} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Kraftstoff">
            <Select value={fuel} onValueChange={setFuel}>
              <SelectTrigger aria-label="Kraftstoff">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Alle</SelectItem>
                {f.fuels.map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Kilometerstand">
            <Select value={mileageMax} onValueChange={setMileageMax}>
              <SelectTrigger aria-label="Kilometerstand">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Beliebig</SelectItem>
                {MILEAGE_OPTIONS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    bis {formatNumber(m)} km
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Karosserie">
            <Select value={body} onValueChange={setBody}>
              <SelectTrigger aria-label="Karosserie">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Alle</SelectItem>
                {f.bodyTypes.map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/fahrzeuge"
            className="inline-flex items-center gap-2 text-[0.8125rem] text-ivory-400 transition-colors duration-150 hover:text-ivory"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-champagne" strokeWidth={1.75} />
            Erweiterte Suche
          </Link>

          <button
            type="submit"
            className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-ivory px-8 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-white sm:h-12"
          >
            <Search className="h-4 w-4 sm:hidden" strokeWidth={2} />
            Fahrzeuge anzeigen
            <ArrowRight
              className="hidden h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1 sm:block"
              strokeWidth={1.75}
            />
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}
