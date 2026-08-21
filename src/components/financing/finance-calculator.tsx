'use client';

import * as React from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { Range } from '@/components/ui/range';
import { cn } from '@/lib/utils';
import { formatNumber, formatPrice, formatRate } from '@/lib/formatting';
import { BALLOON_SHARE, FINANCE_RATE, monthlyRate } from '@/lib/vehicle-utils';

type Mode = 'klassisch' | 'drei-wege';

const TERMS = [24, 36, 48, 60, 72];

export function FinanceCalculator({
  price,
  vehicleLabel,
  tone = 'light',
  requestHref = '/finanzierung#anfrage',
  className,
}: {
  price: number;
  vehicleLabel?: string;
  tone?: 'light' | 'dark';
  requestHref?: string;
  className?: string;
}) {
  const light = tone === 'light';
  const [down, setDown] = React.useState(() => Math.round((price * 0.2) / 500) * 500);
  const [months, setMonths] = React.useState(48);
  const [mode, setMode] = React.useState<Mode>('klassisch');

  const maxDown = Math.round(price * 0.6);
  const balloon = mode === 'drei-wege' ? Math.round(price * BALLOON_SHARE) : 0;
  const rate = monthlyRate(price, down, months, FINANCE_RATE, balloon);
  const financed = Math.max(price - down, 0);

  return (
    <div
      className={cn(
        'border',
        light ? 'border-ink-900/[0.12] bg-white' : 'border-line bg-ink-850',
        className,
      )}
    >
      <div className="grid lg:grid-cols-5">
        {/* Eingaben */}
        <div className="border-b p-6 md:p-8 lg:col-span-3 lg:border-b-0 lg:border-r"
          style={{ borderColor: light ? 'rgba(10,10,11,0.12)' : 'rgba(242,239,233,0.10)' }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className={cn('eyebrow', light ? 'text-champagne-dark' : 'text-champagne')}>Beispielrechnung</p>
            {vehicleLabel && (
              <p className={cn('text-[0.8125rem]', light ? 'text-ink-900/55' : 'text-ivory-400')}>{vehicleLabel}</p>
            )}
          </div>

          <div className="mt-6 flex items-baseline justify-between">
            <span className={cn('text-sm', light ? 'text-ink-900/65' : 'text-ivory-400')}>Fahrzeugpreis</span>
            <span
              className={cn(
                'tnum font-display text-xl font-semibold tracking-tight',
                light ? 'text-ink-900' : 'text-ivory',
              )}
            >
              {formatPrice(price)}
            </span>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label className={cn('text-sm', light ? 'text-ink-900/65' : 'text-ivory-400')} htmlFor="anzahlung">
                Anzahlung
              </label>
              <span className={cn('tnum text-sm font-medium', light ? 'text-ink-900' : 'text-ivory')}>
                {formatPrice(down)}
              </span>
            </div>
            <Range
              id="anzahlung"
              tone={tone}
              className="mt-3"
              value={[down]}
              min={0}
              max={maxDown}
              step={500}
              onValueChange={([v]) => setDown(v)}
            />
            <div className={cn('tnum mt-2 flex justify-between text-xs', light ? 'text-ink-900/40' : 'text-ivory-500')}>
              <span>0 €</span>
              <span>{formatNumber(maxDown)} €</span>
            </div>
          </div>

          <div className="mt-8">
            <span className={cn('text-sm', light ? 'text-ink-900/65' : 'text-ivory-400')}>Laufzeit</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {TERMS.map((t) => {
                const active = t === months;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMonths(t)}
                    className={cn(
                      'tnum h-10 border px-4 text-[0.8125rem] transition-colors duration-150',
                      light
                        ? active
                          ? 'border-ink-900 bg-ink-900 text-ivory'
                          : 'border-ink-900/15 text-ink-900/70 hover:border-ink-900/40'
                        : active
                          ? 'border-ivory bg-ivory text-ink-900'
                          : 'border-line text-ivory-400 hover:border-line-strong hover:text-ivory',
                    )}
                  >
                    {t} Monate
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <span className={cn('text-sm', light ? 'text-ink-900/65' : 'text-ivory-400')}>Finanzierungsart</span>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                [
                  { key: 'klassisch', label: 'Klassisch', hint: 'Vollständige Tilgung' },
                  { key: 'drei-wege', label: '3-Wege', hint: 'Mit Schlussrate' },
                ] as const
              ).map((m) => {
                const active = mode === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMode(m.key)}
                    className={cn(
                      'border px-4 py-3 text-left transition-colors duration-150',
                      light
                        ? active
                          ? 'border-ink-900 bg-ink-900 text-ivory'
                          : 'border-ink-900/15 text-ink-900 hover:border-ink-900/40'
                        : active
                          ? 'border-ivory bg-ivory text-ink-900'
                          : 'border-line text-ivory hover:border-line-strong',
                    )}
                  >
                    <span className="block text-[0.875rem] font-medium">{m.label}</span>
                    <span className={cn('mt-0.5 block text-xs', active ? 'opacity-65' : 'opacity-50')}>{m.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ergebnis */}
        <div
          className={cn(
            'flex flex-col justify-between p-6 md:p-8 lg:col-span-2',
            light ? 'bg-ivory-100' : 'bg-ink-800',
          )}
        >
          <div>
            <p className={cn('eyebrow-muted', light && 'text-ink-900/45')}>Monatliche Rate</p>
            <p
              className={cn(
                'tnum mt-3 font-display text-[2.5rem] font-semibold leading-none tracking-tighter md:text-[3rem]',
                light ? 'text-ink-900' : 'text-ivory',
              )}
            >
              {formatRate(rate)}
            </p>
            <p className={cn('mt-2 text-sm', light ? 'text-ink-900/55' : 'text-ivory-400')}>
              ab, bei {months} Monaten Laufzeit
            </p>

            <dl className={cn('tnum mt-7 space-y-2.5 border-t pt-6 text-[0.8125rem]',
              light ? 'border-ink-900/[0.12]' : 'border-line')}
            >
              <Row light={light} label="Finanzierungsbetrag" value={formatPrice(financed)} />
              <Row light={light} label="Sollzins p. a. (gebunden)" value={`${FINANCE_RATE.toFixed(2).replace('.', ',')} %`} />
              {balloon > 0 && <Row light={light} label="Schlussrate" value={formatPrice(balloon)} />}
              <Row light={light} label="Anzahl Raten" value={String(months)} />
            </dl>
          </div>

          <div className="mt-8">
            <Link
              href={requestHref}
              className={cn(
                'flex h-12 w-full items-center justify-center text-[0.8125rem] font-medium uppercase tracking-wider transition-colors duration-150',
                light ? 'bg-ink-900 text-ivory hover:bg-ink-700' : 'bg-ivory text-ink-900 hover:bg-white',
              )}
            >
              Finanzierung anfragen
            </Link>
            <p
              className={cn(
                'mt-4 flex gap-2 text-xs leading-relaxed',
                light ? 'text-ink-900/45' : 'text-ivory-500',
              )}
            >
              <Info className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
              <span>
                Unverbindliche Beispielrechnung dieser Demo. Kein Angebot, keine Bonitätsprüfung, keine Vermittlung.
                Die tatsächlichen Konditionen ergeben sich aus dem individuellen Finanzierungsangebot.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, light }: { label: string; value: string; light: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={light ? 'text-ink-900/55' : 'text-ivory-400'}>{label}</dt>
      <dd className={light ? 'text-ink-900' : 'text-ivory'}>{value}</dd>
    </div>
  );
}
