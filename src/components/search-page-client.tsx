
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useTransition } from 'react';
import VehicleCard from "@/components/vehicle-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ListFilter, X, CarFront, CarTaxiFront, Rocket, Snowflake, Truck, Sailboat, List, Map, Loader2 } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useSearchStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import type { Vehicle } from '@/lib/types';
import AiAssistant from '@/components/ai-assistant';
import { cn } from '@/lib/utils';
import MapView from '@/components/map-view';
import { addDays } from 'date-fns';
// Use API route to avoid server action cross-origin issues on App Hosting

const vehicleFeatures = ['Electric', '4x4', 'Autopilot', 'Convertible'];
const vehicleTypes = [
  { name: 'Sedan', icon: <CarFront className="h-6 w-6" />, type: 'sedan' },
  { name: 'SUV', icon: <CarTaxiFront className="h-6 w-6" />, type: 'suv' },
  { name: 'Sports', icon: <Rocket className="h-6 w-6" />, type: 'sports' },
  { name: 'Convertible', icon: <Snowflake className="h-6 w-6" />, type: 'convertible' },
  { name: 'Truck', icon: <Truck className="h-6 w-6" />, type: 'truck' },
  { name: 'Van', icon: <Sailboat className="h-6 w-6" />, type: 'van' },
];

const Filters = ({ 
  typeFilter, setTypeFilter, 
  priceFilter, setPriceFilter,
  featuresFilter, setFeaturesFilter,
  ratingFilter, setRatingFilter,
  resetFilters
}: any) => {
  const { location, setLocation, dateRange, setDateRange } = useSearchStore();

  // Set default date range on client to avoid hydration mismatch
  useEffect(() => {
    if (!dateRange) {
      setDateRange({
        from: new Date(),
        to: addDays(new Date(), 7),
      });
    }
  }, [dateRange, setDateRange]);

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const lowerCaseFeature = feature.toLowerCase();
    setFeaturesFilter((prev: string[]) => 
      checked ? [...prev, lowerCaseFeature] : prev.filter(f => f !== lowerCaseFeature)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ListFilter className="w-5 h-5" />
            Filters
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetFilters}>
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="space-y-2">
          <Label>Location</Label>
          <Input placeholder="City, airport, or address" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Trip Dates</Label>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicle-type">Vehicle Type</Label>
          <div className="grid grid-cols-2 gap-2">
             {vehicleTypes.map(type => (
              <Card 
                key={type.name}
                onClick={() => setTypeFilter(typeFilter === type.type ? 'all' : type.type)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 h-full hover:bg-accent transition-colors cursor-pointer text-foreground/80 hover:text-foreground",
                  typeFilter === type.type && 'bg-accent text-accent-foreground ring-2 ring-primary'
                )}
              >
                {type.icon}
                <p className="mt-1 text-xs font-semibold">{type.name}</p>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price Range</Label>
          <Slider value={[priceFilter]} onValueChange={(value) => setPriceFilter(value[0])} max={1000} step={10} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span>Up to ${priceFilter}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Features</Label>
          <div className="space-y-2">
            {vehicleFeatures.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox 
                  id={feature} 
                  checked={featuresFilter.includes(feature.toLowerCase())}
                  onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                />
                <Label htmlFor={feature} className="font-normal">{feature}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Rating</Label>
          <Select value={ratingFilter.toString()} onValueChange={(value) => setRatingFilter(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="4.5">4.5 Stars & Up</SelectItem>
              <SelectItem value="4">4 Stars & Up</SelectItem>
              <SelectItem value="3">3 Stars & Up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
};

interface SearchPageClientProps {
    allVehicles: Vehicle[]; // Keep this for AI assistant context
}

export default function SearchPageClient({ allVehicles }: SearchPageClientProps) {
  const { location } = useSearchStore();
  const searchParams = useSearchParams();
  
  const [isPending, startTransition] = useTransition();
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState(1000);
  const [featuresFilter, setFeaturesFilter] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [view, setView] = useState('list');

  // Set initial type from URL params
  useEffect(() => {
    const type = searchParams.get('type');
    if (type && vehicleTypes.some(vt => vt.type === type)) {
      setTypeFilter(type);
    }
  }, [searchParams]);

  // This is the core logic change: fetch data when filters change
  const runSearch = useCallback(() => {
    startTransition(async () => {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: typeFilter,
            maxPrice: priceFilter,
            features: featuresFilter,
            minRating: ratingFilter,
            location: location,
          })
        });
        if (!res.ok) {
          setFilteredVehicles([]);
          return;
        }
        const data = await res.json();
        setFilteredVehicles(data.vehicles || []);
    });
  }, [typeFilter, priceFilter, featuresFilter, ratingFilter, location]);
  
  // Run search on initial load and whenever filters change
  useEffect(() => {
    runSearch();
  }, [runSearch]);
  
  const resetFilters = () => {
    setTypeFilter('all');
    setPriceFilter(1000);
    setFeaturesFilter([]);
    setRatingFilter(0);
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
      <aside className="lg:col-span-1 xl:col-span-1">
        <div className="sticky top-24 space-y-6">
          <Filters 
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            priceFilter={priceFilter} setPriceFilter={setPriceFilter}
            featuresFilter={featuresFilter} setFeaturesFilter={setFeaturesFilter}
            ratingFilter={ratingFilter} setRatingFilter={setRatingFilter}
            resetFilters={resetFilters}
          />
          <AiAssistant vehicles={allVehicles}/>
        </div>
      </aside>
      <main className="lg:col-span-2 xl:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline">
            {isPending ? <Loader2 className="animate-spin inline-block mr-2" /> : `${filteredVehicles.length} `} 
             Available Vehicles {location ? `in ${location}` : ''}
          </h1>
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            <Button size="icon" variant={view === 'list' ? 'secondary' : 'ghost'} onClick={() => setView('list')}>
              <List className="h-5 w-5" />
            </Button>
            <Button size="icon" variant={view === 'map' ? 'secondary' : 'ghost'} onClick={() => setView('map')}>
              <Map className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {isPending ? (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        ) : view === 'list' ? (
            filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle: Vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <h3 className="text-xl font-semibold">No vehicles found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or searching a different location.</p>
                  <Button onClick={resetFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            )
          ) : (
            <MapView vehicles={filteredVehicles} />
          )
        }
      </main>
    </div>
  );
}
