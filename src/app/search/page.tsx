
import { Suspense } from 'react';
import { getVehicles } from '@/lib/firestore';
import SearchPageClient from '@/components/search-page-client';
import type { Vehicle } from '@/lib/types';

export default async function SearchPage() {
  // Fetch initial full list for AI Assistant context.
  // The interactive filtering will use server actions.
  const allVehicles: Vehicle[] = await getVehicles();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient allVehicles={allVehicles} />
    </Suspense>
  )
}
