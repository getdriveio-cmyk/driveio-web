
"use client";

import { useEffect } from 'react';
import type { DateRange } from 'react-day-picker';
import { addDays, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Label } from '@/components/ui/label';
import type { Vehicle } from '@/lib/types';
import { useSearchStore } from '@/lib/store';
import Link from 'next/link';


export const BookingCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const { dateRange, setDateRange } = useSearchStore();

    // Ensure there's a default date range if the store is empty, only on client
    useEffect(() => {
        if (!dateRange || !dateRange.from) {
            setDateRange({
                from: new Date(),
                to: addDays(new Date(), 4),
            });
        }
    }, [dateRange, setDateRange]);

    const handleDateChange = (newRange: DateRange | undefined) => {
        setDateRange(newRange);
    }

    const fromDate = dateRange?.from ? new Date(dateRange.from) : undefined;
    const toDate = dateRange?.to ? new Date(dateRange.to) : undefined;

    const numberOfDays = fromDate && toDate ? differenceInDays(toDate, fromDate) : 0;
    const priceForDays = numberOfDays * vehicle.pricePerDay;
    const serviceFee = 50;
    const total = priceForDays > 0 ? priceForDays + serviceFee : 0;
    
    const checkoutUrl = `/checkout?vehicleId=${vehicle.id}&from=${fromDate?.toISOString()}&to=${toDate?.toISOString()}`;

    return (
    <Card className="sticky top-24 shadow-lg">
        <CardHeader>
            <CardTitle>
                ${vehicle.pricePerDay} <span className="text-base font-normal text-muted-foreground">/ day</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Trip Dates</Label>
              <DateRangePicker date={dateRange} onDateChange={handleDateChange} />
            </div>
            <Separator />
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>${vehicle.pricePerDay.toLocaleString()} x {numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span> 
                    <span>${priceForDays > 0 ? priceForDays.toLocaleString() : 0}</span>
                </div>
                <div className="flex justify-between">
                    <span>Service fee</span> 
                    <span>{priceForDays > 0 ? `$${serviceFee}` : '$0'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span> 
                    <span>${total.toLocaleString()}</span>
                </div>
            </div>
            <Button 
                size="lg" 
                className="w-full" 
                disabled={!total || !fromDate || !toDate}
                asChild={total && fromDate && toDate}
            >
                {total && fromDate && toDate ? (
                    <Link href={checkoutUrl}>Book Now</Link>
                ) : (
                    <span>Select dates to book</span>
                )}
            </Button>
        </CardContent>
    </Card>
);
}
