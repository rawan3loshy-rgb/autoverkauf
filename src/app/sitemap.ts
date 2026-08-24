import type { MetadataRoute } from 'next';
import { getVehicleSlugs } from '@/lib/vehicle-repository';

const BASE = 'https://autokunst.de';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/fahrzeuge', '/ankauf', '/finanzierung', '/ueber-uns', '/kontakt'].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const vehicleRoutes = getVehicleSlugs().map((slug) => ({
    url: `${BASE}/fahrzeuge/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
