import { cn } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import {
  formatConsumption,
  formatCo2,
  formatDisplacement,
  formatMileage,
  formatMonthYear,
  formatNumber,
  formatPower,
  formatRegistration,
  formatSeconds,
  formatSpeed,
} from '@/lib/formatting';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
      <dt className="text-[0.8125rem] text-ivory-400">{label}</dt>
      <dd className="tnum text-right text-[0.9375rem] text-ivory">{value}</dd>
    </div>
  );
}

export function SpecTable({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  const isElectric = vehicle.fuel === 'Elektro';

  return (
    <div className={className}>
      <h2 className="headline-sm text-ivory">Fahrzeugdaten</h2>

      <div className="mt-6 grid gap-x-12 md:grid-cols-2">
        <dl>
          <Row label="Erstzulassung" value={formatRegistration(vehicle.firstRegistration)} />
          <Row label="Kilometerstand" value={formatMileage(vehicle.mileage)} />
          <Row label="Leistung" value={formatPower(vehicle.powerKw)} />
          <Row label="Kraftstoff" value={vehicle.fuel} />
          <Row label="Getriebe" value={vehicle.transmission} />
          <Row label="Antrieb" value={vehicle.drive} />
          <Row
            label="Hubraum"
            value={vehicle.displacement > 0 ? formatDisplacement(vehicle.displacement) : '–'}
          />
          <Row label="Karosserie" value={vehicle.bodyType} />
          <Row label="Türen / Sitze" value={`${vehicle.doors} / ${vehicle.seats}`} />
        </dl>

        <dl>
          <Row label="Außenfarbe" value={`${vehicle.color} · ${vehicle.colorFinish}`} />
          <Row label="Innenausstattung" value={vehicle.interior} />
          <Row label="HU / AU" value={`neu bis ${formatMonthYear(vehicle.inspection)}`} />
          <Row label="Anzahl Vorbesitzer" value={String(vehicle.previousOwners)} />
          <Row label="Scheckheftgepflegt" value={vehicle.serviceBook ? 'Ja, lückenlos' : 'Nein'} />
          <Row label="Unfallfrei" value={vehicle.accidentFree ? 'Ja' : 'Nein'} />
          <Row label="Schadstoffklasse" value={vehicle.emissionClass} />
          <Row label="Leergewicht" value={`${formatNumber(vehicle.weight)} kg`} />
          <Row label="Fahrzeug-Nr." value={vehicle.id} />
        </dl>
      </div>

      <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
        <div>
          <h3 className="text-[0.8125rem] uppercase tracking-wider text-ivory">Fahrleistungen</h3>
          <dl className="mt-4">
            <Row label="Beschleunigung 0–100 km/h" value={formatSeconds(vehicle.acceleration)} />
            <Row label="Höchstgeschwindigkeit" value={formatSpeed(vehicle.topSpeed)} />
          </dl>
        </div>

        <div>
          <h3 className="text-[0.8125rem] uppercase tracking-wider text-ivory">
            {isElectric ? 'Verbrauch' : 'Verbrauch & Emissionen'}
          </h3>
          <dl className="mt-4">
            <Row
              label={isElectric ? 'Stromverbrauch kombiniert' : 'Kraftstoffverbrauch kombiniert'}
              value={formatConsumption(vehicle.consumption, vehicle.consumptionUnit)}
            />
            <Row label="CO₂-Emissionen kombiniert" value={formatCo2(vehicle.co2)} />
          </dl>
          <p className={cn('mt-4 text-xs leading-relaxed text-ivory-500')}>
            Demonstrationswerte dieses Demo-Projekts. Es handelt sich nicht um offiziell ermittelte oder
            zertifizierte Verbrauchs- und Emissionsangaben.
          </p>
        </div>
      </div>
    </div>
  );
}
