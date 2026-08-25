const nf = (opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat('de-DE', opts);

/** 139900 → "139.900 €" */
export function formatPrice(value: number): string {
  return `${nf({ maximumFractionDigits: 0 }).format(value)} €`;
}

/** 18450 → "18.450 km" */
export function formatMileage(km: number): string {
  return `${nf().format(km)} km`;
}

/** 18450 → "18.450" */
export function formatNumber(value: number): string {
  return nf().format(value);
}

/** "2023-08" → "08/2023" */
export function formatRegistration(iso: string): string {
  const [year, month] = iso.split('-');
  return `${month}/${year}`;
}

/** 353 → "353 kW / 480 PS" */
export function formatPower(kw: number): string {
  return `${kw} kW / ${Math.round(kw * 1.35962)} PS`;
}

export function ps(kw: number): number {
  return Math.round(kw * 1.35962);
}

/** 2981 → "2.981 cm³" */
export function formatDisplacement(ccm: number): string {
  return `${nf().format(ccm)} cm³`;
}

/** 8.4 → "8,4 l/100 km" */
export function formatConsumption(value: number, unit = 'l/100 km'): string {
  return `${nf({ minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)} ${unit}`;
}

export function formatCo2(value: number): string {
  return `${nf().format(value)} g/km`;
}

/** 4.1 → "4,1 s" */
export function formatSeconds(value: number): string {
  return `${nf({ minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)} s`;
}

export function formatSpeed(kmh: number): string {
  return `${nf().format(kmh)} km/h`;
}

/** "2026-11" → "11/2026" */
export const formatMonthYear = formatRegistration;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
