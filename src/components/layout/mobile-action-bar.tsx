'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Phone } from 'lucide-react';
import { site } from '@/lib/site';

/**
 * Feste Aktionsleiste auf Mobilgeräten. Anrufen ist der kürzeste Weg zum Abschluss
 * und steht deshalb links, visuell dominant.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const isDetail = pathname.startsWith('/fahrzeuge/') && pathname !== '/fahrzeuge';

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink-900/95 backdrop-blur-xl md:hidden">
      <div className="flex items-stretch" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <a
          href={site.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 bg-ivory py-4 text-[0.8125rem] font-medium uppercase tracking-wider text-ink-900 active:bg-ivory-200"
        >
          <Phone className="h-4 w-4" strokeWidth={2} />
          Anrufen
        </a>
        <Link
          href={isDetail ? `${pathname}#anfrage` : '/kontakt'}
          className="flex flex-1 items-center justify-center gap-2 py-4 text-[0.8125rem] font-medium uppercase tracking-wider text-ivory active:bg-ink-700"
        >
          <MessageSquare className="h-4 w-4 text-champagne" strokeWidth={1.75} />
          Anfrage
        </Link>
      </div>
    </div>
  );
}
