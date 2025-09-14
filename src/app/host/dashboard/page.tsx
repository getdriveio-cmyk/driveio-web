
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import type { Booking, Vehicle } from '@/lib/types';
import HostDashboardClient from '@/components/host/host-dashboard-client';
import { getBookingsForHostAdmin, getVehiclesByHostAdmin } from '@/lib/firestore-admin';
import { auth } from '@/lib/firebase/server';
import { redirect } from 'next/navigation';

export default async function HostDashboard() {
  const { user } = await auth();
  if (!user) redirect('/login?redirect=/host/dashboard');

  // Optionally ensure they are a host (in hosts doc)
  // For now, fetch; client UI will still render based on props

  const [listings, bookings] = await Promise.all<[
    Vehicle[],
    Booking[]
  ]>([
    getVehiclesByHostAdmin(user.uid),
    getBookingsForHostAdmin(user.uid),
  ]);

  return <HostDashboardClient initialListings={listings} initialBookings={bookings} />;
}
