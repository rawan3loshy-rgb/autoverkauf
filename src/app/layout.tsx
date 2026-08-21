import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileActionBar } from '@/components/layout/mobile-action-bar';
import { site } from '@/lib/site';

const display = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nova-motors.de'),
  title: {
    default: 'NOVA MOTORS — Automobile mit Charakter.',
    template: '%s | NOVA MOTORS',
  },
  description:
    'Ausgewählte Gebrauchtwagen, geprüfte Qualität und persönliche Beratung. NOVA MOTORS in Hannover kauft und verkauft Fahrzeuge deutschlandweit.',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'NOVA MOTORS',
    title: 'NOVA MOTORS — Automobile mit Charakter.',
    description: 'Ausgewählte Fahrzeuge. Geprüfte Qualität. Persönliche Beratung.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ivory focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
        >
          Zum Inhalt springen
        </a>
        <Header />
        <main id="inhalt" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AutoDealer',
              name: site.legalName,
              telephone: site.phone,
              email: site.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: site.street,
                postalCode: site.zip,
                addressLocality: site.city,
                addressCountry: 'DE',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
