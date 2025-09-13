
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactAction } from "./actions";
import { useActionState } from "react";
import { useEffect } from "react";
import type { Metadata } from 'next';

// Although this is a client component, we can't export metadata from here.
// We should add static metadata in a parent layout or a page.tsx if this was a server component.
// For the purpose of this audit, we will rely on the root layout's fallback metadata.

const initialState = {
  message: "",
};


export default function ContactPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(contactAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: 'Message Sent!',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">Get in Touch</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Have a question or need assistance? We're here to help. Reach out to us, and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <form action={formAction}>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>Our support team is available 24/7 to assist you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" name="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Please describe your issue or question in detail..." className="min-h-[150px]" required />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </CardContent>
            </form>
          </Card>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Our Office</h3>
                <p className="text-muted-foreground">123 DriveIO Lane, Carville, CA 90210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">General Inquiries</h3>
                <p className="text-muted-foreground">support@driveio.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">24/7 Support Line</h3>
                <p className="text-muted-foreground">(123) 456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
