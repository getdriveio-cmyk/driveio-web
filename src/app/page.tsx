
import Link from 'next/link';
import VehicleCard from "@/components/vehicle-card";
import { testimonials } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, CarFront, CarTaxiFront, Rocket, Snowflake, Truck, Sailboat } from "lucide-react";
import TestimonialCard from '@/components/testimonial-card';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import type { Vehicle } from '@/lib/types';
import SearchCard from '@/components/search-card';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'DriveIO - Seamless Car Rentals for Every Journey',
  description: 'Book unique cars from trusted hosts. DriveIO is a peer-to-peer car sharing marketplace where you can rent any car you want, wherever you want it, from a vibrant community of local hosts.',
};


const vehicleTypes = [
  { name: 'Sedan', icon: <CarFront className="h-8 w-8" />, hint: 'sedan', type: 'sedan' },
  { name: 'SUV', icon: <CarTaxiFront className="h-8 w-8" />, hint: 'suv', type: 'suv' },
  { name: 'Sports', icon: <Rocket className="h-8 w-8" />, hint: 'sports car', type: 'sports' },
  { name: 'Convertible', icon: <Snowflake className="h-8 w-8" />, hint: 'convertible', type: 'convertible' },
  { name: 'Truck', icon: <Truck className="h-8 w-8" />, hint: 'truck', type: 'truck' },
  { name: 'Van', icon: <Sailboat className="h-8 w-8" />, hint: 'van', type: 'van' },
];

export default async function Home() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host');
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/vehicles?count=4`, { cache: 'no-store' });
  const data = await res.ok ? await res.json() : { vehicles: [] };
  const featuredVehicles: Vehicle[] = data.vehicles || [];

  return (
    <div className="space-y-16">
      <section className="relative -mx-4 -mt-8 h-[60vh] min-h-[500px] flex flex-col items-center justify-center text-center text-white">
        <video
          src="https://res.cloudinary.com/dt6dsxj0w/video/upload/v1757479236/Prompt_aerial_coastroad_202509090040_4sgut_c0ur4r.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Go Further with DriveIO</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Book unique cars from trusted hosts.
          </p>
          <SearchCard />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold font-headline text-center">Browse by Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {vehicleTypes.map((type) => (
            <Link key={type.name} href={`/search?type=${type.type}`} className="block">
              <div className="flex flex-col items-center justify-center p-6 h-full hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer rounded-lg border">
                {type.icon}
                <p className="mt-2 font-semibold">{type.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <h2 className="text-3xl font-bold font-headline">Featured Vehicles</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/search"><SlidersHorizontal className="mr-2 h-4 w-4" />All Filters</Link>
            </Button>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
         <div className="text-center">
            <Button size="lg" asChild>
                <Link href="/search">View All Vehicles</Link>
            </Button>
        </div>
      </section>
      
      <section className="relative rounded-xl overflow-hidden -mx-4">
        <div className="relative h-[50vh] min-h-[400px] w-full flex flex-col items-center justify-center text-center">
            <video
                src="https://res.cloudinary.com/dt6dsxj0w/video/upload/v1757479236/Prompt_aerial_coastroad_202509090040_4sgut_c0ur4r.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-white container px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Find the Drive of Your Life</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
             From luxury sedans for a special occasion to rugged SUVs for an outdoor adventure, your perfect car is just a search away.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
          <h2 className="text-3xl font-bold font-headline text-center">What Our Renters Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
          </div>
      </section>

    </div>
  );
}
