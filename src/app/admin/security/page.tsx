
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ShieldAlert } from "lucide-react";

const suspiciousActivities = [
  {
    id: 'act_1',
    type: 'Multiple Failed Logins',
    user: 'user@suspicious.com',
    timestamp: new Date(),
    riskLevel: 'High',
  },
  {
    id: 'act_2',
    type: 'Unusual Booking Location',
    user: 'alice@example.com',
    timestamp: new Date(Date.now() - 3600 * 1000),
    riskLevel: 'Medium',
  },
];

const auditLogs = [
    {
        id: 'log_1',
        admin: 'admin@driveio.com',
        action: 'Banned user: charlie@example.com',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000),
    },
    {
        id: 'log_2',
        admin: 'admin@driveio.com',
        action: 'Approved listing: Porsche 911 Carrera',
        timestamp: new Date(Date.now() - 5 * 3600 * 1000),
    }
];

const getRiskBadgeVariant = (level: string) => {
    switch (level) {
        case 'High': return 'destructive';
        case 'Medium': return 'secondary';
        case 'Low': return 'outline';
        default: return 'secondary';
    }
};

export default function AdminSecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><ShieldAlert /> Security & Fraud Prevention</h1>
        <p className="text-muted-foreground">Monitor suspicious activities and review administrator audit logs.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Activity</CardTitle>
          <CardDescription>
            A feed of potentially fraudulent or suspicious activities detected on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suspiciousActivities.map(activity => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.type}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{format(activity.timestamp, 'MMM d, yyyy, h:mm a')}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(activity.riskLevel)}>{activity.riskLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="destructive" size="sm">Flag User</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Admin Audit Log</CardTitle>
          <CardDescription>
            A log of all administrative actions taken on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.admin}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{format(log.timestamp, 'MMM d, yyyy, h:mm a')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
