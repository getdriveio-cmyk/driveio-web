
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VehicleCard from "@/components/vehicle-card";
import { getVehiclesAdmin } from '@/lib/firestore-admin';
import type { Vehicle } from '@/lib/types';
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function MyTripsPage() {
    // In a real app, you would fetch actual booking data for the user.
    // For this demo, we'll fetch a sample of vehicles to represent trips.
    const allVehicles = await getVehiclesAdmin(4);
    const upcomingTrips = allVehicles.slice(0, 2);
    const pastTrips = allVehicles.slice(2, 4);

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Trips</CardTitle>
                <CardDescription>View your upcoming and past journeys.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-2xl font-bold font-headline mb-4">Upcoming</h3>
                    {upcomingTrips.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {upcomingTrips.map((vehicle) => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </div>
                    ) : <p className="text-muted-foreground">You have no upcoming trips.</p>
                    }
                </div>
                <Separator />
                    <div>
                    <h3 className="text-2xl font-bold font-headline mb-4">Past Trips</h3>
                    {pastTrips.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {pastTrips.map((vehicle) => (
                                <div key={vehicle.id} className="space-y-2">
                                    <VehicleCard vehicle={vehicle} />
                                    <Button variant="outline" className="w-full">Leave a review</Button>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-muted-foreground">You have no past trips.</p>
                    }
                </div>
            </CardContent>
        </Card>
    );
}
