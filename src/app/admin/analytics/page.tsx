
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/admin/data-card";
import ChartCard from "@/components/admin/chart-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Car, CalendarDays, Users, Download } from "lucide-react";

import { getBookingsAdmin, getUsersAdmin, getVehiclesAdmin } from '@/lib/firestore-admin';

export default async function AdminAnalyticsPage() {
  const [bookings, users, vehicles] = await Promise.all([
    getBookingsAdmin(200),
    getUsersAdmin(),
    getVehiclesAdmin(),
  ]);
  const revenue = bookings.reduce((sum, b: any) => sum + (Number(b.total) || 0), 0);
  const topVehicles = Object.values(
    bookings.reduce((acc: any, b: any) => {
      const key = b.vehicle?.id || 'unknown';
      if (!acc[key]) acc[key] = { name: `${b.vehicle?.make || ''} ${b.vehicle?.model || ''}`.trim(), rentals: 0, revenue: 0 };
      acc[key].rentals += 1;
      acc[key].revenue += Number(b.total) || 0;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 5) as any[];
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Reporting & Analytics</h1>
            <p className="text-muted-foreground">Key insights and performance metrics for your platform.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DataCard 
                title="Total Revenue"
                value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(revenue)}
                icon={<DollarSign />}
                description="+20.1% from last month"
            />
             <DataCard 
                title="Total Rentals"
                value={String(bookings.length)}
                icon={<Car />}
                description="+15.2% from last month"
            />
             <DataCard 
                title="Avg. Rental Duration"
                value={(() => {
                  const days = bookings.reduce((sum: number, b: any) => {
                    const s = new Date(b.startDate).getTime();
                    const e = new Date(b.endDate).getTime();
                    return sum + Math.max(0, (e - s) / (1000*60*60*24));
                  }, 0);
                  return `${(days / Math.max(1, bookings.length)).toFixed(1)} Days`;
                })()}
                icon={<CalendarDays />}
                description="-0.5 days from last month"
            />
             <DataCard 
                title="Users"
                value={String(users.length)}
                icon={<Users />}
                description="+30% from last month"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <ChartCard />
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Vehicles</CardTitle>
                        <CardDescription>By revenue generated this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topVehicles.map((vehicle: any) => (
                                    <TableRow key={vehicle.name}>
                                        <TableCell className="font-medium">{vehicle.name}</TableCell>
                                        <TableCell className="text-right">${vehicle.revenue.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>Generate and export custom reports for your business needs.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    {/* In a real app, these would be interactive selects/date pickers */}
                    <p className="text-sm font-medium">Select Report Type:</p>
                    <Button variant="outline">Revenue Report</Button>
                    <Button variant="outline">Fleet Utilization</Button>
                    <p className="text-sm font-medium">Date Range:</p>
                    <Button variant="outline">Last 30 Days</Button>
                    <Button className="ml-auto"><Download className="mr-2" /> Export CSV</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
