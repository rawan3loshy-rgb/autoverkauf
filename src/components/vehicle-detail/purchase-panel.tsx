'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';
import type { Vehicle } from '@/lib/types';
import { formatMileage, formatPrice, formatRegistration, ps } from '@/lib/formatting';
import { StatusBadge } from '@/components/vehicles/vehicle-card';

const ASSURANCES = ['Technisch geprüft und aufbereitet', 'Historie dokumentiert', 'Probefahrt nach Vereinbarung'];

export function PurchasePanel({ vehicle }: { vehicle: Vehicle }) {
  const sold = vehicle.status === 'Verkauft';

  const scrollToForm = (topic: string) => {
    const el = document.getElementById('anfrage');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.dispatchEvent(new CustomEvent('nova:set-topic', { detail: topic }));
  };

  return (
    <div className="border border-line bg-ink-850">
      <div className="p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow-muted">Fahrzeug-Nr. {vehicle.id}</span>
          <StatusBadge vehicle={vehicle} className="px-2 py-1" />
        </div>

        <p
          className={cn(
            'tnum mt-5 font-display text-[2.25rem] font-semibold leading-none tracking-tighter md:text-[2.625rem]',
            sold ? 'text-ivory-500' : 'text-ivory',
          )}
        >
          {formatPrice(vehicle.price)}
        </p>
        <p className="mt-2 text-xs text-ivory-500">Inkl. gesetzlicher MwSt., zzgl. Überführung · MwSt. ausweisbar</p>

        <dl className="tnum mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-5 text-[0.8125rem]">
          <Mini label="Erstzulassung" value={formatRegistration(vehicle.firstRegistration)} />
          <Mini label="Kilometerstand" value={formatMileage(vehicle.mileage)} />
          <Mini label="Leistung" value={`${ps(vehicle.powerKw)} PS`} />
          <Mini label="Getriebe" value={vehicle.transmission} />
        </dl>

        <div className="mt-7 space-y-2.5">
          {sold ? (
            <>
              <p className="border border-line bg-ink-800 px-4 py-3.5 text-[0.8125rem] leading-relaxed text-ivory-400">
                Dieses Fahrzeug ist bereits verkauft. Gerne suchen wir ein vergleichbares Fahrzeug für Sie.
              </p>
              <button
                type="button"
                onClick={() => scrollToForm('suchauftrag')}
                className="group flex h-[3.25rem] w-full items-center justify-center gap-2.5 bg-ivory text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-white"
              >
                Suchauftrag aufgeben
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => scrollToForm('probefahrt')}
                className="group flex h-[3.25rem] w-full items-center justify-center gap-2.5 bg-ivory text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-white"
              >
                Probefahrt anfragen
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => scrollToForm('kauf')}
                className="flex h-[3.25rem] w-full items-center justify-center border border-line-strong text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors duration-150 hover:border-ivory/45 hover:bg-ivory/[0.05]"
              >
                Fahrzeug anfragen
              </button>
            </>
          )}

          <a
            href={site.phoneHref}
            className="tnum flex h-[3.25rem] w-full items-center justify-center gap-2.5 text-[0.8125rem] uppercase tracking-wider text-ivory-300 transition-colors duration-150 hover:text-ivory"
          >
            <Phone className="h-4 w-4 text-champagne" strokeWidth={1.75} />
            {site.phone}
          </a>
        </div>
      </div>

      <ul className="space-y-2.5 border-t border-line bg-ink-800/60 px-6 py-5 md:px-7">
        {ASSURANCES.map((a) => (
          <li key={a} className="flex items-start gap-2.5 text-[0.8125rem] text-ivory-400">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne" strokeWidth={2} />
            {a}
          </li>
        ))}
        <li className="flex items-start gap-2.5 pt-1 text-[0.8125rem] text-ivory-400">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne" strokeWidth={1.75} />
          Standort {vehicle.location} ·{' '}
          <Link href="/kontakt?anlass=termin" className="underline-offset-4 hover:text-ivory hover:underline">
            Termin vereinbaren
          </Link>
        </li>
      </ul>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ivory-500">{label}</dt>
      <dd className="mt-0.5 text-ivory">{value}</dd>
    </div>
  );
}
