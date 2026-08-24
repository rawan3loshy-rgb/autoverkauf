/** Zentrale Stammdaten. Ein Ort, an dem später weitere echte Daten einlaufen. */
export const site = {
  name: 'Autokunst',
  legalName: 'Autokunst',
  tagline: 'Automobile mit Charakter.',
  phone: '+49 172 8387450',
  phoneHref: 'tel:+491728387450',
  /**
   * Für Autokunst liegt noch keine offizielle E-Mail-Adresse vor. Bis dahin wird
   * bewusst keine Adresse erfunden – die Kontaktflächen zeigen diesen Hinweis.
   */
  emailLabel: 'E-Mail auf Anfrage',
  street: 'Ikarusallee 2',
  zip: '30179',
  city: 'Hannover',
  country: 'Deutschland',
  /** Demo-Zeiten für die Präsentation – noch nicht vom Betreiber bestätigt. */
  hours: [
    { days: 'Montag – Freitag', time: '09:00 – 18:00 Uhr' },
    { days: 'Samstag', time: '10:00 – 14:00 Uhr' },
    { days: 'Sonntag', time: 'Nach Vereinbarung' },
  ],
  hoursNote: 'Zeiten exemplarisch – Termine bitte telefonisch abstimmen.',
  instagram: 'https://www.instagram.com/',
} as const;

export const nav = [
  { label: 'Fahrzeuge', href: '/fahrzeuge' },
  { label: 'Ankauf', href: '/ankauf' },
  { label: 'Finanzierung', href: '/finanzierung' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Kontakt', href: '/kontakt' },
] as const;
