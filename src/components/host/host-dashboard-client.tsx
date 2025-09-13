
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, Trash2, DollarSign, BarChart, Star, Edit } from 'lucide-react';
import type { Booking, Vehicle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import BookingList from '@/components/host/booking-list';
import { useAuth } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { deleteVehicle } from '@/lib/firestore';


const earningsData = [
  { month: "Jan", total: Math.floor(Math.random() * 2000) + 500 },
  { month: "Feb", total: Math.floor(Math.random() * 2000) + 500 },
  { month: "Mar", total: Math.floor(Math.random() * 2000) + 500 },
  { month: "Apr", total: Math.floor(Math.random() * 2000) + 500 },
  { month: "May", total: Math.floor(Math.random() * 2000) + 500 },
  { month: "Jun", total: Math.floor(Math.random() * 2000) + 500 },
];

interface HostDashboardClientProps {
    initialListings: Vehicle[];
    initialBookings: Booking[];
}

export default function HostDashboardClient({ initialListings, initialBookings }: HostDashboardClientProps) {
  const { toast } = useToast();
  const [listings, setListings] = useState<Vehicle[]>(initialListings);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Vehicle | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const { isLoggedIn, user, isHydrating } = useAuth.getState();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrating && (!isLoggedIn || !user?.isHost)) {
        router.push('/login');
    }
  }, [isLoggedIn, user, router, isHydrating]);

  const handleDeleteClick = (listing: Vehicle) => {
    setSelectedListing(listing);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedListing) {
      try {
        await deleteVehicle(selectedListing.id);
        setListings(listings.filter(l => l.id !== selectedListing.id));
        toast({
          title: 'Listing Deleted',
          description: `"${selectedListing.name}" has been permanently removed.`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error Deleting Listing',
          description: 'Could not delete the listing. Please try again.',
        });
        console.error('Error deleting vehicle:', error);
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedListing(null);
      }
    }
  };

  if (isHydrating) {
    return <div>Loading dashboard...</div>;
  }
  
  if (!isLoggedIn || !user?.isHost) {
    return null; // Redirecting...
  }


  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-headline">Your Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings and view your performance.</p>
          </div>
          <Button asChild>
            <Link href="/host/listings/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Listing
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234.56</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+72</div>
              <p className="text-xs text-muted-foreground">+12 since last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-muted-foreground">Based on 124 reviews</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Your earnings over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
               <ResponsiveContainer width="100%" height={350}>
                  <RechartsBarChart data={earningsData}>
                    <XAxis
                      dataKey="month"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Your next scheduled trips.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingList bookings={bookings} />
            </CardContent>
          </Card>
        </div>


        <div>
            <h2 className="text-2xl font-bold font-headline mb-4">My Listings</h2>
             {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <Card key={listing.id} className="flex flex-col">
                            <CardHeader className="p-0">
                                <div className="relative aspect-video">
                                    <Image
                                        alt={listing.name}
                                        className="object-cover rounded-t-lg"
                                        src={listing.images[0]}
                                        fill
                                        data-ai-hint={`${listing.make} ${listing.model}`}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                                <h3 className="font-bold text-lg font-headline">{listing.name}</h3>
                                <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                                    <span>${listing.pricePerDay}/day</span>
                                    <Badge variant="secondary">Published</Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <div className="w-full flex gap-2">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/host/listings/${listing.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" className="w-full" onClick={() => handleDeleteClick(listing)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
             ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">You have no listings yet.</p>
                        <Button asChild className="mt-4">
                            <Link href="/host/listings/new">Create your first listing</Link>
                        </Button>
                    </CardContent>
                </Card>
             )}
        </div>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your listing for the "{selectedListing?.name}" and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
