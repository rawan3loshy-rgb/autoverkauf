import type { Metadata } from 'next';
import { LegalShell, LegalSection } from '@/components/layout/legal-shell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Datenschutz',
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <LegalShell
      eyebrow="Rechtliches"
      title="Datenschutzhinweise"
      lead="Informationen zur Verarbeitung personenbezogener Daten gemäß Art. 13 DSGVO."
    >
      <LegalSection title="Verantwortlicher">
        <p>
          {site.legalName}, {site.street}, {site.zip} {site.city}. Kontakt: {site.email}, {site.phone}. Es handelt sich
          um ein fiktives Unternehmen im Rahmen einer Designdemonstration.
        </p>
      </LegalSection>

      <LegalSection title="Verarbeitung in dieser Demo">
        <p>
          Diese Demo verarbeitet keine personenbezogenen Daten. Eingaben in die Formulare – Fahrzeugdaten,
          Kontaktangaben und optional ausgewählte Fotos – verbleiben ausschließlich im Arbeitsspeicher Ihres Browsers.
          Es findet keine Übertragung an einen Server statt, es werden keine Daten gespeichert und keine E-Mails
          versendet.
        </p>
        <p>
          Auch die angezeigte Vorgangsnummer wird lokal erzeugt. Sie dient nur dazu, den Ablauf einer echten Anfrage
          nachvollziehbar darzustellen.
        </p>
      </LegalSection>

      <LegalSection title="Cookies und Tracking">
        <p>
          Es werden keine Cookies gesetzt, die nicht für den Betrieb erforderlich sind. Es kommen keine
          Analysewerkzeuge, keine Werbenetzwerke und keine Social-Media-Plugins zum Einsatz. Ausgewählte Filter werden
          in der Adresszeile abgebildet, damit Sie eine Suche teilen oder als Lesezeichen speichern können – auch das
          geschieht ohne Speicherung auf einem Server.
        </p>
      </LegalSection>

      <LegalSection title="Schriften und externe Inhalte">
        <p>
          Die verwendeten Schriftarten werden im Rahmen des Seitenaufbaus mit ausgeliefert und nicht bei jedem Aufruf
          von einem Drittanbieter nachgeladen. Karten- oder Videodienste sind nicht eingebunden.
        </p>
      </LegalSection>

      <LegalSection title="Ihre Rechte">
        <p>
          Ihnen stehen die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch zu, ebenso das Recht auf Beschwerde bei einer Aufsichtsbehörde. Da in
          dieser Demo keine Daten erhoben werden, laufen entsprechende Auskunftsersuchen praktisch ins Leere.
        </p>
      </LegalSection>

      <LegalSection title="Hinweis für den produktiven Einsatz">
        <p>
          Wird dieses Projekt in Betrieb genommen, sind die Hinweise um die dann tatsächlich eingesetzten
          Verarbeitungen zu ergänzen: Formularübermittlung und deren Rechtsgrundlage, Hosting und Auftragsverarbeitung,
          Speicherfristen, Empfängerkategorien sowie eingebundene Dienste Dritter.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
