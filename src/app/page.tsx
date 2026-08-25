import { Hero } from '@/components/hero/hero';
import { HeroSearch } from '@/components/hero/hero-search';
import { InventoryPreview } from '@/components/vehicles/inventory-preview';
import { QualitySection } from '@/components/trust/quality-section';
import { StatsBand } from '@/components/trust/stats-band';
import { SellTeaser } from '@/components/sell-car/sell-teaser';
import { DetailingSection } from '@/components/detailing/detailing-section';
import { MobileDeBand } from '@/components/vehicles/mobile-de-band';
import { ShowroomSection } from '@/components/showroom/showroom-section';
import { ContactClosing } from '@/components/contact/contact-closing';
import { countByStatus, getFeaturedVehicles, getVehicleBySlug } from '@/lib/vehicle-repository';

export default function HomePage() {
  const featured = getFeaturedVehicles(6);
  const heroVehicle = getVehicleBySlug('mercedes-amg-g-63') ?? featured[0];
  const { total } = countByStatus();

  return (
    <>
      <Hero feature={heroVehicle} />
      <HeroSearch />
      <InventoryPreview vehicles={featured} total={total} />
      <MobileDeBand />
      <QualitySection />
      <StatsBand />
      <SellTeaser />
      <DetailingSection />
      <ShowroomSection />
      <ContactClosing />
    </>
  );
}
