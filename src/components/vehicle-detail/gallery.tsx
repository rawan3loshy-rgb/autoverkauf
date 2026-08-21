'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import { StatusBadge } from '@/components/vehicles/vehicle-card';

export function Gallery({ vehicle }: { vehicle: Vehicle }) {
  const images = vehicle.images;
  const [index, setIndex] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const stripRef = React.useRef<HTMLDivElement>(null);

  const go = React.useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length],
  );

  // Tastatur: im Lightbox immer, sonst nur Pfeile.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape' && lightbox) setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, lightbox]);

  React.useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  // Aktives Vorschaubild in den sichtbaren Bereich holen.
  React.useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    active?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [index]);

  // Wischgesten auf dem Hauptbild.
  const touchX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const current = images[index];

  return (
    <div>
      <div
        className="group relative aspect-[3/2] overflow-hidden bg-ink-800"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 62vw"
            className={cn(
              'object-cover transition-opacity duration-200 ease-premium',
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
              vehicle.status === 'Verkauft' && 'opacity-75 grayscale',
            )}
          />
        ))}

        <div className="absolute left-0 top-0">
          <StatusBadge vehicle={vehicle} />
        </div>

        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center bg-ink-900/60 text-ivory opacity-0 backdrop-blur-sm transition-opacity duration-150 hover:bg-ink-900/85 focus-visible:opacity-100 group-hover:opacity-100"
          aria-label="Bild vergrößern"
        >
          <Expand className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <NavButton side="left" onClick={() => go(-1)} />
        <NavButton side="right" onClick={() => go(1)} />

        <div className="tnum pointer-events-none absolute bottom-0 right-0 bg-ink-900/70 px-3 py-2 text-xs text-ivory-300 backdrop-blur-sm">
          {index + 1} / {images.length}
        </div>
      </div>

      {/* Vorschaubilder */}
      <div ref={stripRef} className="hide-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            data-thumb={i}
            onClick={() => setIndex(i)}
            className={cn(
              'relative aspect-[3/2] w-[7.5rem] shrink-0 overflow-hidden bg-ink-800 transition-opacity duration-150 md:w-[8.5rem]',
              i === index ? 'opacity-100' : 'opacity-45 hover:opacity-80',
            )}
            aria-label={img.alt}
            aria-current={i === index}
          >
            <Image src={img.src} alt="" fill sizes="140px" className="object-cover" />
            <span
              className={cn(
                'absolute inset-x-0 bottom-0 h-[2px] transition-colors duration-150',
                i === index ? 'bg-champagne' : 'bg-transparent',
              )}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-ink-900/[0.97] animate-fade-in" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="text-[0.8125rem] text-ivory-300">{current.alt}</p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="-mr-2 p-2 text-ivory-400 transition-colors hover:text-ivory"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative flex-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            <NavButton side="left" onClick={() => go(-1)} large />
            <NavButton side="right" onClick={() => go(1)} large />
          </div>

          <div className="hide-scrollbar flex gap-2 overflow-x-auto border-t border-line px-5 py-4">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  'relative aspect-[3/2] w-24 shrink-0 overflow-hidden bg-ink-800',
                  i === index ? 'opacity-100 ring-1 ring-champagne' : 'opacity-45 hover:opacity-80',
                )}
                aria-label={img.alt}
              >
                <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({
  side,
  onClick,
  large = false,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  large?: boolean;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-1/2 flex -translate-y-1/2 items-center justify-center bg-ink-900/55 text-ivory backdrop-blur-sm transition-[opacity,background-color] duration-150 hover:bg-ink-900/85',
        large ? 'h-14 w-11' : 'h-16 w-10 opacity-0 focus-visible:opacity-100 group-hover:opacity-100',
        side === 'left' ? 'left-0' : 'right-0',
      )}
      aria-label={side === 'left' ? 'Vorheriges Bild' : 'Nächstes Bild'}
    >
      <Icon className="h-5 w-5" strokeWidth={1.5} />
    </button>
  );
}
