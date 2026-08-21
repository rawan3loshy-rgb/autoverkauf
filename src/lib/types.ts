export type Fuel = 'Benzin' | 'Diesel' | 'Elektro' | 'Hybrid (Benzin/Elektro)' | 'Hybrid (Diesel/Elektro)';
export type Transmission = 'Automatik' | 'Schaltgetriebe';
export type Drive = 'Allrad' | 'Heckantrieb' | 'Frontantrieb';
export type BodyType = 'Limousine' | 'Kombi' | 'SUV' | 'Coupé' | 'Cabriolet' | 'Sportwagen' | 'Kompakt';
export type VehicleStatus = 'Verfügbar' | 'Reserviert' | 'Verkauft';
export type Condition = 'Sehr gut' | 'Gut' | 'Gebraucht' | 'Beschädigt';

export interface VehicleImage {
  /** Path below /public */
  src: string;
  /** German alt text — also used as gallery caption */
  alt: string;
  /** Gallery role, drives thumbnail ordering */
  role: 'exterieur' | 'heck' | 'seite' | 'interieur' | 'cockpit' | 'raeder' | 'detail';
}

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant: string;
  price: number;
  /** Erstzulassung, ISO "YYYY-MM" */
  firstRegistration: string;
  mileage: number;
  fuel: Fuel;
  transmission: Transmission;
  /** Leistung in kW */
  powerKw: number;
  drive: Drive;
  bodyType: BodyType;
  color: string;
  colorFinish: string;
  interior: string;
  /** Hubraum in cm³, 0 for BEV */
  displacement: number;
  doors: number;
  seats: number;
  /** HU/AU, ISO "YYYY-MM" */
  inspection: string;
  previousOwners: number;
  serviceBook: boolean;
  accidentFree: boolean;
  emissionClass: string;
  /** Demo-Verbrauchswerte */
  consumption: number;
  consumptionUnit: string;
  co2: number;
  acceleration: number;
  topSpeed: number;
  weight: number;
  images: VehicleImage[];
  featured: boolean;
  status: VehicleStatus;
  headline: string;
  description: string;
  features: { group: string; items: string[] }[];
  highlights: string[];
  location: string;
}
