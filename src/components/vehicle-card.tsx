
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import { Button } from './ui/button';
import { useFavoriteStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { TeslaIcon, PorscheIcon, FordIcon, JeepIcon, HondaIcon, ToyotaIcon } from './make-icons';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const makeIcons: { [key: string]: React.ReactNode } = {
  'Tesla': <TeslaIcon />,
  'Porsche': <PorscheIcon />,
  'Ford': <FordIcon />,
  'Jeep': <JeepIcon />,
  'Honda': <HondaIcon />,
  'Toyota': <ToyotaIcon />,
};

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const favorited = isFavorite(vehicle.id);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(vehicle.id);
  };

  return (
    <Link href={`/listing/${vehicle.id}`} className="block group" data-testid="vehicle-card">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative w-full aspect-video">
          <Image
            src={vehicle.images[0]}
            alt={vehicle.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={`${vehicle.make} ${vehicle.model}`}
          />
          <Button 
            size="icon" 
            variant="secondary" 
            className="absolute top-3 right-3 rounded-full h-8 w-8"
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("w-4 h-4", favorited && "fill-red-500 text-red-500")} />
          </Button>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 text-muted-foreground">{makeIcons[vehicle.make]}</div>
               <h3 className="font-bold font-headline text-lg">{vehicle.name}</h3>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{vehicle.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{vehicle.location}</p>
          <div className="mt-auto pt-4">
             <p className="text-lg font-bold">
              ${vehicle.pricePerDay}
              <span className="text-sm font-normal text-muted-foreground">/day</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VehicleCard;
