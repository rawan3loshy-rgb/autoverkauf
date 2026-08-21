'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';
import { Consent, FormField, Input, Textarea } from '@/components/ui/form-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { email as validateEmail, phone as validatePhone, referenceNumber, required, submitDemo, type Errors } from '@/lib/form-utils';

export type Topic = 'kauf' | 'probefahrt' | 'finanzierung' | 'inzahlungnahme' | 'termin' | 'suchauftrag' | 'allgemein';

export const TOPICS: { value: Topic; label: string }[] = [
  { value: 'kauf', label: 'Kaufanfrage' },
  { value: 'probefahrt', label: 'Probefahrt vereinbaren' },
  { value: 'finanzierung', label: 'Finanzierung / Leasing' },
  { value: 'inzahlungnahme', label: 'Inzahlungnahme' },
  { value: 'termin', label: 'Termin im Showroom' },
  { value: 'suchauftrag', label: 'Suchauftrag' },
  { value: 'allgemein', label: 'Allgemeine Frage' },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY: FormState = { firstName: '', lastName: '', email: '', phone: '', message: '' };

export function InquiryForm({
  defaultTopic = 'allgemein',
  vehicleLabel,
  vehicleId,
  tone = 'dark',
  title = 'Anfrage senden',
  className,
}: {
  defaultTopic?: Topic;
  vehicleLabel?: string;
  vehicleId?: string;
  tone?: 'dark' | 'light';
  title?: string;
  className?: string;
}) {
  const [topic, setTopic] = React.useState<Topic>(defaultTopic);
  const [values, setValues] = React.useState<FormState>(EMPTY);
  const [consent, setConsent] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors<FormState & { consent: string }>>({});
  const [pending, setPending] = React.useState(false);
  const [reference, setReference] = React.useState<string | null>(null);

  React.useEffect(() => setTopic(defaultTopic), [defaultTopic]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const light = tone === 'light';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors<FormState & { consent: string }> = {
      firstName: required(values.firstName, 'Vorname'),
      lastName: required(values.lastName, 'Nachname'),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone, topic === 'probefahrt' || topic === 'termin'),
      consent: consent ? undefined : 'Bitte bestätigen Sie die Datenschutzhinweise.',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    setPending(true);
    await submitDemo({ topic, vehicleId, vehicleLabel, ...values });
    setPending(false);
    setReference(referenceNumber());
  }

  if (reference) {
    return (
      <div
        className={cn(
          'border p-7 md:p-10',
          light ? 'border-ink-900/[0.12] bg-white text-ink-900' : 'border-line bg-ink-850',
          className,
        )}
      >
        <span
          className={cn(
            'flex h-11 w-11 items-center justify-center border',
            light ? 'border-champagne-dark text-champagne-dark' : 'border-champagne text-champagne',
          )}
        >
          <Check className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h3 className={cn('headline-sm mt-6', light ? 'text-ink-900' : 'text-ivory')}>Vielen Dank.</h3>
        <p className={cn('mt-3 max-w-md text-[0.9375rem] leading-relaxed', light ? 'text-ink-900/60' : 'text-ivory-400')}>
          Wir haben Ihre Anfrage erhalten und melden uns innerhalb eines Werktages bei Ihnen
          {vehicleLabel ? <> – mit allen Informationen zum {vehicleLabel}</> : null}.
        </p>
        <p className={cn('tnum mt-6 border-t pt-5 text-sm', light ? 'border-ink-900/[0.12] text-ink-900/70' : 'border-line text-ivory-300')}>
          Ihre Vorgangsnummer: <span className={light ? 'text-ink-900' : 'text-ivory'}>#{reference}</span>
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={site.phoneHref}
            className={cn(
              'inline-flex h-12 items-center justify-center gap-2.5 px-6 text-[0.8125rem] font-medium uppercase tracking-wider transition-colors',
              light ? 'bg-ink-900 text-ivory hover:bg-ink-700' : 'bg-ivory text-ink-900 hover:bg-white',
            )}
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
            {site.phone}
          </a>
          <Link
            href="/fahrzeuge"
            className={cn(
              'inline-flex h-12 items-center justify-center gap-2 border px-6 text-[0.8125rem] font-medium uppercase tracking-wider transition-colors',
              light ? 'border-ink-900/20 text-ink-900 hover:border-ink-900/50' : 'border-line-strong text-ivory hover:border-ivory/45',
            )}
          >
            Weitere Fahrzeuge
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn('border p-6 md:p-8', light ? 'border-ink-900/[0.12] bg-white' : 'border-line bg-ink-850', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className={cn('font-display text-lg font-medium tracking-tight', light ? 'text-ink-900' : 'text-ivory')}>
          {title}
        </h3>
        {vehicleId && (
          <p className={cn('tnum text-xs', light ? 'text-ink-900/45' : 'text-ivory-500')}>Fahrzeug-Nr. {vehicleId}</p>
        )}
      </div>

      {vehicleLabel && (
        <p className={cn('mt-2 text-[0.875rem]', light ? 'text-ink-900/60' : 'text-ivory-400')}>{vehicleLabel}</p>
      )}

      <div className="mt-6 space-y-4">
        <FormField label="Ihr Anliegen" tone={tone} htmlFor="anliegen">
          <Select value={topic} onValueChange={(v) => setTopic(v as Topic)}>
            <SelectTrigger id="anliegen" tone={tone}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Vorname" htmlFor="vorname" error={errors.firstName} tone={tone}>
            <Input
              id="vorname"
              name="given-name"
              autoComplete="given-name"
              value={values.firstName}
              onChange={set('firstName')}
              invalid={!!errors.firstName}
              tone={tone}
            />
          </FormField>
          <FormField label="Nachname" htmlFor="nachname" error={errors.lastName} tone={tone}>
            <Input
              id="nachname"
              autoComplete="family-name"
              value={values.lastName}
              onChange={set('lastName')}
              invalid={!!errors.lastName}
              tone={tone}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="E-Mail" htmlFor="email" error={errors.email} tone={tone}>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={set('email')}
              invalid={!!errors.email}
              tone={tone}
            />
          </FormField>
          <FormField
            label="Telefon"
            htmlFor="telefon"
            error={errors.phone}
            optional={topic !== 'probefahrt' && topic !== 'termin'}
            tone={tone}
          >
            <Input
              id="telefon"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+49"
              value={values.phone}
              onChange={set('phone')}
              invalid={!!errors.phone}
              tone={tone}
            />
          </FormField>
        </div>

        <FormField label="Nachricht" htmlFor="nachricht" optional tone={tone}>
          <Textarea
            id="nachricht"
            value={values.message}
            onChange={set('message')}
            placeholder={
              topic === 'probefahrt'
                ? 'Wunschtermin für die Probefahrt, Fragen zum Fahrzeug …'
                : 'Ihre Nachricht an uns'
            }
            tone={tone}
          />
        </FormField>

        <Consent
          checked={consent}
          onChange={(v) => {
            setConsent(v);
            setErrors((prev) => ({ ...prev, consent: undefined }));
          }}
          error={errors.consent}
          tone={tone}
          id={`datenschutz-${vehicleId ?? 'allgemein'}`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className={cn(
          'group mt-7 inline-flex h-[3.25rem] w-full items-center justify-center gap-2.5 text-[0.8125rem] font-medium uppercase tracking-wider transition-colors duration-150 disabled:opacity-60',
          light ? 'bg-ink-900 text-ivory hover:bg-ink-700' : 'bg-ivory text-ink-900 hover:bg-white',
        )}
      >
        {pending ? 'Wird gesendet …' : 'Anfrage senden'}
        {!pending && (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
        )}
      </button>

      <p className={cn('mt-4 text-center text-xs', light ? 'text-ink-900/40' : 'text-ivory-500')}>
        Oder direkt anrufen:{' '}
        <a href={site.phoneHref} className={cn('tnum underline-offset-4 hover:underline', light ? 'text-ink-900/70' : 'text-ivory-300')}>
          {site.phone}
        </a>
      </p>
    </form>
  );
}
