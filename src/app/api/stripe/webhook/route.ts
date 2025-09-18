
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { updateBookingStatus } from '@/lib/firestore';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const buf = await req.text();
  const sig = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ PaymentIntent was successful!');
      
      const bookingId = paymentIntent.metadata.bookingId;
      if (bookingId) {
        try {
          await updateBookingStatus(bookingId, 'confirmed');
          console.log(`✅ Booking ${bookingId} status updated to confirmed.`);
        } catch (error) {
          console.error(`❌ Error updating booking status for ${bookingId}:`, error);
          // Still return 200 to Stripe, but log the error for investigation
        }
      } else {
          console.warn('⚠️ No bookingId found in PaymentIntent metadata.');
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
