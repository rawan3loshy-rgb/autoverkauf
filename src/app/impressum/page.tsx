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
          E-Mail: {site.emailLabel}
        </p>
      </LegalSection>

      <LegalSection title="Vertretungsberechtigte">
        <p>
          Rechtsform, Vertretungsberechtigte, Registereintrag und Umsatzsteuer-Identifikationsnummer werden vom
          Betreiber ergänzt. In dieser Präsentationsfassung sind hierzu bewusst keine Angaben hinterlegt.
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt">
        <p>
          Angabe wird vom Betreiber ergänzt, Anschrift wie oben. Dieses Impressum zeigt bislang nur die Struktur; die
          rechtlich verbindlichen Pflichtangaben folgen vor dem Livegang.
        </p>
      </LegalSection>

      <LegalSection title="Streitbeilegung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit. Da es sich hier um eine
          Präsentationsfassung handelt, entstehen über diese Website keine Vertragsverhältnisse. Die verbindliche
          Erklärung zur Verbraucherschlichtung wird vor dem Livegang ergänzt.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte und Links">
        <p>
          Die Inhalte dieser Präsentationsfassung wurden mit Sorgfalt erstellt, erheben jedoch keinen Anspruch auf
          Richtigkeit oder Vollständigkeit. Fahrzeugbeschreibungen, Verbrauchsangaben, Preise und Verfügbarkeiten sind
          Demo-Daten.
        </p>
        <p>
          Für die Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt der
          Verlinkung waren keine rechtswidrigen Inhalte erkennbar.
        </p>
      </LegalSection>

      <LegalSection title="Bildnachweis">
        <p>
          Die verwendeten Fahrzeugaufnahmen stammen aus frei lizenzierten Quellen. Sie zeigen Fahrzeuge des jeweiligen
          Typs, jedoch nicht die hier beschriebenen Demo-Einzelfahrzeuge.
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
