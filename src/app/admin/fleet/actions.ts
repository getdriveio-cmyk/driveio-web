'use server';

import { revalidatePath } from 'next/cache';
import { deleteVehicle, getHost } from '@/lib/firestore';
import { auth } from '@/lib/firebase/server';

export async function deleteVehicleAction(vehicleId: string) {
  const { user } = await auth();

  if (!user) {
    return {
      success: false,
      message: 'Unauthorized: You must be logged in.',
    };
  }
  
  const userProfile = await getHost(user.uid);
  if (!userProfile?.isAdmin) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to delete this listing.',
    };
  }
  
  if (!vehicleId) {
     return {
      success: false,
      message: 'Vehicle ID is missing.',
    };
  }

  try {
    await deleteVehicle(vehicleId);
    revalidatePath('/admin/fleet');
    return {
      success: true,
      message: 'Vehicle has been successfully deleted.',
    };
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return {
      success: false,
      message: 'There was an error deleting the listing. Please try again.',
    };
  }
}
