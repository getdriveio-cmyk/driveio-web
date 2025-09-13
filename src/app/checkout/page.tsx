
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Vehicle } from '@/lib/types';
import { getVehicle } from '@/lib/firestore';
import CheckoutClient from '@/components/checkout-client';

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
        <Suspense fallback={<div>Loading booking details...</div>}>
            <CheckoutSummary vehicleId={vehicleId} fromDate={from} toDate={to} />
        </Suspense>
    )
}
