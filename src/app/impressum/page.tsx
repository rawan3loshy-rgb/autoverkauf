import type { Metadata } from 'next';
import { LegalShell, LegalSection } from '@/components/layout/legal-shell';
import { site } from '@/lib/site';
import { imageCredits } from '@/data/image-credits';

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <LegalShell eyebrow="Rechtliches" title="Impressum" lead="Angaben gemäß § 5 DDG.">
      <LegalSection title="Anbieter">
        <p>
          {site.legalName}
          <br />
          {site.street}
          <br />
          {site.zip} {site.city}
          <br />
          {site.country}
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          Telefon: {site.phone}
          <br />
          E-Mail: {site.email}
        </p>
      </LegalSection>

      <LegalSection title="Vertretungsberechtigte">
        <p>
          Geschäftsführung: M. Brandhoff, T. Weiler
          <br />
          Registergericht: Amtsgericht Hannover · HRB 000000 (fiktiv)
          <br />
          Umsatzsteuer-Identifikationsnummer: DE000000000 (fiktiv)
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt">
        <p>
          M. Brandhoff, Anschrift wie oben. Sämtliche Registerangaben dieser Demo sind erfunden und dienen
          ausschließlich der Darstellung eines vollständigen Impressums.
        </p>
      </LegalSection>

      <LegalSection title="Streitbeilegung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit. Zur Teilnahme an einem
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle wären wir weder verpflichtet noch bereit –
          da es sich um ein Demonstrationsprojekt handelt, entstehen ohnehin keine Vertragsverhältnisse.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte und Links">
        <p>
          Die Inhalte dieser Demo wurden mit Sorgfalt erstellt, erheben jedoch keinen Anspruch auf Richtigkeit oder
          Vollständigkeit. Fahrzeugbeschreibungen, Verbrauchsangaben, Preise und Verfügbarkeiten sind frei erfunden.
        </p>
        <p>
          Für die Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt der
          Verlinkung waren keine rechtswidrigen Inhalte erkennbar.
        </p>
      </LegalSection>

      <LegalSection title="Bildnachweis">
        <p>
          Die verwendeten Fahrzeugaufnahmen stammen aus frei lizenzierten Quellen. Sie zeigen Fahrzeuge des jeweiligen
          Typs, jedoch nicht die hier beschriebenen fiktiven Einzelfahrzeuge.
        </p>
        <ul className="mt-4 space-y-2 text-[0.8125rem] text-ivory-400">
          {imageCredits.map((c) => (
            <li key={c.file}>
              <span className="text-ivory-300">{c.title || 'Ohne Titel'}</span>
              {c.creator ? ` · ${c.creator}` : ''}
              {c.license ? ` · ${c.license}` : ''}
              {c.landing && (
                <>
                  {' · '}
                  <a
                    href={c.landing}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline-offset-4 transition-colors hover:text-ivory hover:underline"
                  >
                    Quelle
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </LegalSection>
    </LegalShell>
  );
}
