
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Label } from '@/components/ui/label';
import { useSearchStore } from '@/lib/store';
import { addDays } from 'date-fns';

export default function SearchCard() {
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

  return (
     <Card className="p-4 md:p-6 shadow-xl border mt-8 text-left max-w-4xl mx-auto bg-background/80 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2 space-y-1">
            <Label htmlFor="location" className="text-foreground">Location</Label>
            <Input id="location" placeholder="City, airport, or address" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="lg:col-span-2 space-y-1">
                <Label className="text-foreground">Trip Dates</Label>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>
            <Button size="lg" className="w-full h-11" asChild>
            <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Search
            </Link>
            </Button>
        </div>
    </Card>
  )
}
