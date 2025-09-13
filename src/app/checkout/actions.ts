
'use server';

import Stripe from 'stripe';
import { getVehicle, addBooking } from '@/lib/firestore';
import { differenceInDays } from 'date-fns';
import { auth } from '@/lib/firebase/server';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const CreatePaymentIntentInputSchema = z.object({
  vehicleId: z.string(),
  fromDate: z.string().datetime(),
  toDate: z.string().datetime(),
});

/**
 * Creates a Stripe Payment Intent and a corresponding 'pending' booking in Firestore.
 * The total amount is calculated on the server to prevent tampering.
 */
export async function createAuthenticatedPaymentIntent(input: z.infer<typeof CreatePaymentIntentInputSchema>) {
  const { user } = await auth();
  if (!user) {
    return { error: 'You must be logged in to make a payment.' };
  }
  
  const parsed = CreatePaymentIntentInputSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'Invalid input.' };
  }
  
  const { vehicleId, fromDate, toDate } = parsed.data;

  try {
    const vehicle = await getVehicle(vehicleId);
    if (!vehicle) {
      return { error: 'Vehicle not found.' };
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const numberOfDays = differenceInDays(to, from);
    if (numberOfDays < 1) {
        return { error: 'Invalid date range. Minimum booking is 1 day.' };
    }

    const priceForDays = numberOfDays * vehicle.pricePerDay;
    const serviceFee = 50; // In a real app, this might be dynamic
    // In a real app, insurance cost would also be calculated here based on user selection
    const total = priceForDays + serviceFee; 

    if (total <= 0) {
        return { error: 'Invalid total amount.' };
    }

    // Create a pending booking record in Firestore first
    const bookingId = await addBooking({
        vehicle,
        renter: {
            id: user.uid,
            name: user.displayName || 'Unknown User',
            email: user.email || 'No email',
        },
        startDate: from.toISOString(),
        endDate: to.toISOString(),
        total,
        status: 'pending',
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user.uid,
        vehicleId,
        startDate: fromDate,
        endDate: toDate,
        bookingId: bookingId, // Link booking to payment intent
      }
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { error: `Failed to create PaymentIntent: ${errorMessage}` };
  }
}
