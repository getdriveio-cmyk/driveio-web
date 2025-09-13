
'use client';

import { useFavoriteStore } from '@/lib/store';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export default function FavoriteButton({ vehicleId }: { vehicleId: string }) {
    const { isFavorite, toggleFavorite } = useFavoriteStore();
    const favorited = isFavorite(vehicleId);

    return (
        <Button variant="ghost" className="text-lg" onClick={() => toggleFavorite(vehicleId)}>
            <Heart className={cn("mr-2 h-5 w-5", favorited && "fill-red-500 text-red-500")} />
            {favorited ? 'Saved' : 'Save'}
        </Button>
    )
}
