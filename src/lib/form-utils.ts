/** Validierung und Hilfsfunktionen für die Formulare der Demo. */

export type Errors<T> = Partial<Record<keyof T, string>>;

export const required = (value: string | undefined, label = 'Dieses Feld'): string | undefined =>
  value && value.trim().length > 0 ? undefined : `${label} wird benötigt.`;

export function email(value: string | undefined): string | undefined {
  if (!value || !value.trim()) return 'E-Mail-Adresse wird benötigt.';
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value.trim())
    ? undefined
    : 'Bitte prüfen Sie die E-Mail-Adresse.';
}

export function phone(value: string | undefined, isRequired = true): string | undefined {
  if (!value || !value.trim()) return isRequired ? 'Telefonnummer wird benötigt.' : undefined;
  const digits = value.replace(/[^\d]/g, '');
  return digits.length >= 7 ? undefined : 'Bitte prüfen Sie die Telefonnummer.';
}

export function numberInRange(
  value: string | undefined,
  { min, max, label }: { min: number; max: number; label: string },
): string | undefined {
  if (!value || !value.trim()) return `${label} wird benötigt.`;
  const n = Number(value.replace(/[^\d]/g, ''));
  if (!Number.isFinite(n) || n === 0) return `Bitte geben Sie ${label.toLowerCase()} als Zahl an.`;
  if (n < min || n > max) return `${label} liegt außerhalb des erwarteten Bereichs.`;
  return undefined;
}

/** Erzeugt eine Vorgangsnummer im Format AK-48217. */
export function referenceNumber(prefix = 'AK'): string {
  const n = 10000 + Math.floor(Math.random() * 89999);
  return `${prefix}-${n}`;
}

/** Tausenderpunkte während der Eingabe, damit Kilometerstände lesbar bleiben. */
export function formatDigitsInput(value: string): string {
  const digits = value.replace(/[^\d]/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('de-DE').format(Number(digits));
}

export function digitsOf(value: string): number {
  return Number(value.replace(/[^\d]/g, '')) || 0;
}

/** Simuliert die Übertragung an ein Backend – in der Demo bewusst nur eine Verzögerung. */
export function submitDemo<T>(payload: T, ms = 850): Promise<{ ok: true; payload: T }> {
  if (process.env.NODE_ENV === 'development') {
    // Hilft beim Prüfen der Demo, ohne dass Daten das Gerät verlassen.
    console.info('[Autokunst Demo] Formular abgesendet:', payload);
  }
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true, payload }), ms));
}
