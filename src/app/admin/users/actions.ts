'use server';

import { revalidatePath } from 'next/cache';
import { banUser, getHost } from '@/lib/firestore';
import { auth } from '@/lib/firebase/server';
import { getAuth } from 'firebase-admin/auth';

export async function banUserAction(userId: string, isBanned: boolean) {
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
      message: 'Unauthorized: You do not have permission to perform this action.',
    };
  }
  
  if (!userId) {
     return {
      success: false,
      message: 'User ID is missing.',
    };
  }

  // Security enhancement: Prevent an admin from banning themselves
  if (user.uid === userId) {
    return {
      success: false,
      message: 'You cannot ban your own account.',
    };
  }

  try {
    // Also update the user's disabled status in Firebase Auth
    await getAuth().updateUser(userId, { disabled: isBanned });
    await banUser(userId, isBanned);
    revalidatePath('/admin/users');
    return {
      success: true,
      message: `User has been successfully ${isBanned ? 'banned' : 'unbanned'}.`,
    };
  } catch (error) {
    console.error('Error updating user ban status:', error);
    return {
      success: false,
      message: 'There was an error updating the user. Please try again.',
    };
  }
}
