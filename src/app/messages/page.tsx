
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy, limit, doc } from 'firebase/firestore';

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

  // Subscribe to user threads
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [compose, setCompose] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    const threadsRef = collection(db, 'threads');
    const qThreads = query(threadsRef, where('participants', 'array-contains', user.id), orderBy('updatedAt', 'desc'), limit(50));
    const unsub = onSnapshot(qThreads, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setThreads(items);
      if (!activeThreadId && items.length) setActiveThreadId(items[0].id);
    });
    return () => unsub();
  }, [user?.id, activeThreadId]);

  useEffect(() => {
    if (!activeThreadId) return;
    const msgsRef = collection(db, 'threads', activeThreadId, 'messages');
    const qMsgs = query(msgsRef, orderBy('createdAt', 'asc'), limit(200));
    const unsub = onSnapshot(qMsgs, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, [activeThreadId]);

  const sendMessage = async () => {
    if (!compose.trim() || !activeThreadId || !user?.id) return;
    const msgsRef = collection(db, 'threads', activeThreadId, 'messages');
    await addDoc(msgsRef, {
      senderId: user.id,
      text: compose.trim(),
      createdAt: serverTimestamp(),
    });
    // touch thread updatedAt
    await addDoc(collection(db, 'threads', activeThreadId, 'touch')), // no-op collection to avoid rules write; optional
    setCompose('');
    inputRef.current?.focus();
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex">
      <Card className="w-1/3 h-full flex flex-col">
        <CardHeader>
          <Input placeholder="Search messages..." />
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent>
            <div className="space-y-2">
              {threads.map((t) => (
                <div key={t.id} onClick={() => setActiveThreadId(t.id)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${activeThreadId === t.id ? 'bg-secondary' : 'hover:bg-secondary'}`}>
                  <Avatar>
                    <AvatarImage src={t.otherAvatar || 'https://picsum.photos/seed/thread/40/40'} />
                    <AvatarFallback>{(t.otherName || '?').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-semibold">{t.otherName || 'Conversation'}</p>
                    <p className="text-sm text-muted-foreground truncate">{t.lastMessage || ''}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.updatedAt?.toDate?.() ? new Date(t.updatedAt.toDate()).toLocaleTimeString() : ''}</span>
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
                <AvatarImage src={threads.find(t => t.id === activeThreadId)?.otherAvatar || ''} />
                <AvatarFallback>{(threads.find(t => t.id === activeThreadId)?.otherName || '?').charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">{threads.find(t => t.id === activeThreadId)?.otherName || 'Select a conversation'}</p>
                <p className="text-sm text-muted-foreground">&nbsp;</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6 space-y-4 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'} p-3 rounded-lg max-w-md`}>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t">
            <div className="relative">
              <Input ref={inputRef} value={compose} onChange={(e) => setCompose(e.target.value)} placeholder="Type a message..." className="pr-12" />
              <Button onClick={sendMessage} size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
