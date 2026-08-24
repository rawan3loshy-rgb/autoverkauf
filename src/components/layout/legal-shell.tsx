import { Info } from 'lucide-react';
import { PageHeader } from './page-header';

export function LegalShell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} lead={lead} />
      <section className="bg-ink-900 py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <div className="mb-12 flex gap-3 border border-champagne/25 bg-champagne/[0.06] p-5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-champagne" strokeWidth={1.5} />
              <p className="text-[0.875rem] leading-relaxed text-ivory-300">
                Diese Website ist eine Präsentationsfassung für Autokunst. Sämtliche Fahrzeuge, Preise und
                Verfügbarkeiten sind Demo-Daten, die rechtlichen Pflichtangaben sind noch nicht hinterlegt. Es kommt
                kein Vertrag zustande und es werden keine Daten verarbeitet.
              </p>
            </div>
            <div className="space-y-10">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-[1.25rem] font-semibold tracking-tight text-ivory">{title}</h2>
      <div className="mt-4 space-y-3.5 text-[0.9375rem] leading-relaxed text-ivory-300">{children}</div>
    </section>
  );
}
