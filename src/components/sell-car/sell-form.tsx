'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ImagePlus, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';
import { Consent, FormField, Input, OptionGroup, Textarea } from '@/components/ui/form-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  digitsOf,
  email as validateEmail,
  formatDigitsInput,
  numberInRange,
  phone as validatePhone,
  referenceNumber,
  required,
  submitDemo,
} from '@/lib/form-utils';
import { formatNumber } from '@/lib/formatting';

const BRANDS = [
  'Audi',
  'BMW',
  'Mercedes-Benz',
  'Porsche',
  'Volkswagen',
  'Land Rover',
  'Volvo',
  'Škoda',
  'Ford',
  'Opel',
  'Toyota',
  'Andere Marke',
];

const FUELS = ['Benzin', 'Diesel', 'Elektro', 'Hybrid (Benzin/Elektro)', 'Hybrid (Diesel/Elektro)', 'Erdgas / LPG'];
const TRANSMISSIONS = ['Automatik', 'Schaltgetriebe'] as const;
const CONDITIONS = [
  { value: 'Sehr gut', label: 'Sehr gut', hint: 'Keine sichtbaren Mängel' },
  { value: 'Gut', label: 'Gut', hint: 'Übliche Gebrauchsspuren' },
  { value: 'Gebraucht', label: 'Gebraucht', hint: 'Deutliche Gebrauchsspuren' },
  { value: 'Beschädigt', label: 'Beschädigt', hint: 'Reparatur erforderlich' },
] as const;

const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: 27 }, (_, i) => String(CURRENT_YEAR - i));

interface SellData {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  power: string;
  color: string;
  accidentFree: string;
  serviceBook: string;
  owners: string;
  condition: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}

const EMPTY: SellData = {
  brand: '',
  model: '',
  year: '',
  mileage: '',
  fuel: '',
  transmission: '',
  power: '',
  color: '',
  accidentFree: '',
  serviceBook: '',
  owners: '',
  condition: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
};

const STEPS = [
  { n: 1, label: 'Fahrzeug' },
  { n: 2, label: 'Fahrzeugdaten' },
  { n: 3, label: 'Zustand' },
  { n: 4, label: 'Kontaktdaten' },
];

type Photo = { id: string; name: string; url: string; size: number };

export function SellForm({ occasion = 'ankauf' }: { occasion?: 'ankauf' | 'inzahlungnahme' }) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState<SellData>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof SellData | 'consent', string>>>({});
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [consent, setConsent] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [reference, setReference] = React.useState<string | null>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  const set = <K extends keyof SellData>(key: K, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  React.useEffect(
    () => () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    },
    [photos],
  );

  function validate(target: number): boolean {
    const e: Partial<Record<keyof SellData | 'consent', string>> = {};
    if (target > 1) {
      e.brand = required(data.brand, 'Marke');
      e.model = required(data.model, 'Modell');
      e.year = required(data.year, 'Baujahr');
      e.mileage = numberInRange(data.mileage, { min: 1, max: 999999, label: 'Kilometerstand' });
    }
    if (target > 2) {
      e.fuel = required(data.fuel, 'Kraftstoff');
      e.transmission = required(data.transmission, 'Getriebe');
      e.power = numberInRange(data.power, { min: 30, max: 1500, label: 'Leistung' });
      e.color = required(data.color, 'Farbe');
    }
    if (target > 3) {
      e.accidentFree = required(data.accidentFree, 'Angabe zur Unfallfreiheit');
      e.serviceBook = required(data.serviceBook, 'Angabe zum Serviceheft');
      e.owners = required(data.owners, 'Anzahl Vorbesitzer');
      e.condition = required(data.condition, 'Fahrzeugzustand');
    }
    if (target > 4) {
      e.firstName = required(data.firstName, 'Vorname');
      e.lastName = required(data.lastName, 'Nachname');
      e.phone = validatePhone(data.phone, true);
      e.email = validateEmail(data.email);
      e.consent = consent ? undefined : 'Bitte bestätigen Sie die Datenschutzhinweise.';
    }
    const cleaned = Object.fromEntries(Object.entries(e).filter(([, v]) => v));
    setErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  }

  const goTo = (target: number) => {
    if (target > step && !validate(step + 1)) return;
    setStep(target);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(5)) return;
    setPending(true);
    await submitDemo({ occasion, ...data, photos: photos.length });
    setPending(false);
    setReference(referenceNumber());
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const next: Photo[] = [];
    for (const file of Array.from(files).slice(0, 8 - photos.length)) {
      if (!file.type.startsWith('image/')) continue;
      next.push({
        id: `${file.name}-${file.size}-${next.length}`,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      });
    }
    setPhotos((p) => [...p, ...next]);
  }

  if (reference) {
    return (
      <div ref={topRef} className="scroll-mt-32 border border-line bg-ink-850 p-8 md:p-12">
        <span className="flex h-12 w-12 items-center justify-center border border-champagne text-champagne">
          <Check className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h2 className="headline-md mt-7 text-ivory">Vielen Dank.</h2>
        <p className="mt-4 max-w-lg text-pretty text-[1.0625rem] leading-relaxed text-ivory-300">
          Wir haben Ihre Fahrzeugdaten erhalten und melden uns schnellstmöglich bei Ihnen – in der Regel innerhalb von
          24 Stunden an Werktagen.
        </p>

        <div className="mt-8 border-t border-line pt-7">
          <p className="eyebrow-muted">
            {occasion === 'inzahlungnahme' ? 'Anfrage Inzahlungnahme' : 'Ankaufsanfrage'}
          </p>
          <p className="tnum mt-2 font-display text-2xl font-semibold tracking-tight text-ivory">#{reference}</p>
          <p className="mt-3 text-sm text-ivory-400">
            Bitte halten Sie diese Nummer bereit, wenn Sie uns zwischenzeitlich anrufen.
          </p>
        </div>

        <dl className="mt-8 grid gap-x-10 gap-y-3 border-t border-line pt-7 text-[0.875rem] sm:grid-cols-2">
          <SummaryRow label="Fahrzeug" value={`${data.brand} ${data.model}`} />
          <SummaryRow label="Baujahr" value={data.year} />
          <SummaryRow label="Kilometerstand" value={`${data.mileage} km`} />
          <SummaryRow label="Zustand" value={data.condition} />
          <SummaryRow label="Kontakt" value={`${data.firstName} ${data.lastName}`} />
          <SummaryRow label="Rückruf an" value={data.phone} />
          {photos.length > 0 && <SummaryRow label="Fotos" value={`${photos.length} übermittelt`} />}
        </dl>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href={site.phoneHref}
            className="tnum inline-flex h-12 items-center justify-center gap-2.5 bg-ivory px-6 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors hover:bg-white"
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
            {site.phone}
          </a>
          <Link
            href="/fahrzeuge"
            className="inline-flex h-12 items-center justify-center border border-line-strong px-6 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors hover:border-ivory/45"
          >
            Fahrzeugbestand ansehen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-32">
      {/* Fortschritt */}
      <ol className="grid grid-cols-4 gap-2 md:gap-3">
        {STEPS.map((s) => {
          const state = s.n < step ? 'done' : s.n === step ? 'current' : 'todo';
          return (
            <li key={s.n}>
              <button
                type="button"
                onClick={() => s.n < step && goTo(s.n)}
                disabled={s.n > step}
                className="group w-full text-left disabled:cursor-default"
              >
                <span
                  className={cn(
                    'block h-[2px] transition-colors duration-300 ease-premium',
                    state === 'todo' ? 'bg-line' : 'bg-champagne',
                  )}
                />
                <span className="mt-3 flex items-baseline gap-2">
                  <span
                    className={cn(
                      'tnum text-xs',
                      state === 'todo' ? 'text-ivory-500' : 'text-champagne',
                    )}
                  >
                    {String(s.n).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'truncate text-[0.8125rem] transition-colors',
                      state === 'current' ? 'text-ivory' : state === 'done' ? 'text-ivory-300' : 'text-ivory-500',
                    )}
                  >
                    {s.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <form onSubmit={onSubmit} noValidate className="mt-10 border border-line bg-ink-850 p-6 md:p-9">
        {step === 1 && (
          <StepShell title="Welches Fahrzeug möchten Sie verkaufen?" hint="Vier Angaben genügen für den Einstieg.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Marke" htmlFor="marke" error={errors.brand}>
                <Select value={data.brand} onValueChange={(v) => set('brand', v)}>
                  <SelectTrigger id="marke" aria-invalid={!!errors.brand}>
                    <SelectValue placeholder="Marke wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Modell" htmlFor="modell" error={errors.model}>
                <Input
                  id="modell"
                  value={data.model}
                  onChange={(e) => set('model', e.target.value)}
                  placeholder="z. B. 3er Touring, A6 Avant"
                  invalid={!!errors.model}
                />
              </FormField>

              <FormField label="Baujahr" htmlFor="baujahr" error={errors.year}>
                <Select value={data.year} onValueChange={(v) => set('year', v)}>
                  <SelectTrigger id="baujahr" aria-invalid={!!errors.year}>
                    <SelectValue placeholder="Jahr wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Kilometerstand" htmlFor="km" error={errors.mileage} hint="Aktueller Tachostand">
                <div className="relative">
                  <Input
                    id="km"
                    inputMode="numeric"
                    value={data.mileage}
                    onChange={(e) => set('mileage', formatDigitsInput(e.target.value))}
                    placeholder="z. B. 84.500"
                    invalid={!!errors.mileage}
                    className="pr-12"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ivory-500">
                    km
                  </span>
                </div>
              </FormField>
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="Technische Daten" hint="Die Angaben finden Sie in Ihrem Fahrzeugschein.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Kraftstoff" htmlFor="kraftstoff" error={errors.fuel}>
                <Select value={data.fuel} onValueChange={(v) => set('fuel', v)}>
                  <SelectTrigger id="kraftstoff" aria-invalid={!!errors.fuel}>
                    <SelectValue placeholder="Kraftstoff wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUELS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Getriebe" error={errors.transmission}>
                <OptionGroup
                  name="Getriebe"
                  options={TRANSMISSIONS.map((t) => ({ value: t, label: t }))}
                  value={(data.transmission as (typeof TRANSMISSIONS)[number]) || null}
                  onChange={(v) => set('transmission', v)}
                />
              </FormField>

              <FormField label="Leistung" htmlFor="ps" error={errors.power} hint="In PS, siehe Feld P.2 im Fahrzeugschein">
                <div className="relative">
                  <Input
                    id="ps"
                    inputMode="numeric"
                    value={data.power}
                    onChange={(e) => set('power', e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="z. B. 190"
                    invalid={!!errors.power}
                    className="pr-12"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ivory-500">
                    PS
                  </span>
                </div>
              </FormField>

              <FormField label="Farbe" htmlFor="farbe" error={errors.color}>
                <Input
                  id="farbe"
                  value={data.color}
                  onChange={(e) => set('color', e.target.value)}
                  placeholder="z. B. Schwarz Metallic"
                  invalid={!!errors.color}
                />
              </FormField>
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title="Zustand des Fahrzeugs" hint="Ehrliche Angaben beschleunigen die Bewertung erheblich.">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField label="Unfallfrei?" error={errors.accidentFree}>
                <OptionGroup
                  name="Unfallfrei"
                  options={[
                    { value: 'Ja', label: 'Ja' },
                    { value: 'Nein', label: 'Nein' },
                  ]}
                  value={data.accidentFree || null}
                  onChange={(v) => set('accidentFree', v)}
                />
              </FormField>

              <FormField label="Serviceheft vorhanden?" error={errors.serviceBook}>
                <OptionGroup
                  name="Serviceheft"
                  options={[
                    { value: 'Ja', label: 'Ja' },
                    { value: 'Nein', label: 'Nein' },
                  ]}
                  value={data.serviceBook || null}
                  onChange={(v) => set('serviceBook', v)}
                />
              </FormField>

              <FormField label="Anzahl Vorbesitzer" htmlFor="vorbesitzer" error={errors.owners} className="sm:col-span-2">
                <div className="sm:max-w-[16rem]">
                  <Select value={data.owners} onValueChange={(v) => set('owners', v)}>
                    <SelectTrigger id="vorbesitzer" aria-invalid={!!errors.owners}>
                      <SelectValue placeholder="Bitte wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {['1', '2', '3', '4', '5 oder mehr'].map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormField>

              <FormField label="Fahrzeugzustand" error={errors.condition} className="sm:col-span-2">
                <OptionGroup
                  name="Fahrzeugzustand"
                  options={CONDITIONS}
                  value={(data.condition as (typeof CONDITIONS)[number]['value']) || null}
                  onChange={(v) => set('condition', v)}
                  columns={2}
                />
              </FormField>
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell title="Ihre Kontaktdaten" hint="Wir melden uns telefonisch oder per E-Mail mit unserer Einschätzung.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Vorname" htmlFor="vorname-ankauf" error={errors.firstName}>
                <Input
                  id="vorname-ankauf"
                  autoComplete="given-name"
                  value={data.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  invalid={!!errors.firstName}
                />
              </FormField>
              <FormField label="Nachname" htmlFor="nachname-ankauf" error={errors.lastName}>
                <Input
                  id="nachname-ankauf"
                  autoComplete="family-name"
                  value={data.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  invalid={!!errors.lastName}
                />
              </FormField>
              <FormField label="Telefon" htmlFor="telefon-ankauf" error={errors.phone}>
                <Input
                  id="telefon-ankauf"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+49"
                  value={data.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  invalid={!!errors.phone}
                />
              </FormField>
              <FormField label="E-Mail" htmlFor="email-ankauf" error={errors.email}>
                <Input
                  id="email-ankauf"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => set('email', e.target.value)}
                  invalid={!!errors.email}
                />
              </FormField>
            </div>

            <FormField label="Nachricht" htmlFor="nachricht-ankauf" optional className="mt-4">
              <Textarea
                id="nachricht-ankauf"
                value={data.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="Besonderheiten, Sonderausstattung, gewünschter Übergabezeitpunkt …"
              />
            </FormField>

            {/* Fotos */}
            <div className="mt-6">
              <span className="label">Fotos hochladen · optional</span>
              <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-line-strong bg-ink-800/50 px-6 py-8 text-center transition-colors duration-150 hover:border-champagne/50 hover:bg-ink-800">
                <ImagePlus className="h-5 w-5 text-champagne" strokeWidth={1.5} />
                <span className="mt-3 text-[0.875rem] text-ivory">Bilder auswählen</span>
                <span className="mt-1 text-xs text-ivory-500">
                  Außen, Innenraum und Tacho – maximal 8 Bilder. In dieser Demo bleiben die Dateien auf Ihrem Gerät.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    addPhotos(e.target.files);
                    e.target.value = '';
                  }}
                />
              </label>

              {photos.length > 0 && (
                <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {photos.map((p) => (
                    <li key={p.id} className="group relative aspect-[3/2] overflow-hidden bg-ink-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(p.url);
                          setPhotos((list) => list.filter((x) => x.id !== p.id));
                        }}
                        className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center bg-ink-900/80 text-ivory opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                        aria-label={`${p.name} entfernen`}
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-6">
              <Consent
                checked={consent}
                onChange={(v) => {
                  setConsent(v);
                  setErrors((e) => ({ ...e, consent: undefined }));
                }}
                error={errors.consent}
                id="datenschutz-ankauf"
              />
            </div>
          </StepShell>
        )}

        {/* Navigation */}
        <div className="mt-9 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="inline-flex h-12 items-center gap-2 px-1 text-[0.8125rem] uppercase tracking-wider text-ivory-400 transition-colors hover:text-ivory"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Zurück
            </button>
          ) : (
            <span className="tnum text-xs text-ivory-500">Schritt 1 von 4</span>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => goTo(step + 1)}
              className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-ivory px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-white"
            >
              Weiter
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-champagne px-7 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-champagne-light disabled:opacity-60"
            >
              {pending
                ? 'Wird übermittelt …'
                : occasion === 'inzahlungnahme'
                  ? 'Inzahlungnahme anfragen'
                  : 'Ankauf anfragen'}
              {!pending && (
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
              )}
            </button>
          )}
        </div>
      </form>

      {/* Laufende Zusammenfassung */}
      {step > 1 && (
        <div className="mt-6 border border-line bg-ink-900 px-6 py-5">
          <p className="eyebrow-muted">Ihre Angaben</p>
          <dl className="mt-4 grid gap-x-10 gap-y-2.5 text-[0.875rem] sm:grid-cols-2">
            {data.brand && <SummaryRow label="Fahrzeug" value={`${data.brand} ${data.model}`.trim()} />}
            {data.year && <SummaryRow label="Baujahr" value={data.year} />}
            {data.mileage && <SummaryRow label="Kilometerstand" value={`${data.mileage} km`} />}
            {data.fuel && <SummaryRow label="Kraftstoff" value={data.fuel} />}
            {data.transmission && <SummaryRow label="Getriebe" value={data.transmission} />}
            {data.power && <SummaryRow label="Leistung" value={`${formatNumber(digitsOf(data.power))} PS`} />}
            {data.color && <SummaryRow label="Farbe" value={data.color} />}
            {data.condition && <SummaryRow label="Zustand" value={data.condition} />}
            {data.accidentFree && <SummaryRow label="Unfallfrei" value={data.accidentFree} />}
            {data.serviceBook && <SummaryRow label="Serviceheft" value={data.serviceBook} />}
            {data.owners && <SummaryRow label="Vorbesitzer" value={data.owners} />}
          </dl>
        </div>
      )}
    </div>
  );
}

function StepShell({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="headline-sm text-ivory">{title}</h2>
      <p className="mt-2 text-[0.875rem] text-ivory-400">{hint}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
      <dt className="text-ivory-500">{label}</dt>
      <dd className="tnum text-right text-ivory">{value}</dd>
    </div>
  );
}
