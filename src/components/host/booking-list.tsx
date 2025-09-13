
'use client';

import { useState } from 'react';
import type { Booking } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { updateBookingStatusAction } from '@/app/host/dashboard/actions';

interface BookingListProps {
  bookings: Booking[];
}

export default function BookingList({ bookings: initialBookings }: BookingListProps) {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const handleBookingAction = async (booking: Booking, newStatus: 'confirmed' | 'declined') => {
    const originalStatus = booking.status;
    // Optimistically update the UI
    setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: newStatus } : b));
    
    const result = await updateBookingStatusAction(booking.id, newStatus);
    
    if (result.success) {
      toast({
        title: `Booking ${newStatus}`,
        description: `The booking request has been ${newStatus}.`,
      });
    } else {
      // Revert the UI on failure
      setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: originalStatus } : b));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  };

  if (bookings.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No upcoming bookings.</p>;
  }

  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
            <Link href={`/listing/${booking.vehicle.id}`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={booking.renter.avatarUrl} alt={booking.renter.name} />
                <AvatarFallback>{booking.renter.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-grow">
              <p className="font-semibold">{booking.renter.name}</p>
              <p className="text-sm text-muted-foreground">
                <Link href={`/listing/${booking.vehicle.id}`} className="hover:underline">{booking.vehicle.name}</Link>
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d')}
              </p>
            </div>
             {booking.status === 'pending' ? (
                <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200" onClick={() => handleBookingAction(booking, 'confirmed')}>
                        <Check className="h-4 w-4" />
                    </Button>
                     <Button size="icon" variant="outline" className="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200" onClick={() => handleBookingAction(booking, 'declined')}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <Badge 
                    variant={booking.status === 'confirmed' ? 'default' : booking.status === 'declined' ? 'destructive' : 'secondary'} 
                    className={cn("capitalize", booking.status === 'confirmed' && 'bg-green-600')}
                >
                    {booking.status}
                </Badge>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
