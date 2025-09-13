
'use server';

import { z } from 'zod';
import { addVehicle, updateVehicle, getHost } from '@/lib/firestore';
import type { Vehicle } from '@/lib/types';
import { auth } from '@/lib/firebase/server';
import { revalidatePath } from 'next/cache';

const listingFormSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.coerce.number().min(2010).max(new Date().getFullYear() + 1),
  location: z.string().min(1, { message: 'Location is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  features: z.string().min(1, { message: 'Please list at least one feature' }),
  price: z.coerce.number().min(1, { message: 'Price must be greater than $0' }),
  cancellationPolicy: z.string().optional(),
  mileagePolicy: z.string().optional(),
  fuelPolicy: z.string().optional(),
  images: z.array(z.string()).min(1, { message: 'Please upload at least one photo.' }),
  vehicleId: z.string().optional(), // For edit mode
});

export async function saveVehicleAction(prevState: any, formData: FormData) {
  const { user } = await auth();

  if (!user) {
    return {
      success: false,
      message: 'You must be logged in to create or update a listing.',
    };
  }

  const rawData = Object.fromEntries(formData.entries());
  // Need to handle images separately as they are stringified
  rawData.images = JSON.parse(rawData.images as string);
  
  const parsed = listingFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your entries.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const host = await getHost(user.uid);
    if (!host) {
      throw new Error('Host profile not found.');
    }

    const vehiclePayload: Omit<Vehicle, 'id' | 'rating' | 'reviewsCount' | 'reviews'> = {
      name: `${data.make} ${data.model}`,
      make: data.make,
      model: data.model,
      year: data.year,
      type: 'sedan', // Placeholder - In a real app, this could be another form field or derived
      pricePerDay: data.price,
      location: data.location,
      features: data.features.split(',').map(f => f.trim()),
      images: data.images,
      host: host,
      description: data.description,
      policies: {
        cancellation: data.cancellationPolicy || '',
        mileage: data.mileagePolicy || '',
        fuel: data.fuelPolicy || '',
      },
    };

    if (data.vehicleId) {
      // Update existing vehicle
      await updateVehicle(data.vehicleId, vehiclePayload);
    } else {
      // Create new vehicle
      await addVehicle(vehiclePayload);
    }

    // Revalidate paths to show new/updated data
    revalidatePath('/host/dashboard');
    revalidatePath('/admin/fleet');
    if (data.vehicleId) {
      revalidatePath(`/listing/${data.vehicleId}`);
    }

    return {
      success: true,
      message: `Vehicle "${data.make} ${data.model}" has been successfully saved.`,
    };

  } catch (error) {
    console.error('Failed to save vehicle:', error);
    return {
      success: false,
      message: 'There was an error saving your listing. Please try again.',
    };
  }
}
