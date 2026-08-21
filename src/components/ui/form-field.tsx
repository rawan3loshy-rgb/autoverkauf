'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  optional,
  className,
  children,
  tone = 'dark',
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className={cn(
          'mb-2 flex items-baseline justify-between gap-2 font-sans text-2xs uppercase tracking-wider',
          tone === 'dark' ? 'text-ivory-500' : 'text-ink-900/50',
        )}
      >
        <span>{label}</span>
        {optional && <span className="normal-case tracking-normal opacity-70">optional</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#E2A0A0]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : hint ? (
        <p className={cn('mt-2 text-xs', tone === 'dark' ? 'text-ivory-500' : 'text-ink-900/45')}>{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; tone?: 'dark' | 'light' }>(
  ({ className, invalid, tone = 'dark', ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        tone === 'dark' ? 'field' : 'field-light',
        invalid && (tone === 'dark' ? 'border-[#8C5252]' : 'border-[#B87070]'),
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean; tone?: 'dark' | 'light' }
>(({ className, invalid, tone = 'dark', ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      tone === 'dark' ? 'field' : 'field-light',
      'h-auto min-h-[7.5rem] resize-y py-3.5 leading-relaxed',
      invalid && (tone === 'dark' ? 'border-[#8C5252]' : 'border-[#B87070]'),
      className,
    )}
    aria-invalid={invalid || undefined}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

/** Segmentierte Auswahl – ersetzt Radiobuttons dort, wo es nur zwei bis vier Optionen gibt. */
export function OptionGroup<T extends string>({
  options,
  value,
  onChange,
  name,
  tone = 'dark',
  columns,
}: {
  options: readonly { value: T; label: string; hint?: string }[];
  value: T | null;
  onChange: (value: T) => void;
  name: string;
  tone?: 'dark' | 'light';
  columns?: number;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn('grid gap-2', columns ? '' : 'grid-cols-2')}
      style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'border px-4 py-3 text-left transition-colors duration-150',
              tone === 'dark'
                ? active
                  ? 'border-champagne bg-champagne/10 text-ivory'
                  : 'border-line text-ivory-300 hover:border-line-strong hover:text-ivory'
                : active
                  ? 'border-ink-900 bg-ink-900 text-ivory'
                  : 'border-ink-900/15 text-ink-900 hover:border-ink-900/40',
            )}
          >
            <span className="block text-[0.875rem] font-medium">{o.label}</span>
            {o.hint && <span className="mt-0.5 block text-xs opacity-60">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Consent({
  checked,
  onChange,
  error,
  tone = 'dark',
  id = 'datenschutz',
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  error?: string;
  tone?: 'dark' | 'light';
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-150',
            checked
              ? 'border-champagne bg-champagne'
              : tone === 'dark'
                ? 'border-line-strong group-hover:border-ivory/40'
                : 'border-ink-900/25 group-hover:border-ink-900/50',
          )}
        >
          {checked && (
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-ink-900" fill="none">
              <path d="M2 6.2 4.6 8.8 10 3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          )}
        </span>
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={cn('text-xs leading-relaxed', tone === 'dark' ? 'text-ivory-400' : 'text-ink-900/55')}>
          Ich habe die Datenschutzhinweise gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung
          meiner Anfrage verwendet werden. In dieser Demo werden keine Daten übertragen oder gespeichert.
        </span>
      </label>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 pl-7 text-xs text-[#E2A0A0]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}
    </div>
  );
}
