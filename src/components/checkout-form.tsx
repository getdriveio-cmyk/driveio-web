
'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage('Payment system not ready. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || 'An unexpected error occurred.');
        } else {
            setMessage("An unexpected error occurred.");
        }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
    }


    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Pay with Card</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement id="payment-element" />
          {message && (
             <Alert variant="destructive" className="mt-4">
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-8" size="lg">
        <span id="button-text">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm and pay"}
        </span>
      </Button>
    </form>
  );
}
