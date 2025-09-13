
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export default function MessagesPage() {
  const { isLoggedIn, isHydrating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrating && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, isHydrating, router]);

  if (isHydrating || !isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex">
      <Card className="w-1/3 h-full flex flex-col">
        <CardHeader>
          <Input placeholder="Search messages..." />
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent>
            <div className="space-y-2">
              {['Eleanor Vance', 'Marcus Thorne', 'Support Team'].map((name, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${i === 0 ? 'bg-secondary' : 'hover:bg-secondary'}`}>
                  <Avatar>
                    <AvatarImage src={`https://picsum.photos/seed/msg${i}/40/40`} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground truncate">{i === 0 ? 'Sounds good, see you then!' : 'Can you confirm availability for...'}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">3:45 PM</span>
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
      <div className="w-2/3 h-full flex flex-col pl-4">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/msg0/40/40" />
                <AvatarFallback>EV</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">Eleanor Vance</p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6 space-y-4 overflow-y-auto">
            {/* Chat messages */}
            <div className="flex justify-start">
              <div className="bg-secondary p-3 rounded-lg max-w-md">
                <p>Hi there! I'm interested in booking your Tesla for the upcoming weekend. Is it available from Friday to Sunday?</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-md">
                <p>Hi! Yes, it's available. I've just updated the calendar. You can go ahead and book it.</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-secondary p-3 rounded-lg max-w-md">
                <p>Perfect, thanks! Just one more question - what's the charging situation like? Should I return it fully charged?</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-md">
                <p>Please return it with at least 80% charge. There's a supercharger station just a few blocks from the pickup location. Sounds good, see you then!</p>
              </div>
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-12" />
              <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
