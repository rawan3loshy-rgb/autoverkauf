import type { Metadata } from 'next';
import { LegalShell, LegalSection } from '@/components/layout/legal-shell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AGB',
  robots: { index: false },
};

export default function AgbPage() {
  return (
    <LegalShell
      eyebrow="Rechtliches"
      title="Allgemeine Geschäftsbedingungen"
      lead="Beispielhafte Fassung für den Verkauf und Ankauf gebrauchter Kraftfahrzeuge."
    >
      <LegalSection title="1. Geltungsbereich">
        <p>
          Diese Bedingungen gelten für Verträge über den Verkauf und den Ankauf gebrauchter Kraftfahrzeuge zwischen der
          {' '}
          {site.legalName} und ihren Kundinnen und Kunden. Abweichende Bedingungen gelten nur, wenn sie schriftlich
          bestätigt wurden.
        </p>
      </LegalSection>

      <LegalSection title="2. Angebot und Vertragsschluss">
        <p>
          Die Darstellung von Fahrzeugen auf dieser Website stellt kein bindendes Angebot dar. Anfragen über die
          Formulare sind eine Aufforderung zur Kontaktaufnahme. Ein Kaufvertrag kommt erst durch beiderseitige
          Unterzeichnung eines schriftlichen Kaufvertrags zustande.
        </p>
      </LegalSection>

      <LegalSection title="3. Preise und Zahlung">
        <p>
          Alle Preise verstehen sich in Euro einschließlich der gesetzlichen Umsatzsteuer, sofern nicht ausdrücklich
          eine Differenzbesteuerung nach § 25a UStG ausgewiesen ist. Überführungs- und Zulassungskosten werden gesondert
          vereinbart. Der Kaufpreis ist vor Übergabe vollständig zu entrichten.
        </p>
      </LegalSection>

      <LegalSection title="4. Übergabe und Eigentumsvorbehalt">
        <p>
          Die Übergabe erfolgt am Standort {site.city}, sofern nichts anderes vereinbart wurde. Das Fahrzeug bleibt bis
          zur vollständigen Zahlung Eigentum des Verkäufers.
        </p>
      </LegalSection>

      <LegalSection title="5. Sachmängel">
        <p>
          Für Gebrauchtfahrzeuge beträgt die Verjährungsfrist für Ansprüche wegen Sachmängeln ein Jahr ab Übergabe. Für
          Verbraucherinnen und Verbraucher gelten die gesetzlichen Bestimmungen. Verschleiß, der dem Alter und der
          Laufleistung des Fahrzeugs entspricht, stellt keinen Sachmangel dar.
        </p>
      </LegalSection>

      <LegalSection title="6. Ankauf von Fahrzeugen">
        <p>
          Eine über die Website übermittelte Fahrzeugbewertung ist unverbindlich und beruht ausschließlich auf den
          Angaben der verkaufenden Person. Ein verbindliches Ankaufsangebot setzt die Besichtigung des Fahrzeugs voraus.
          Weichen Zustand oder Ausstattung erheblich von den Angaben ab, entfällt die Bindung an eine zuvor genannte
          Einschätzung.
        </p>
      </LegalSection>

      <LegalSection title="7. Probefahrten">
        <p>
          Probefahrten erfolgen nach Terminvereinbarung und nur mit gültiger Fahrerlaubnis. Für Schäden, die während
          einer Probefahrt vorsätzlich oder grob fahrlässig verursacht werden, haftet die fahrende Person.
        </p>
      </LegalSection>

      <LegalSection title="8. Schlussbestimmungen">
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland. Sollte eine Bestimmung unwirksam sein, bleibt die
          Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>
        <p>
          Diese Fassung ist Teil eines Demonstrationsprojekts und ersetzt keine rechtliche Beratung. Vor einem
          produktiven Einsatz ist eine Prüfung durch eine Rechtsanwältin oder einen Rechtsanwalt erforderlich.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
