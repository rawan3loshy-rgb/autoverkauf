import type { BodyType, Fuel, Transmission, VehicleStatus } from './types';
import { emptyFilters, type SortKey, type VehicleFilters } from './vehicle-utils';

/**
 * Filter <-> URL. Die Suche ist damit teilbar, bookmarkbar und überlebt einen Reload.
 * Bewusst kurze, deutsche Parameternamen – die URL ist Teil des Produkts.
 */

type Source = URLSearchParams | Record<string, string | string[] | undefined>;

function read(params: Source, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

function list(params: Source, key: string): string[] {
  const raw = read(params, key);
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function num(params: Source, key: string): number | null {
  const raw = read(params, key);
  if (raw == null || raw === '') return null;
  const n = Number(raw.replace(/[^\d]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function parseFilters(params: Source): VehicleFilters {
  return {
    ...emptyFilters,
    q: read(params, 'q') ?? '',
    brands: list(params, 'marke'),
    models: list(params, 'modell'),
    bodyTypes: list(params, 'karosserie') as BodyType[],
    fuels: list(params, 'kraftstoff') as Fuel[],
    transmissions: list(params, 'getriebe') as Transmission[],
    status: list(params, 'status') as VehicleStatus[],
    priceMin: num(params, 'preisVon'),
    priceMax: num(params, 'preisBis'),
    yearMin: num(params, 'ez'),
    mileageMax: num(params, 'km'),
    powerMin: num(params, 'ps'),
  };
}

const SORT_KEYS: SortKey[] = ['empfehlung', 'preis-auf', 'preis-ab', 'km-auf', 'ez-ab', 'leistung-ab'];

export function parseSort(params: Source): SortKey {
  const value = read(params, 'sort');
  return SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : 'empfehlung';
}

export function serializeFilters(f: VehicleFilters, sort: SortKey = 'empfehlung'): string {
  const p = new URLSearchParams();
  const put = (key: string, values: string[]) => {
    if (values.length) p.set(key, values.join(','));
  };
  const putNum = (key: string, value: number | null) => {
    if (value != null) p.set(key, String(value));
  };

  if (f.q.trim()) p.set('q', f.q.trim());
  put('marke', f.brands);
  put('modell', f.models);
  put('karosserie', f.bodyTypes);
  put('kraftstoff', f.fuels);
  put('getriebe', f.transmissions);
  put('status', f.status);
  putNum('preisVon', f.priceMin);
  putNum('preisBis', f.priceMax);
  putNum('ez', f.yearMin);
  putNum('km', f.mileageMax);
  putNum('ps', f.powerMin);
  if (sort !== 'empfehlung') p.set('sort', sort);

  const s = p.toString();
  return s ? `?${s}` : '';
}
