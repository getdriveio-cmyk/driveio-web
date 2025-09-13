
'use server';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { AuthUser } from '@/lib/store';
import { getUserByEmail } from '@/lib/firestore';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch user profile from Firestore to get roles
    const userProfile = await getUserByEmail(user.email!);

    if (!userProfile) {
      // This case should ideally not happen if signup guarantees a profile.
      return {
        success: false,
        error: "Could not find a user profile for this account.",
      };
    }

    const authUser: AuthUser = {
      id: userProfile.id,
      email: user.email!,
      name: user.displayName || userProfile.name || 'User',
      avatarUrl: user.photoURL || userProfile.avatarUrl || `https://picsum.photos/seed/${user.email}/40/40`,
      isHost: userProfile.isHost || false,
      isAdmin: userProfile.isAdmin || false,
    };
    
    return {
      success: true,
      message: `Successfully logged in as ${user.email}. Welcome back!`,
      user: authUser
    };
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred.';
    switch (error.code) {
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password. Please try again.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      default:
        console.error('Firebase Login Error:', error);
        errorMessage = 'Failed to log in. Please try again later.';
        break;
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
}
