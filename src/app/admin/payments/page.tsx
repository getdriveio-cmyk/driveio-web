
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Download } from "lucide-react";

const transactions = [
  {
    id: 'txn_1',
    user: 'Eleanor Vance (Host)',
    date: new Date(2024, 6, 25),
    type: 'Payout',
    status: 'Completed',
    amount: 576,
  },
  {
    id: 'txn_2',
    user: 'Alice Smith (Renter)',
    date: new Date(2024, 6, 25),
    type: 'Platform Fee',
    status: 'Completed',
    amount: 144,
  },
  {
    id: 'txn_3',
    user: 'Charlie Brown (Renter)',
    date: new Date(2024, 6, 24),
    type: 'Refund',
    status: 'Completed',
    amount: -900,
  },
  {
    id: 'txn_4',
    user: 'Marcus Thorne (Host)',
    date: new Date(2024, 6, 22),
    type: 'Payout',
    status: 'Pending',
    amount: 360,
  },
];

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case 'Payout':
      return 'secondary';
    case 'Platform Fee':
      return 'outline';
    case 'Refund':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Pending':
      return 'outline';
    case 'Failed':
      return 'destructive';
    default:
      return 'secondary';
  }
};


export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Payments & Transactions</h1>
          <p className="text-muted-foreground">
              Review and manage all financial transactions on the platform.
          </p>
        </div>
        <Button variant="outline"><Download className="mr-2" /> Export CSV</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(txn => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.user}</TableCell>
                  <TableCell>{format(txn.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(txn.type)}>{txn.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(txn.status)}>{txn.status}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${txn.amount < 0 ? 'text-destructive' : ''}`}>
                    {txn.amount < 0 ? `-$${Math.abs(txn.amount)}` : `$${txn.amount}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Details</Button>
                      {txn.type === 'Payout' && txn.status === 'Pending' && <Button size="sm">Hold</Button>}
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
