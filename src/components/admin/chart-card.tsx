
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", rentals: 65, revenue: 4200 },
  { name: "Feb", rentals: 59, revenue: 3900 },
  { name: "Mar", rentals: 80, revenue: 5800 },
  { name: "Apr", rentals: 81, revenue: 6100 },
  { name: "May", rentals: 56, revenue: 4600 },
  { name: "Jun", rentals: 55, revenue: 4500 },
  { name: "Jul", rentals: 40, revenue: 3000 },
];

export default function ChartCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Rentals Overview</CardTitle>
                <CardDescription>A summary of rentals and revenue over the last 7 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
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
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{ 
                                background: 'hsl(var(--background))', 
                                border: '1px solid hsl(var(--border))'
                            }}
                        />
                        <Bar dataKey="rentals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
