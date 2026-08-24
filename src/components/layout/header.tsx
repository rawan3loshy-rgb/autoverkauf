'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { nav, site } from '@/lib/site';
import { Wordmark } from './wordmark';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onHome = pathname === '/';

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-premium',
          scrolled || !onHome || open
            ? 'border-b border-line bg-ink-900/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-gradient-to-b from-ink-900/70 to-transparent',
        )}
      >
        <div className="container">
          <div
            className={cn(
              'flex items-center justify-between transition-[height] duration-300 ease-premium',
              scrolled ? 'h-[60px]' : 'h-[76px] md:h-[88px]',
            )}
          >
            <Link href="/" className="shrink-0 text-ivory transition-opacity hover:opacity-80" aria-label="Autokunst — Startseite">
              <Wordmark priority />
            </Link>

            <nav className="hidden items-center gap-9 lg:flex" aria-label="Hauptnavigation">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative py-1 text-[0.8125rem] uppercase tracking-wider transition-colors duration-150',
                      active ? 'text-ivory' : 'text-ivory-400 hover:text-ivory',
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'absolute -bottom-0.5 left-0 h-px bg-champagne transition-[width] duration-200 ease-premium',
                        active ? 'w-full' : 'w-0',
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <a
                href={site.phoneHref}
                className="hidden items-center gap-2 border border-line px-3.5 py-2.5 text-[0.8125rem] tracking-wide text-ivory-300 transition-colors duration-150 hover:border-line-strong hover:text-ivory md:inline-flex"
              >
                <Phone className="h-3.5 w-3.5 text-champagne" strokeWidth={1.75} />
                <span className="tnum hidden xl:inline">{site.phone}</span>
                <span className="xl:hidden">Anrufen</span>
              </a>

              <Link
                href="/ankauf"
                className="hidden h-11 items-center bg-ivory px-5 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 transition-colors duration-150 hover:bg-white sm:inline-flex"
              >
                Fahrzeug verkaufen
              </Link>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="-mr-2 flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
                aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
                aria-expanded={open}
              >
                {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            'absolute inset-0 bg-ink-900 transition-opacity duration-200 ease-premium',
            open ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-x-0 top-0 flex h-full flex-col pt-[76px] transition-[opacity,transform] duration-250 ease-premium',
            open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
          )}
        >
          <nav className="container flex flex-col pt-8" aria-label="Mobile Navigation">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-baseline justify-between border-b border-line py-5 text-ivory"
              >
                <span className="headline-sm font-display font-medium">{item.label}</span>
                <span className="eyebrow-muted tnum">{String(i + 1).padStart(2, '0')}</span>
              </Link>
            ))}
          </nav>

          <div className="container mt-auto pb-24 pt-8">
            <Link
              href="/ankauf"
              className="flex h-14 w-full items-center justify-center bg-ivory text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900"
            >
              Fahrzeug verkaufen
            </Link>
            <a
              href={site.phoneHref}
              className="mt-3 flex h-14 w-full items-center justify-center gap-2.5 border border-line-strong text-[0.8125rem] uppercase tracking-wider text-ivory"
            >
              <Phone className="h-4 w-4 text-champagne" strokeWidth={1.75} />
              <span className="tnum">{site.phone}</span>
            </a>
            <p className="mt-6 text-center text-xs text-ivory-500">
              {site.street} · {site.zip} {site.city}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
