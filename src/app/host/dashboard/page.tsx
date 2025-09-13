
'use client';

import type { Booking, Vehicle } from '@/lib/types';
import { getVehiclesByHost, getBookingsForHost } from '@/lib/firestore';
import HostDashboardClient from '@/components/host/host-dashboard-client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HostDashboard() {
  const { user, isHydrating, isLoggedIn } = useAuth.getState();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect handles authentication and redirection.
    // It waits until the auth state is hydrated from storage.
    if (!isHydrating) {
      if (!isLoggedIn || !user?.isHost) {
        // If not logged in or not a host, redirect to login.
        router.push('/login');
      }
    }
  }, [isHydrating, isLoggedIn, user, router]);

  useEffect(() => {
    // This effect handles data fetching.
    // It only runs if the user is authenticated as a host.
    async function fetchData() {
      if (user?.isHost && isLoggedIn) {
        setLoading(true);
        try {
          const [hostListings, hostBookings] = await Promise.all([
            getVehiclesByHost(user.uid),
            getBookingsForHost(user.uid)
          ]);
          setListings(hostListings);
          setBookings(hostBookings);
        } catch (error) {
          console.error("Failed to fetch host data:", error);
          // Optionally, set an error state here to show a message to the user
        } finally {
          setLoading(false);
        }
      } else if (!isHydrating) {
        // If not a host or not logged in (and not hydrating), stop loading.
        setLoading(false);
      }
    }
    fetchData();
  }, [user, isLoggedIn, isHydrating]);


  if (isHydrating || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
  
  // If the user is not a host after loading, they will be redirected.
  // Render null to avoid briefly showing the component before redirection.
  if (!user?.isHost) {
    return null;
  }

  return <HostDashboardClient initialListings={listings} initialBookings={bookings} />;
}
