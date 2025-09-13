
'use client';

import type { Vehicle } from '@/lib/types';
import { Card } from './ui/card';

interface MapViewProps {
  vehicles: Vehicle[];
}

export default function MapView({ vehicles }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <Card className="h-[70vh] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Google Maps API Key is missing.</p>
          <p>Please add it to your environment variables to display the map.</p>
        </div>
      </Card>
    );
  }

  // Use the location of the first vehicle as the map's center
  const mapCenter = vehicles.length > 0 ? vehicles[0].location : 'San Francisco, CA';
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(mapCenter)}`;

  return (
    <Card className="h-[70vh] overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapSrc}
      ></iframe>
    </Card>
  );
}
