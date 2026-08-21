import { Hero } from '@/components/hero/hero';
import { HeroSearch } from '@/components/hero/hero-search';
import { InventoryPreview } from '@/components/vehicles/inventory-preview';
import { QualitySection } from '@/components/trust/quality-section';
import { StatsBand } from '@/components/trust/stats-band';
import { SellTeaser } from '@/components/sell-car/sell-teaser';
import { FinancingSection } from '@/components/financing/financing-section';
import { ShowroomSection } from '@/components/showroom/showroom-section';
import { ContactClosing } from '@/components/contact/contact-closing';
import { countByStatus, getFeaturedVehicles, getVehicleBySlug } from '@/lib/vehicle-repository';
import { fullName } from '@/lib/vehicle-utils';

export default function HomePage() {
  const featured = getFeaturedVehicles(6);
  const heroVehicle = getVehicleBySlug('mercedes-amg-g-63') ?? featured[0];
  const { total } = countByStatus();

  // Für die Beispielrechnung nehmen wir bewusst ein Fahrzeug aus der Mitte des Bestands.
  const financeVehicle = getVehicleBySlug('bmw-m4-competition-xdrive') ?? featured[0];

  return (
    <>
      <Hero feature={heroVehicle} />
      <HeroSearch />
      <InventoryPreview vehicles={featured} total={total} />
      <QualitySection />
      <StatsBand />
      <SellTeaser />
      <FinancingSection price={financeVehicle.price} vehicleLabel={fullName(financeVehicle)} />
      <ShowroomSection />
      <ContactClosing />
    </>
  );
}
