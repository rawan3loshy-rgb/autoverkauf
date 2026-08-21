'use client';

import { InquiryForm, type Topic } from './inquiry-form';
import { getVehicleBySlug } from '@/lib/vehicle-repository';
import { fullName } from '@/lib/vehicle-utils';

const MAP: Record<string, Topic> = {
  kauf: 'kauf',
  probefahrt: 'probefahrt',
  finanzierung: 'finanzierung',
  inzahlungnahme: 'inzahlungnahme',
  termin: 'termin',
  suchauftrag: 'suchauftrag',
};

const TITLES: Partial<Record<Topic, string>> = {
  termin: 'Termin im Showroom vereinbaren',
  finanzierung: 'Finanzierung anfragen',
  suchauftrag: 'Suchauftrag aufgeben',
  probefahrt: 'Probefahrt vereinbaren',
};

export function ContactPanel({ anlass, vehicleSlug }: { anlass?: string; vehicleSlug?: string }) {
  const topic = (anlass && MAP[anlass]) || 'allgemein';
  const vehicle = vehicleSlug ? getVehicleBySlug(vehicleSlug) : undefined;

  return (
    <InquiryForm
      defaultTopic={topic}
      title={TITLES[topic] ?? 'Nachricht senden'}
      vehicleLabel={vehicle ? fullName(vehicle) : undefined}
      vehicleId={vehicle?.id}
    />
  );
}
