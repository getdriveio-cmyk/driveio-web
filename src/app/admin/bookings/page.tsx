
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';

const bookings = [
  {
    id: 'booking1',
    vehicle: { make: 'Tesla', model: 'Model 3' },
    renter: { name: 'Alice Smith', avatar: 'https://picsum.photos/seed/renter1/40/40' },
    startDate: new Date(2024, 6, 20),
    endDate: new Date(2024, 6, 25),
    status: 'Confirmed',
    total: 720,
  },
  {
    id: 'booking2',
    vehicle: { make: 'Ford', model: 'Bronco' },
    renter: { name: 'Bob Johnson', avatar: 'https://picsum.photos/seed/renter2/40/40' },
    startDate: new Date(2024, 5, 15),
    endDate: new Date(2024, 5, 18),
    status: 'Completed',
    total: 450,
  },
  {
    id: 'booking3',
    vehicle: { make: 'Porsche', model: '911 Carrera' },
    renter: { name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/renter3/40/40' },
    startDate: new Date(2024, 6, 22),
    endDate: new Date(2024, 6, 24),
    status: 'Cancelled',
    total: 900,
  },
  {
    id: 'booking4',
    vehicle: { make: 'Jeep', model: 'Wrangler' },
    renter: { name: 'Diana Prince', avatar: 'https://picsum.photos/seed/renter4/40/40' },
    startDate: new Date(2024, 7, 1),
    endDate: new Date(2024, 7, 5),
    status: 'Pending',
    total: 520,
  },
];

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

export default function AdminBookingsPage() {
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
                        <AvatarImage src={booking.renter.avatar} alt={booking.renter.name} />
                        <AvatarFallback>{booking.renter.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{booking.renter.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{booking.vehicle.make} {booking.vehicle.model}</TableCell>
                  <TableCell>
                    {format(booking.startDate, 'MMM d, yyyy')} - {format(booking.endDate, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell>${booking.total}</TableCell>
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
