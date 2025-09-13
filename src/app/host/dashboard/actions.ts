
'use server';

import { revalidatePath } from 'next/cache';
import { getBooking, updateBookingStatus } from '@/lib/firestore';
import { auth } from '@/lib/firebase/server';

export async function updateBookingStatusAction(bookingId: string, newStatus: 'confirmed' | 'declined') {
  const { user } = await auth();

  if (!user) {
    return {
      success: false,
      message: 'Unauthorized: You must be logged in.',
    };
  }
  
  if (!bookingId) {
     return {
      success: false,
      message: 'Booking ID is missing.',
    };
  }

  try {
    const booking = await getBooking(bookingId);

    if (!booking) {
        return { success: false, message: 'Booking not found.' };
    }

    // Security check: ensure the logged-in user is the host of the vehicle in the booking
    if (booking.vehicle.host.id !== user.uid) {
        return { success: false, message: 'Unauthorized: You are not the host for this booking.' };
    }

    await updateBookingStatus(bookingId, newStatus);
    
    revalidatePath('/host/dashboard');
    
    return {
      success: true,
      message: `Booking has been successfully ${newStatus}.`,
    };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return {
      success: false,
      message: 'There was an error updating the booking. Please try again.',
    };
  }
}
