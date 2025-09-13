
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { insurancePlans } from '@/lib/mock-data';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { differenceInDays, format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Shield, ShieldCheck, ShieldPlus } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { InsurancePlan, Vehicle } from '@/lib/types';
import { cn } from '@/lib/utils';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createAuthenticatedPaymentIntent } from '@/app/checkout/actions';
import CheckoutForm from '@/components/checkout-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const planIcons: { [key: string]: React.ReactNode } = {
  'Minimum': <Shield className="w-8 h-8 text-primary" />,
  'Standard': <ShieldCheck className="w-8 h-8 text-primary" />,
  'Premium': <ShieldPlus className="w-8 h-8 text-primary" />,
}

interface CheckoutClientProps {
    vehicle: Vehicle;
    fromDate: string;
    toDate: string;
}

export default function CheckoutClient({ vehicle, fromDate, toDate }: CheckoutClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan>(insurancePlans[1]); // Default to Standard
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingSecret, setLoadingSecret] = useState(true);
  const [idempotencyKey] = useState<string>(() => {
    try {
      // Prefer stable key per mount to prevent duplicate intents
      // crypto.randomUUID is widely supported
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return crypto.randomUUID();
      }
    } catch {}
    return `${vehicle.id}-${fromDate}-${toDate}-${Date.now()}`;
  });
  
  const from = new Date(fromDate);
  const to = new Date(toDate);

  const numberOfDays = differenceInDays(to, from);
  const priceForDays = numberOfDays > 0 ? numberOfDays * vehicle.pricePerDay : 0;
  const serviceFee = 50;
  const insuranceCost = numberOfDays > 0 ? numberOfDays * selectedPlan.pricePerDay : 0;
  const total = priceForDays > 0 ? priceForDays + serviceFee + insuranceCost : 0;

  useEffect(() => {
    setLoadingSecret(true);
    createAuthenticatedPaymentIntent({
      vehicleId: vehicle.id,
      fromDate: from.toISOString(),
      toDate: to.toISOString(),
    }, idempotencyKey).then(res => {
        if (res.clientSecret) {
          setClientSecret(res.clientSecret);
        } else if (res.error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: res.error,
            });
        }
    }).finally(() => {
        setLoadingSecret(false);
    });
  }, [vehicle.id, fromDate, toDate, total, toast, idempotencyKey]);
  
  const handleSuccess = () => {
    const confirmationUrl = `/booking/confirmed?vehicleId=${vehicle.id}&from=${fromDate}&to=${toDate}`;
    router.push(confirmationUrl);
  };

  const PriceSummaryCard = () => (
    <Card>
      <CardContent className="p-4 flex gap-4">
          <div className="relative w-32 h-24 rounded-md overflow-hidden">
          <Image src={vehicle.images[0]} alt={vehicle.name} fill className="object-cover" data-ai-hint={`${vehicle.make} ${vehicle.model}`} />
          </div>
          <div>
          <h3 className="font-bold font-headline">{vehicle.name}</h3>
          <p className="text-sm text-muted-foreground">{vehicle.location}</p>
          </div>
      </CardContent>
      <Separator />
      <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-bold font-headline">Price details</h3>
          <div className="flex justify-between">
              <span>${vehicle.pricePerDay.toLocaleString()} x {numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span> 
              <span>${priceForDays.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
              <span>Protection plan ({selectedPlan.name})</span> 
              <span>${insuranceCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
              <span>Service fee</span> 
              <span>${serviceFee.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
              <span>Total</span> 
              <span>${total.toLocaleString()}</span>
          </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-8">Confirm and pay</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <div className="lg:hidden">
              <PriceSummaryCard />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your trip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Dates</p>
                    <p className="text-muted-foreground">{format(from, "MMM d, yyyy")} - {format(to, "MMM d, yyyy")}</p>
                  </div>
                  <Button variant="link" asChild>
                    <Link href={`/listing/${vehicle.id}`}>Edit</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Choose your protection plan</CardTitle>
                <CardDescription>All plans include 24/7 roadside assistance.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPlan.id} onValueChange={(id) => setSelectedPlan(insurancePlans.find(p => p.id === id)!)} className="grid grid-cols-1 gap-4">
                  {insurancePlans.map(plan => (
                    <Label key={plan.id} htmlFor={plan.id}>
                      <Card className={cn(
                        "p-4 cursor-pointer hover:border-primary",
                        selectedPlan.id === plan.id && 'border-primary ring-2 ring-primary'
                      )}>
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {planIcons[plan.name]}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-lg">{plan.name}</span>
                              <RadioGroupItem value={plan.id} id={plan.id} />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${plan.pricePerDay}</p>
                            <p className="text-sm text-muted-foreground">/day</p>
                          </div>
                        </div>
                      </Card>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {clientSecret ? (
              <Elements options={{ clientSecret }} stripe={stripePromise}>
                <CheckoutForm onSuccess={handleSuccess} />
              </Elements>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Pay with Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingSecret ? <p>Loading payment form...</p> : <p>Could not initialize payment form. Please try again.</p>}
                    </CardContent>
                </Card>
            )}
        </div>
        
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24">
             <PriceSummaryCard />
          </div>
        </aside>
      </div>
    </div>
  );
}
