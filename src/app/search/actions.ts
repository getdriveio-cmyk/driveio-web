
'use server';

import { getVehicles } from '@/lib/firestore';
import type { Vehicle } from '@/lib/types';
import { z } from 'zod';

const FilterSchema = z.object({
  type: z.string().optional(),
  maxPrice: z.number().optional(),
  features: z.array(z.string()).optional(),
  minRating: z.number().optional(),
  location: z.string().optional(),
});

export async function getFilteredVehiclesAction(filters: z.infer<typeof FilterSchema>): Promise<Vehicle[]> {
  const parsedFilters = FilterSchema.safeParse(filters);
  
  if (!parsedFilters.success) {
    console.error('Invalid filter shape provided to server action.');
    return [];
  }
  
  try {
    const vehicles = await getVehicles(undefined, parsedFilters.data);
    return vehicles;
  } catch (error) {
    console.error('Error fetching filtered vehicles:', error);
    // In a real app, you might want to return an error object
    return [];
  }
}
