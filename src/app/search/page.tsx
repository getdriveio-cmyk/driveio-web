
import { Suspense } from 'react';
import { getVehiclesAdmin } from '@/lib/firestore-admin';
export const dynamic = 'force-dynamic';
import SearchPageClient from '@/components/search-page-client';
import type { Vehicle } from '@/lib/types';

export default async function SearchPage() {
  // Fetch initial full list for AI Assistant context.
  // The interactive filtering will use server actions.
  const allVehicles: Vehicle[] = await getVehiclesAdmin();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient allVehicles={allVehicles} />
    </Suspense>
  )
}
