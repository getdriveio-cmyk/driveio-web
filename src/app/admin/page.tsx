
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Car, Clock, UserPlus, FileCheck, DollarSign, ArrowRight, BookOpenCheck } from "lucide-react";
import Link from "next/link";
import DataCard from "@/components/admin/data-card";
import ChartCard from "@/components/admin/chart-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recentActivities = [
  {
    type: 'New Booking',
    user: { name: 'Alice Smith', avatar: 'https://picsum.photos/seed/renter1/40/40' },
    details: 'booked the Tesla Model 3',
    time: '2m ago'
  },
  {
    type: 'New User',
    user: { name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/renter3/40/40' },
    details: 'joined as a Renter',
    time: '15m ago'
  },
  {
    type: 'Listing Pending',
    user: { name: 'Marcus Thorne', avatar: 'https://picsum.photos/seed/host2/40/40' },
    details: 'submitted a new listing for a Ford F-150',
    time: '1h ago'
  }
];


export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin. Here's an overview of your platform.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DataCard 
                title="Total Revenue"
                value="$52,341.89"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                description="+20.1% from last month"
            />
             <DataCard 
                title="Active Rentals"
                value="72"
                icon={<Car className="h-4 w-4 text-muted-foreground" />}
                description="12 starting today"
            />
             <DataCard 
                title="Pending Approvals"
                value="3"
                icon={<FileCheck className="h-4 w-4 text-muted-foreground" />}
                description="2 listings, 1 host"
            />
             <DataCard 
                title="New Users"
                value="+18"
                icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
                description="in the last 24 hours"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ChartCard />
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-start" asChild><Link href="/admin/users"><Users />Manage Users</Link></Button>
                        <Button className="w-full justify-start" asChild><Link href="/admin/bookings"><BookOpenCheck />Manage Bookings</Link></Button>
                        <Button className="w-full justify-start" asChild><Link href="/admin/fleet"><Clock />Review Pending Listings</Link></Button>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A live feed of recent events on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableBody>
                        {recentActivities.map((activity, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p><span className="font-medium">{activity.user.name}</span> {activity.details}</p>
                                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                                </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant={activity.type === 'New User' ? 'secondary' : 'default'}>{activity.type}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
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
