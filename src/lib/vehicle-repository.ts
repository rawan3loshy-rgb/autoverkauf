import { vehicles } from '@/data/vehicles';
import type { Vehicle } from './types';
import { sortVehicles } from './vehicle-utils';

/**
 * Einziger Zugriffspunkt auf den Bestand.
 *
 * Aktuell liest die Demo aus `data/vehicles.ts`. Wird später ein DMS oder eine API
 * angebunden, werden ausschließlich diese Funktionen ersetzt – die Komponenten
 * bleiben unverändert. Die Signaturen sind deshalb bereits asynchron gedacht,
 * werden hier aber synchron aufgelöst, damit das Rendering ohne Ladezustände auskommt.
 */

export function getAllVehicles(): Vehicle[] {
  return sortVehicles(vehicles, 'empfehlung');
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function getFeaturedVehicles(limit = 6): Vehicle[] {
  const available = vehicles.filter((v) => v.status !== 'Verkauft');
  const featured = available.filter((v) => v.featured);
  const rest = available.filter((v) => !v.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getVehicleSlugs(): string[] {
  return vehicles.map((v) => v.slug);
}

export function countByStatus() {
  return {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === 'Verfügbar').length,
    reserved: vehicles.filter((v) => v.status === 'Reserviert').length,
    sold: vehicles.filter((v) => v.status === 'Verkauft').length,
  };
}
