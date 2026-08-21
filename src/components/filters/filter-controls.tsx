'use client';

import * as React from 'react';
import { Check, Minus, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/formatting';
import {
  MILEAGE_STEPS,
  POWER_STEPS,
  PRICE_STEPS,
  YEAR_STEPS,
  facets,
  modelsForBrands,
  type VehicleFilters,
} from '@/lib/vehicle-utils';
import type { BodyType, Fuel, Transmission, Vehicle, VehicleStatus } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ANY = '__alle__';

function Group({
  title,
  children,
  defaultOpen = true,
  count,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-[0.8125rem] uppercase tracking-wider text-ivory">
          {title}
          {!!count && <span className="tnum text-champagne">({count})</span>}
        </span>
        {open ? (
          <Minus className="h-3.5 w-3.5 text-ivory-500" strokeWidth={1.75} />
        ) : (
          <Plus className="h-3.5 w-3.5 text-ivory-500" strokeWidth={1.75} />
        )}
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  hint?: number;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5">
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-150',
          checked ? 'border-champagne bg-champagne' : 'border-line-strong group-hover:border-ivory/40',
        )}
      >
        {checked && <Check className="h-3 w-3 text-ink-900" strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={cn('flex-1 text-[0.875rem] transition-colors', checked ? 'text-ivory' : 'text-ivory-300 group-hover:text-ivory')}>
        {label}
      </span>
      {hint != null && <span className="tnum text-xs text-ivory-500">{hint}</span>}
    </label>
  );
}

function Chips<T extends string>({
  options,
  values,
  onToggle,
}: {
  options: readonly T[];
  values: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={cn(
              'border px-3 py-2 text-[0.8125rem] transition-colors duration-150',
              active
                ? 'border-champagne bg-champagne/10 text-ivory'
                : 'border-line text-ivory-400 hover:border-line-strong hover:text-ivory',
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function FilterControls({
  all,
  filters,
  onChange,
}: {
  all: Vehicle[];
  filters: VehicleFilters;
  onChange: (next: VehicleFilters) => void;
}) {
  const f = React.useMemo(() => facets(all), [all]);
  const models = React.useMemo(() => modelsForBrands(all, filters.brands), [all, filters.brands]);

  const patch = (p: Partial<VehicleFilters>) => onChange({ ...filters, ...p });

  const toggle = <T extends string>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const countFor = (predicate: (v: Vehicle) => boolean) => all.filter(predicate).length;

  return (
    <div>
      {/* Freitext */}
      <div className="relative pb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-500" strokeWidth={1.75} />
        <input
          type="search"
          value={filters.q}
          onChange={(e) => patch({ q: e.target.value })}
          placeholder="Marke, Modell, Farbe …"
          aria-label="Fahrzeuge durchsuchen"
          className="field pl-11 pr-10"
        />
        {filters.q && (
          <button
            type="button"
            onClick={() => patch({ q: '' })}
            className="absolute right-3 top-[1.375rem] -translate-y-1/2 p-1 text-ivory-500 transition-colors hover:text-ivory"
            aria-label="Suche leeren"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      <Group title="Marke" count={filters.brands.length}>
        <div className="space-y-0.5">
          {f.brands.map((b) => (
            <CheckOption
              key={b}
              label={b}
              hint={countFor((v) => v.brand === b)}
              checked={filters.brands.includes(b)}
              onChange={() => patch({ brands: toggle(filters.brands, b), models: [] })}
            />
          ))}
        </div>
      </Group>

      <Group title="Modell" count={filters.models.length} defaultOpen={filters.brands.length > 0}>
        <div className="max-h-56 space-y-0.5 overflow-y-auto pr-1">
          {models.map((m) => (
            <CheckOption
              key={m}
              label={m}
              checked={filters.models.includes(m)}
              onChange={() => patch({ models: toggle(filters.models, m) })}
            />
          ))}
        </div>
      </Group>

      <Group title="Karosserie" count={filters.bodyTypes.length}>
        <Chips
          options={f.bodyTypes as BodyType[]}
          values={filters.bodyTypes}
          onToggle={(v) => patch({ bodyTypes: toggle(filters.bodyTypes, v) })}
        />
      </Group>

      <Group title="Preis" count={filters.priceMin != null || filters.priceMax != null ? 1 : 0}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="label">Von</span>
            <Select
              value={filters.priceMin == null ? ANY : String(filters.priceMin)}
              onValueChange={(v) => patch({ priceMin: v === ANY ? null : Number(v) })}
            >
              <SelectTrigger aria-label="Preis von">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Beliebig</SelectItem>
                {PRICE_STEPS.map((p) => (
                  <SelectItem key={p} value={String(p)}>
                    {formatNumber(p)} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="label">Bis</span>
            <Select
              value={filters.priceMax == null ? ANY : String(filters.priceMax)}
              onValueChange={(v) => patch({ priceMax: v === ANY ? null : Number(v) })}
            >
              <SelectTrigger aria-label="Preis bis">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Beliebig</SelectItem>
                {PRICE_STEPS.map((p) => (
                  <SelectItem key={p} value={String(p)}>
                    {formatNumber(p)} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Group>

      <Group title="Erstzulassung & Kilometer" count={(filters.yearMin != null ? 1 : 0) + (filters.mileageMax != null ? 1 : 0)}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="label">Ab Baujahr</span>
            <Select
              value={filters.yearMin == null ? ANY : String(filters.yearMin)}
              onValueChange={(v) => patch({ yearMin: v === ANY ? null : Number(v) })}
            >
              <SelectTrigger aria-label="Erstzulassung ab">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Beliebig</SelectItem>
                {YEAR_STEPS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    ab {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="label">Bis km</span>
            <Select
              value={filters.mileageMax == null ? ANY : String(filters.mileageMax)}
              onValueChange={(v) => patch({ mileageMax: v === ANY ? null : Number(v) })}
            >
              <SelectTrigger aria-label="Kilometerstand bis">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Beliebig</SelectItem>
                {MILEAGE_STEPS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    bis {formatNumber(m)} km
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Group>

      <Group title="Kraftstoff" count={filters.fuels.length}>
        <div className="space-y-0.5">
          {f.fuels.map((x) => (
            <CheckOption
              key={x}
              label={x}
              hint={countFor((v) => v.fuel === x)}
              checked={filters.fuels.includes(x as Fuel)}
              onChange={() => patch({ fuels: toggle(filters.fuels, x as Fuel) })}
            />
          ))}
        </div>
      </Group>

      <Group title="Getriebe & Leistung" count={filters.transmissions.length + (filters.powerMin != null ? 1 : 0)}>
        <Chips
          options={f.transmissions as Transmission[]}
          values={filters.transmissions}
          onToggle={(v) => patch({ transmissions: toggle(filters.transmissions, v) })}
        />
        <div className="mt-4">
          <span className="label">Leistung ab</span>
          <Select
            value={filters.powerMin == null ? ANY : String(filters.powerMin)}
            onValueChange={(v) => patch({ powerMin: v === ANY ? null : Number(v) })}
          >
            <SelectTrigger aria-label="Leistung ab">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Beliebig</SelectItem>
              {POWER_STEPS.map((p) => (
                <SelectItem key={p} value={String(p)}>
                  ab {p} PS
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Group>

      <Group title="Verfügbarkeit" count={filters.status.length} defaultOpen={false}>
        <Chips
          options={['Verfügbar', 'Reserviert', 'Verkauft'] as VehicleStatus[]}
          values={filters.status}
          onToggle={(v) => patch({ status: toggle(filters.status, v) })}
        />
      </Group>
    </div>
  );
}
