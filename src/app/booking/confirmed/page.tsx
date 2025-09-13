
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { getVehicle } from '@/lib/firestore';
import type { Vehicle } from '@/lib/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function ConfirmationDetails({ vehicleId, fromDate, toDate }: { vehicleId: string; fromDate: string; toDate: string; }) {
  const vehicle = await getVehicle(vehicleId);
  
  if (!vehicle || !fromDate || !toDate) {
    return notFound();
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-center items-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <CardTitle className="mt-4">Your trip is confirmed!</CardTitle>
          <CardDescription>
            You're all set. A confirmation has been sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-full sm:w-1/3 aspect-video rounded-md overflow-hidden">
              <Image 
                src={vehicle.images[0]} 
                alt={vehicle.name} 
                fill 
                className="object-cover"
                data-ai-hint={`${vehicle.make} ${vehicle.model}`}
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold font-headline">{vehicle.name}</h3>
              <p className="text-muted-foreground">{vehicle.year} &middot; {vehicle.make} {vehicle.model}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-semibold">Trip Dates</p>
                <p className="text-muted-foreground">{format(from, "MMM d, yyyy")} to {format(to, "MMM d, yyyy")}</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-semibold">Pickup Location</p>
                <p className="text-muted-foreground">{vehicle.location}</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full" asChild>
                <Link href="/profile/trips">View My Trips</Link>
            </Button>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/search">Book another car</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function BookingConfirmedPage({ searchParams }: { searchParams: { vehicleId?: string; from?: string; to?: string; }}) {
  const { vehicleId, from, to } = searchParams;

  if (!vehicleId || !from || !to) {
      notFound();
  }

  return (
    <Suspense fallback={<div>Loading confirmation...</div>}>
      <ConfirmationDetails vehicleId={vehicleId} fromDate={from} toDate={to} />
    </Suspense>
  )
}
