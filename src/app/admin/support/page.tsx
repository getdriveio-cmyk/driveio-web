
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const tickets = [
    {
        id: 'ticket1',
        user: { name: 'Alice Smith', avatar: 'https://picsum.photos/seed/renter1/40/40' },
        subject: 'Issue with booking #4521',
        status: 'Open',
    },
    {
        id: 'ticket2',
        user: { name: 'Marcus Thorne', avatar: 'https://picsum.photos/seed/host2/40/40' },
        subject: 'Payment dispute for trip #4519',
        status: 'Open',
    },
    {
        id: 'ticket3',
        user: { name: 'Eleanor Vance', avatar: 'https://picsum.photos/seed/host1/40/40' },
        subject: 'How to update my listing photos?',
        status: 'Closed',
    }
];

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-bold font-headline">Support Tickets</h1>
            <p className="text-muted-foreground">Review and respond to user support tickets.</p>
        </div>
        <div className="space-y-4">
            {tickets.map(ticket => (
                <Card key={ticket.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={ticket.user.avatar} alt={ticket.user.name} />
                                <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{ticket.subject}</p>
                                <p className="text-sm text-muted-foreground">From: {ticket.user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant={ticket.status === 'Open' ? 'default' : 'outline'}>{ticket.status}</Badge>
                            <Button size="sm">View Ticket</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
