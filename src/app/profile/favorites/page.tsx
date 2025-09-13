
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { getVehicle } from '@/lib/firestore';
import type { Vehicle } from '@/lib/types';
import { useAuth } from '@/lib/store';
import VehicleCard from '@/components/vehicle-card';
import { useState, useEffect } from 'react';
import { useFavoriteStore } from '@/lib/store';


function FavoritesList() {
  const { favorites } = useFavoriteStore();
  const [favoriteVehicles, setFavoriteVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const vehiclePromises = favorites.map(id => getVehicle(id));
        const vehicles = (await Promise.all(vehiclePromises)).filter((v): v is Vehicle => v !== null);
        setFavoriteVehicles(vehicles);
      } catch (error) {
        console.error("Failed to fetch favorite vehicles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [favorites]);
  
  if (loading) {
    return (
       <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (favoriteVehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No favorites yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You haven’t saved any cars. When you do, they’ll show up here.
        </p>
        <Button asChild className="mt-4">
          <Link href="/search">Find a car</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {favoriteVehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}


export default function FavoritesPage() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Favorites</CardTitle>
          <CardDescription>
            Please log in to see your favorite vehicles.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Favorites</CardTitle>
        <CardDescription>
          Your saved vehicles. The perfect ride is just a click away.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FavoritesList />
      </CardContent>
    </Card>
  );
}
