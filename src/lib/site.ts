/** Zentrale Stammdaten der Demo-Firma. Ein Ort, an dem später echte Daten einlaufen. */
export const site = {
  name: 'NOVA MOTORS',
  legalName: 'NOVA MOTORS GmbH',
  tagline: 'Automobile mit Charakter.',
  phone: '+49 511 284 73 90',
  phoneHref: 'tel:+495112847390',
  email: 'info@nova-motors.de',
  street: 'Hildesheimer Straße 214',
  zip: '30519',
  city: 'Hannover',
  country: 'Deutschland',
  hours: [
    { days: 'Montag – Freitag', time: '09:00 – 18:00 Uhr' },
    { days: 'Samstag', time: '10:00 – 14:00 Uhr' },
    { days: 'Sonntag', time: 'Nach Vereinbarung' },
  ],
  instagram: 'https://www.instagram.com/',
} as const;

export const nav = [
  { label: 'Fahrzeuge', href: '/fahrzeuge' },
  { label: 'Ankauf', href: '/ankauf' },
  { label: 'Finanzierung', href: '/finanzierung' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Kontakt', href: '/kontakt' },
] as const;
