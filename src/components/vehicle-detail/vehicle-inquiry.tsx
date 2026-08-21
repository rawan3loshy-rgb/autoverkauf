'use client';

import * as React from 'react';
import { InquiryForm, type Topic } from '@/components/contact/inquiry-form';

/**
 * Verbindet die Aktionsschaltflächen im Kaufpanel mit dem Formular weiter unten:
 * Wer „Probefahrt anfragen“ wählt, findet das Anliegen bereits vorausgewählt vor.
 */
export function VehicleInquiry({ vehicleLabel, vehicleId }: { vehicleLabel: string; vehicleId: string }) {
  const [topic, setTopic] = React.useState<Topic>('kauf');

  React.useEffect(() => {
    const onSetTopic = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setTopic(detail as Topic);
    };
    window.addEventListener('nova:set-topic', onSetTopic);
    return () => window.removeEventListener('nova:set-topic', onSetTopic);
  }, []);

  return (
    <InquiryForm
      defaultTopic={topic}
      vehicleLabel={vehicleLabel}
      vehicleId={vehicleId}
      title="Anfrage zu diesem Fahrzeug"
    />
  );
}
