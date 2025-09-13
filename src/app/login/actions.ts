
'use server';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { AuthUser } from '@/lib/store';
import { getUserByEmail } from '@/lib/firestore';
import { setSessionCookie, clearSessionCookie } from '@/lib/firebase/server';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Create a server-side session cookie so server actions can authenticate
    const idToken = await user.getIdToken(true);
    await setSessionCookie(idToken);
    
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

// Allows client-side social login flows to establish a server session
export async function createSessionFromIdToken(idToken: string) {
  'use server';
  if (!idToken) {
    return { success: false, error: 'Missing idToken' };
  }
  try {
    await setSessionCookie(idToken);
    return { success: true };
  } catch (error) {
    console.error('Error creating session from ID token:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

export async function logoutAction() {
  'use server';
  try {
    clearSessionCookie();
    return { success: true };
  } catch (error) {
    console.error('Error clearing session cookie:', error);
    return { success: false };
  }
}
