
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { getBookingsAdmin } from '@/lib/firestore-admin';

export default async function AdminBookingsPage() {
  const bookings = await getBookingsAdmin(200);

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'default';
    case 'Completed':
      return 'secondary';
    case 'Cancelled':
      return 'destructive';
    case 'Pending':
      return 'outline';
    default:
      return 'secondary';
  }
};

  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-bold font-headline">Booking Management</h1>
            <p className="text-muted-foreground">
                Oversee and manage all bookings on the DriveIO platform.
            </p>
        </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Renter</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Trip Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(booking => (
                <TableRow key={booking.id}>
                   <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={booking.renter?.avatarUrl} alt={booking.renter?.name} />
                        <AvatarFallback>{(booking.renter?.name || '?').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{booking.renter?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{booking.vehicle?.make} {booking.vehicle?.model}</TableCell>
                  <TableCell>
                    {format(new Date(booking.startDate), 'MMM d, yyyy')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">{booking.status}</Badge>
                  </TableCell>
                  <TableCell>${booking.total?.toLocaleString?.() || booking.total}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button variant="destructive" size="sm">Cancel</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
