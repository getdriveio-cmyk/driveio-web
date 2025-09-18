
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Vehicle } from '@/lib/types';
import { getVehicle } from '@/lib/firestore';
import CheckoutClient from '@/components/checkout-client';
import { Skeleton } from '@/components/ui/skeleton';

async function CheckoutSummary({ vehicleId, fromDate, toDate }: { vehicleId: string, fromDate: string, toDate: string }) {
  const vehicle = await getVehicle(vehicleId);

  if (!vehicle) {
    return notFound();
  }
  
  return (
    <CheckoutClient vehicle={vehicle} fromDate={fromDate} toDate={toDate} />
  );
}

export default function CheckoutPage({ searchParams }: { searchParams: { vehicleId?: string, from?: string, to?: string } }) {
    const { vehicleId, from, to } = searchParams;

    if (!vehicleId || !from || !to) {
        return notFound();
    }

    return (
        <Suspense fallback={
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        }>
            <CheckoutSummary vehicleId={vehicleId} fromDate={from} toDate={to} />
        </Suspense>
    )
}
