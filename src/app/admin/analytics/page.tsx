
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/admin/data-card";
import ChartCard from "@/components/admin/chart-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Car, CalendarDays, Users, Download } from "lucide-react";

const topVehicles = [
    { name: 'Porsche 911 Carrera', rentals: 25, revenue: 11250 },
    { name: 'Tesla Model 3', rentals: 30, revenue: 9000 },
    { name: 'Ford Bronco', rentals: 22, revenue: 8250 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Reporting & Analytics</h1>
            <p className="text-muted-foreground">Key insights and performance metrics for your platform.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DataCard 
                title="Total Revenue"
                value="$52,341.89"
                icon={<DollarSign />}
                description="+20.1% from last month"
            />
             <DataCard 
                title="Total Rentals"
                value="215"
                icon={<Car />}
                description="+15.2% from last month"
            />
             <DataCard 
                title="Avg. Rental Duration"
                value="3.2 Days"
                icon={<CalendarDays />}
                description="-0.5 days from last month"
            />
             <DataCard 
                title="New Users"
                value="+122"
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
                                {topVehicles.map((vehicle) => (
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
