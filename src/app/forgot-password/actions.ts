'use server';

import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
     // Return the generic success message even if the email is missing
     // to avoid revealing any information about the system's state.
    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  try {
    // We attempt to send the email regardless of format. Firebase will handle invalid formats,
    // but we will not expose that error to the client.
    await sendPasswordResetEmail(auth, email);
    
    // Always return a generic success message to prevent user enumeration.
    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  } catch (error: any) {
    // We catch all errors from Firebase (e.g., invalid email, user not found)
    // but still return the same generic success message to the client.
    // The actual error can be logged on the server for debugging if needed.
    console.error('Forgot Password Attempt Error (not shown to user):', error.code);
    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }
}
