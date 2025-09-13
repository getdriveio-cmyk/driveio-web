
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Zap, TrendingUp, Shield } from 'lucide-react';

const benefits = [
  {
    icon: <TrendingUp className="w-10 h-10 text-primary" />,
    title: 'Maximize Your Earnings',
    description: 'Turn your car into a source of income. Set your own prices and availability to fit your schedule, and tap into a large network of renters.'
  },
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: 'Complete Peace of Mind',
    description: 'Your car is protected with top-tier insurance coverage and 24/7 roadside assistance for every trip. We also verify all renters for your safety.'
  },
  {
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: 'Effortless to Get Started',
    description: 'Listing your car is simple and free. Our powerful tools make it easy to manage your bookings, pricing, and communication with guests.'
  }
];

export default function BecomeHostPage() {
  return (
    <div className="space-y-20">
      <section className="relative -mx-4 -mt-8 h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/seed/host-hero/1600/900"
          alt="Car owner handing keys over"
          fill
          className="object-cover"
          data-ai-hint="happy car owner"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Share Your Car, Earn Your Way</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Join a community of hosts and turn your car into an earnings engine. DriveIO makes it safe and easy to make money from your underutilized vehicle.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/host/listings/start">Get Started</Link>
          </Button>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold font-headline">Why Host on DriveIO?</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            We provide the tools, support, and security you need to earn with confidence.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {benefits.map((benefit, index) => (
            <Card key={index} className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="p-4 bg-primary/10 rounded-full">
                  {benefit.icon}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold font-headline mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
