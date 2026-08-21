'use client';

import * as React from 'react';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import {
  activeFilterCount,
  emptyFilters,
  filterVehicles,
  sortVehicles,
  SORT_OPTIONS,
  type SortKey,
  type VehicleFilters,
} from '@/lib/vehicle-utils';
import { serializeFilters } from '@/lib/filter-params';
import { formatNumber } from '@/lib/formatting';
import { FilterControls } from '@/components/filters/filter-controls';
import { VehicleCard } from './vehicle-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function VehicleExplorer({
  all,
  initialFilters,
  initialSort,
}: {
  all: Vehicle[];
  initialFilters: VehicleFilters;
  initialSort: SortKey;
}) {
  const [filters, setFilters] = React.useState<VehicleFilters>(initialFilters);
  const [sort, setSort] = React.useState<SortKey>(initialSort);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  /**
   * Die URL wird direkt über die History-API nachgezogen – ohne Navigation, ohne
   * Server-Roundtrip und ohne Scrollsprung. Ein `router.replace` würde bei jedem
   * Tastendruck eine RSC-Anfrage auslösen; die Filterung läuft ohnehin lokal.
   * Der kurze Verzug fasst schnelles Tippen zu einem Eintrag zusammen.
   */
  React.useEffect(() => {
    const target = `/fahrzeuge${serializeFilters(filters, sort)}`;
    const id = window.setTimeout(() => {
      if (window.location.pathname + window.location.search !== target) {
        window.history.replaceState(null, '', target);
      }
    }, 220);
    return () => window.clearTimeout(id);
  }, [filters, sort]);

  React.useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  const results = React.useMemo(() => sortVehicles(filterVehicles(all, filters), sort), [all, filters, sort]);
  const active = activeFilterCount(filters);
  const reset = () => setFilters({ ...emptyFilters });

  const chips = buildChips(filters, setFilters);

  return (
    <div className="container pb-24 pt-10 md:pt-14">
      <div className="lg:grid lg:grid-cols-[17rem_1fr] lg:gap-12 xl:grid-cols-[19rem_1fr]">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-[92px] max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <div className="flex items-baseline justify-between pb-2">
              <h2 className="text-[0.8125rem] uppercase tracking-wider text-ivory">Filter</h2>
              {active > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-ivory-400 underline-offset-4 transition-colors hover:text-champagne hover:underline"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
            <FilterControls all={all} filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Ergebniskopf */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="tnum text-[0.9375rem] text-ivory">
              {formatNumber(results.length)} {results.length === 1 ? 'Fahrzeug' : 'Fahrzeuge'}{' '}
              <span className="text-ivory-400">gefunden</span>
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex h-11 items-center gap-2 border border-line px-4 text-[0.8125rem] text-ivory transition-colors hover:border-line-strong lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-champagne" strokeWidth={1.75} />
                Filter
                {active > 0 && <span className="tnum text-champagne">({active})</span>}
              </button>

              <div className="w-[13.5rem]">
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger aria-label="Sortierung" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Aktive Filter */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-5">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={c.remove}
                  className="group inline-flex items-center gap-2 border border-line bg-ink-800 py-1.5 pl-3 pr-2.5 text-[0.8125rem] text-ivory-300 transition-colors hover:border-line-strong hover:text-ivory"
                >
                  {c.label}
                  <X className="h-3 w-3 text-ivory-500 transition-colors group-hover:text-champagne" strokeWidth={2.5} />
                </button>
              ))}
              <button
                type="button"
                onClick={reset}
                className="ml-1 text-[0.8125rem] text-ivory-400 underline-offset-4 transition-colors hover:text-champagne hover:underline"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}

          {/* Ergebnisse */}
          {results.length > 0 ? (
            <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((v, i) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  priority={i < 3}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 30vw"
                />
              ))}
            </div>
          ) : (
            <div className="mt-16 border border-line bg-ink-850 px-6 py-16 text-center">
              <h3 className="headline-sm text-ivory">Kein Fahrzeug passt zu dieser Auswahl.</h3>
              <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ivory-400">
                Setzen Sie einzelne Filter zurück – oder sagen Sie uns, wonach Sie suchen. Wir finden das passende
                Fahrzeug über unser Händlernetz.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-12 items-center justify-center bg-ivory px-6 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors hover:bg-white"
                >
                  Filter zurücksetzen
                </button>
                <Link
                  href="/kontakt?anlass=suchauftrag"
                  className="inline-flex h-12 items-center justify-center border border-line-strong px-6 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors hover:border-ivory/45"
                >
                  Suchauftrag aufgeben
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter-Sheet für Mobile */}
      <div className={cn('fixed inset-0 z-[60] lg:hidden', sheetOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn(
            'absolute inset-0 bg-ink-900/85 backdrop-blur-[2px] transition-opacity duration-200',
            sheetOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setSheetOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 top-14 flex flex-col border-t border-line-strong bg-ink-850 transition-transform duration-250 ease-premium',
            sheetOpen ? 'translate-y-0' : 'translate-y-full',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Filter"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-[0.8125rem] uppercase tracking-wider text-ivory">Filter</h2>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="-mr-2 p-2 text-ivory-400 transition-colors hover:text-ivory"
              aria-label="Filter schließen"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
            <FilterControls all={all} filters={filters} onChange={setFilters} />
          </div>

          <div className="flex items-center gap-3 border-t border-line bg-ink-900 px-5 py-4">
            <button
              type="button"
              onClick={reset}
              className="h-12 shrink-0 border border-line px-5 text-[0.8125rem] uppercase tracking-wider text-ivory-300"
            >
              Zurücksetzen
            </button>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="tnum h-12 flex-1 bg-ivory text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900"
            >
              {formatNumber(results.length)} Fahrzeuge anzeigen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type Chip = { key: string; label: string; remove: () => void };

function buildChips(filters: VehicleFilters, set: (f: VehicleFilters) => void): Chip[] {
  const chips: Chip[] = [];
  const drop = <K extends keyof VehicleFilters>(key: K, value: string) =>
    set({ ...filters, [key]: (filters[key] as string[]).filter((v) => v !== value) } as VehicleFilters);

  if (filters.q.trim()) {
    chips.push({ key: 'q', label: `„${filters.q.trim()}“`, remove: () => set({ ...filters, q: '' }) });
  }
  for (const b of filters.brands) chips.push({ key: `b-${b}`, label: b, remove: () => drop('brands', b) });
  for (const m of filters.models) chips.push({ key: `m-${m}`, label: m, remove: () => drop('models', m) });
  for (const b of filters.bodyTypes) chips.push({ key: `k-${b}`, label: b, remove: () => drop('bodyTypes', b) });
  for (const x of filters.fuels) chips.push({ key: `f-${x}`, label: x, remove: () => drop('fuels', x) });
  for (const x of filters.transmissions) chips.push({ key: `g-${x}`, label: x, remove: () => drop('transmissions', x) });
  for (const x of filters.status) chips.push({ key: `s-${x}`, label: x, remove: () => drop('status', x) });

  if (filters.priceMin != null)
    chips.push({ key: 'pmin', label: `ab ${formatNumber(filters.priceMin)} €`, remove: () => set({ ...filters, priceMin: null }) });
  if (filters.priceMax != null)
    chips.push({ key: 'pmax', label: `bis ${formatNumber(filters.priceMax)} €`, remove: () => set({ ...filters, priceMax: null }) });
  if (filters.yearMin != null)
    chips.push({ key: 'ez', label: `ab ${filters.yearMin}`, remove: () => set({ ...filters, yearMin: null }) });
  if (filters.mileageMax != null)
    chips.push({ key: 'km', label: `bis ${formatNumber(filters.mileageMax)} km`, remove: () => set({ ...filters, mileageMax: null }) });
  if (filters.powerMin != null)
    chips.push({ key: 'ps', label: `ab ${filters.powerMin} PS`, remove: () => set({ ...filters, powerMin: null }) });

  return chips;
}
