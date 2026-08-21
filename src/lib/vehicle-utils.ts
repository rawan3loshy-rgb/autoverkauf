import type { BodyType, Fuel, Transmission, Vehicle, VehicleStatus } from './types';
import { ps } from './formatting';

export interface VehicleFilters {
  q: string;
  brands: string[];
  models: string[];
  bodyTypes: BodyType[];
  fuels: Fuel[];
  transmissions: Transmission[];
  priceMin: number | null;
  priceMax: number | null;
  yearMin: number | null;
  mileageMax: number | null;
  powerMin: number | null;
  status: VehicleStatus[];
}

export const emptyFilters: VehicleFilters = {
  q: '',
  brands: [],
  models: [],
  bodyTypes: [],
  fuels: [],
  transmissions: [],
  priceMin: null,
  priceMax: null,
  yearMin: null,
  mileageMax: null,
  powerMin: null,
  status: [],
};

export type SortKey =
  | 'empfehlung'
  | 'preis-auf'
  | 'preis-ab'
  | 'km-auf'
  | 'ez-ab'
  | 'leistung-ab';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'empfehlung', label: 'Empfehlung' },
  { value: 'preis-auf', label: 'Preis aufsteigend' },
  { value: 'preis-ab', label: 'Preis absteigend' },
  { value: 'km-auf', label: 'Kilometerstand' },
  { value: 'ez-ab', label: 'Erstzulassung' },
  { value: 'leistung-ab', label: 'Leistung' },
];

export function fullName(v: Vehicle): string {
  return `${v.brand} ${v.model} ${v.variant}`.replace(/\s+/g, ' ').trim();
}

export function shortName(v: Vehicle): string {
  return `${v.brand} ${v.model}`;
}

export function registrationYear(v: Vehicle): number {
  return Number(v.firstRegistration.slice(0, 4));
}

/** Freitextsuche über Marke, Modell, Variante, Karosserie, Farbe und Highlights. */
function matchesQuery(v: Vehicle, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    v.brand,
    v.model,
    v.variant,
    v.bodyType,
    v.fuel,
    v.color,
    v.colorFinish,
    v.transmission,
    v.drive,
    v.id,
    ...v.highlights,
  ]
    .join(' ')
    .toLowerCase();
  // Alle Begriffe müssen vorkommen – "bmw kombi" findet den Touring, nicht jedes BMW.
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

export function filterVehicles(list: Vehicle[], f: VehicleFilters): Vehicle[] {
  return list.filter((v) => {
    if (!matchesQuery(v, f.q)) return false;
    if (f.brands.length && !f.brands.includes(v.brand)) return false;
    if (f.models.length && !f.models.includes(v.model)) return false;
    if (f.bodyTypes.length && !f.bodyTypes.includes(v.bodyType)) return false;
    if (f.fuels.length && !f.fuels.includes(v.fuel)) return false;
    if (f.transmissions.length && !f.transmissions.includes(v.transmission)) return false;
    if (f.status.length && !f.status.includes(v.status)) return false;
    if (f.priceMin != null && v.price < f.priceMin) return false;
    if (f.priceMax != null && v.price > f.priceMax) return false;
    if (f.yearMin != null && registrationYear(v) < f.yearMin) return false;
    if (f.mileageMax != null && v.mileage > f.mileageMax) return false;
    if (f.powerMin != null && ps(v.powerKw) < f.powerMin) return false;
    return true;
  });
}

const STATUS_RANK: Record<VehicleStatus, number> = {
  'Verfügbar': 0,
  'Reserviert': 1,
  'Verkauft': 2,
};

export function sortVehicles(list: Vehicle[], key: SortKey): Vehicle[] {
  const out = [...list];
  switch (key) {
    case 'preis-auf':
      return out.sort((a, b) => a.price - b.price);
    case 'preis-ab':
      return out.sort((a, b) => b.price - a.price);
    case 'km-auf':
      return out.sort((a, b) => a.mileage - b.mileage);
    case 'ez-ab':
      return out.sort((a, b) => b.firstRegistration.localeCompare(a.firstRegistration));
    case 'leistung-ab':
      return out.sort((a, b) => b.powerKw - a.powerKw);
    default:
      // Empfehlung: verfügbar zuerst, danach Top-Fahrzeuge, dann Preis absteigend.
      return out.sort(
        (a, b) =>
          STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
          Number(b.featured) - Number(a.featured) ||
          b.price - a.price,
      );
  }
}

export function activeFilterCount(f: VehicleFilters): number {
  let n = 0;
  if (f.q.trim()) n++;
  n += f.brands.length ? 1 : 0;
  n += f.models.length ? 1 : 0;
  n += f.bodyTypes.length ? 1 : 0;
  n += f.fuels.length ? 1 : 0;
  n += f.transmissions.length ? 1 : 0;
  n += f.status.length ? 1 : 0;
  if (f.priceMin != null || f.priceMax != null) n++;
  if (f.yearMin != null) n++;
  if (f.mileageMax != null) n++;
  if (f.powerMin != null) n++;
  return n;
}

/** Ableitung aller Auswahlwerte direkt aus dem Bestand – keine gepflegten Listen. */
export function facets(list: Vehicle[]) {
  const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
  return {
    brands: uniq(list.map((v) => v.brand)).sort((a, b) => a.localeCompare(b, 'de')),
    models: uniq(list.map((v) => v.model)).sort((a, b) => a.localeCompare(b, 'de')),
    bodyTypes: uniq(list.map((v) => v.bodyType)).sort((a, b) => a.localeCompare(b, 'de')),
    fuels: uniq(list.map((v) => v.fuel)).sort((a, b) => a.localeCompare(b, 'de')),
    transmissions: uniq(list.map((v) => v.transmission)),
    minPrice: Math.min(...list.map((v) => v.price)),
    maxPrice: Math.max(...list.map((v) => v.price)),
  };
}

/** Modelle, die zu den aktuell gewählten Marken gehören. */
export function modelsForBrands(list: Vehicle[], brands: string[]): string[] {
  const pool = brands.length ? list.filter((v) => brands.includes(v.brand)) : list;
  return Array.from(new Set(pool.map((v) => v.model))).sort((a, b) => a.localeCompare(b, 'de'));
}

export const PRICE_STEPS = [20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000];
export const MILEAGE_STEPS = [10000, 25000, 50000, 75000, 100000, 150000];
export const YEAR_STEPS = [2019, 2020, 2021, 2022, 2023, 2024];
export const POWER_STEPS = [150, 200, 250, 300, 400, 500, 600];

/** Ähnliche Fahrzeuge: gleiche Karosserie oder Marke, Preis in der Nähe. */
export function similarVehicles(all: Vehicle[], current: Vehicle, limit = 3): Vehicle[] {
  return all
    .filter((v) => v.id !== current.id && v.status !== 'Verkauft')
    .map((v) => {
      let score = 0;
      if (v.bodyType === current.bodyType) score += 3;
      if (v.brand === current.brand) score += 2;
      if (v.fuel === current.fuel) score += 1;
      score -= Math.abs(v.price - current.price) / 60000;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.v);
}

/** Nomineller Demo-Zinssatz. Keine echte Kondition, keine Bonitätsprüfung. */
export const FINANCE_RATE = 3.99;

/** Anteil des Fahrzeugpreises, der bei der 3-Wege-Finanzierung als Schlussrate stehen bleibt. */
export const BALLOON_SHARE = 0.35;

/**
 * Beispielrechnung: Annuitätendarlehen, optional mit Schlussrate (3-Wege-Finanzierung).
 * Bewusst nachvollziehbar gehalten – die Werte sind unverbindliche Demo-Werte.
 */
export function monthlyRate(
  price: number,
  downPayment: number,
  months: number,
  annualRate: number = FINANCE_RATE,
  balloon = 0,
): number {
  const principal = Math.max(price - downPayment, 0);
  if (principal <= 0 || months <= 0) return 0;
  const i = annualRate / 100 / 12;
  const cappedBalloon = Math.min(balloon, principal);
  if (i === 0) return (principal - cappedBalloon) / months;
  const discount = Math.pow(1 + i, -months);
  return ((principal - cappedBalloon * discount) * i) / (1 - discount);
}
