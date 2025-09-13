
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, PlusCircle } from "lucide-react";
import { format } from 'date-fns';

const transactions = [
  {
    id: 'txn_1',
    date: new Date(2024, 6, 25),
    description: 'Rental: Tesla Model 3',
    amount: -720,
  },
    {
    id: 'txn_2',
    date: new Date(2024, 6, 24),
    description: 'Refund: Booking #4521',
    amount: 900,
  },
  {
    id: 'txn_3',
    date: new Date(2024, 5, 18),
    description: 'Rental: Ford Bronco',
    amount: -450,
  },
];


export default function PaymentsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Card className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <CreditCard className="w-8 h-8 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Visa ending in 1234</p>
                                <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Remove</Button>
                    </Card>
                     <Button variant="outline">
                        <PlusCircle className="mr-2" />
                        Add Payment Method
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View your past payments and refunds.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(txn => (
                                <TableRow key={txn.id}>
                                    <TableCell>{format(txn.date, 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        {txn.description}
                                        {txn.amount > 0 && <Badge variant="secondary" className="ml-2">Refund</Badge>}
                                    </TableCell>
                                    <TableCell className={`text-right font-semibold ${txn.amount < 0 ? '' : 'text-green-600'}`}>
                                        {txn.amount < 0 ? `-$${Math.abs(txn.amount)}` : `+$${txn.amount}`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle>Promo Codes & Credits</CardTitle>
                    <CardDescription>Apply a promo code to get a discount on your next trip.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="text" placeholder="Enter promo code" />
                        <Button type="submit">Apply</Button>
                    </div>
                     <p className="text-sm text-muted-foreground mt-4">Your current account credit: <span className="font-semibold text-primary">$0.00</span></p>
                </CardContent>
            </Card>
        </div>
    );
}
