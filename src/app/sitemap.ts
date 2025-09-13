
import { getVehiclesAdmin } from '@/lib/firestore-admin';
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://getdriveio.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes = [
    '', 
    '/about', 
    '/contact', 
    '/host', 
    '/hosting/guidelines', 
    '/hosting/insurance',
    '/help-center',
    '/careers',
    '/press',
    '/privacy-policy',
    '/terms-of-service',
    '/search'
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic pages (vehicle listings)
  const vehicles = await getVehiclesAdmin();
  const vehicleRoutes = vehicles.map((vehicle) => ({
    url: `${BASE_URL}/listing/${vehicle.id}`,
    lastModified: new Date().toISOString(), // In a real app, you might use a vehicle's 'updatedAt' field
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
