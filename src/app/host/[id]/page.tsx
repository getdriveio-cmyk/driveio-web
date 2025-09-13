
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Calendar } from 'lucide-react';
import VehicleCard from '@/components/vehicle-card';
import { getHost, getVehiclesByHost } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export default async function HostProfilePage({ params }: { params: { id: string } }) {
  const host = await getHost(params.id);
  
  if (!host) {
    notFound();
  }
  
  const hostVehicles = await getVehiclesByHost(params.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-32 h-32 text-4xl">
            <AvatarImage src={host.avatarUrl} alt={host.name} />
            <AvatarFallback>{host.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-4xl font-bold font-headline">{host.name}</h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined in {new Date(host.joinedDate).getFullYear()}</span>
              </div>
              {host.isVerified && (
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Verified Host</span>
                </div>
              )}
            </div>
            <p className="pt-2 text-foreground">
              Passionate about cars and providing great experiences for travelers. My vehicles are always clean, well-maintained, and ready for your next adventure.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-3xl font-bold font-headline mb-6">{host.name}'s Vehicles ({hostVehicles.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
}
