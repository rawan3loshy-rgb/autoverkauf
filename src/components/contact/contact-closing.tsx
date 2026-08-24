import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { site } from '@/lib/site';

export function ContactClosing() {
  return (
    <section id="kontakt" className="relative overflow-hidden border-t border-line bg-ink-900">
      {/* Ein sehr flacher Lichtverlauf, damit der Abschluss nicht als Loch wirkt. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(194,164,115,0.07)_0%,transparent_65%)]" />

      <div className="container relative py-24 md:py-32 lg:py-40">
        <Reveal className="max-w-3xl">
          <p className="eyebrow lead-rule">Kontakt</p>
          <h2 className="headline-lg mt-5 text-ivory">Sprechen wir über Ihr nächstes Fahrzeug.</h2>
          <p className="mt-6 max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-ivory-300">
            Ob Kaufinteresse, Probefahrt, Finanzierung oder Ankauf – am schnellsten geht es telefonisch. Alternativ
            melden wir uns nach Ihrer Anfrage innerhalb eines Werktages zurück.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-3">
          <ContactTile
            icon={Phone}
            label="Telefon"
            value={site.phone}
            href={site.phoneHref}
            hint="Termine nach Absprache"
          />
          <ContactTile
            icon={Mail}
            label="E-Mail"
            value={site.emailLabel}
            hint="Anfragen über das Kontaktformular"
          />
          <ContactTile
            icon={MapPin}
            label="Standort"
            value={`${site.city}, ${site.country}`}
            hint={`${site.street} · ${site.zip} ${site.city}`}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={site.phoneHref}
            className="inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-ivory px-8 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-white"
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
            Jetzt anrufen
          </a>
          <Link
            href="/kontakt"
            className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 border border-line-strong px-8 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory transition-colors duration-150 hover:border-ivory/45 hover:bg-ivory/[0.05]"
          >
            Kontakt aufnehmen
            <ArrowRight className="h-4 w-4 text-champagne transition-transform duration-200 ease-premium group-hover:translate-x-1" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactTile({
  icon: Icon,
  label,
  value,
  hint,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  hint: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-champagne" strokeWidth={1.5} />
        <span className="eyebrow-muted">{label}</span>
      </div>
      <p className="tnum mt-4 font-display text-[1.0625rem] font-medium tracking-tight text-ivory">{value}</p>
      <p className="mt-1.5 text-[0.8125rem] text-ivory-500">{hint}</p>
    </>
  );

  const className = 'block bg-ink-900 p-6 transition-colors duration-150 md:p-7';

  return href ? (
    <a href={href} className={`${className} hover:bg-ink-850`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
