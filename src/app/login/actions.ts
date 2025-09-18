
'use server';

import { getAuth } from 'firebase-admin/auth';
import { app } from '@/lib/firebase/admin-app';
import type { AuthUser } from '@/lib/store';
import { getUserByEmail } from '@/lib/firestore';
import { setSessionCookie } from '@/lib/firebase/server';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required.',
    };
  }

  try {
    // Use Admin SDK to verify credentials
    const userRecord = await getAuth(app).getUserByEmail(email);
    
    // For server-side password verification, we need to use a different approach
    // Since Firebase Admin SDK doesn't verify passwords directly, we'll create a custom token
    // and let the client verify the password, then call createSessionFromIdToken
    
    return {
      success: false,
      error: 'Please use the client-side login form. Server-side password verification requires additional setup.',
    };
  } catch (error: any) {
    let errorMessage = 'Invalid email or password.';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.';
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
