import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { nav, site } from '@/lib/site';
import { Wordmark } from './wordmark';

const legal = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-900 pb-24 pt-16 md:pb-16">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="inline-block text-ivory">
              <Wordmark className="h-11 md:h-12" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory-400">{site.tagline}</p>
            <a
              href={site.phoneHref}
              className="tnum mt-6 inline-block font-display text-xl tracking-tight text-ivory transition-colors hover:text-champagne"
            >
              {site.phone}
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow-muted">Navigation</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ivory-300 transition-colors hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow-muted">Showroom</p>
            <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-ivory-300">
              <p>{site.legalName}</p>
              <p>{site.street}</p>
              <p>
                {site.zip} {site.city}
              </p>
              <p className="pt-2 text-ivory-400">{site.emailLabel}</p>
            </address>
            <div className="mt-5 space-y-1 text-sm text-ivory-500">
              {site.hours.slice(0, 2).map((h) => (
                <p key={h.days} className="tnum">
                  {h.days} · {h.time}
                </p>
              ))}
              <p className="pt-1 text-xs text-ivory-500">{site.hoursNote}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-line pt-7 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ivory-500">
            © {new Date().getFullYear()} {site.legalName} · Präsentationsdemo mit fiktiven Fahrzeugdaten
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {legal.map((item) => (
              <Link key={item.href} href={item.href} className="text-xs text-ivory-400 transition-colors hover:text-ivory">
                {item.label}
              </Link>
            ))}
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-xs text-ivory-400 transition-colors hover:text-ivory"
            >
              <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
