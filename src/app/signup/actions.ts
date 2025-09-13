
'use server';

import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import type { AuthUser } from '@/lib/store';
import { addUser } from '@/lib/firestore';
import type { User } from '@/lib/types';
import { setSessionCookie } from '@/lib/firebase/server';

export async function signupAction(prevState: any, formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const isHost = formData.get('isHost') === 'on';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Establish server-side session
    const idToken = await user.getIdToken(true);
    await setSessionCookie(idToken);

    // Update the user's profile with their full name
    await updateProfile(user, { displayName: fullName });
    
    const isAdmin = email.endsWith('@getdriveio.com');

    // Create a corresponding document in the 'hosts' collection
    const newUser: Omit<User, 'id'> = {
        name: fullName,
        email: email,
        avatarUrl: `https://picsum.photos/seed/${email}/40/40`,
        isHost: isHost,
        isAdmin: isAdmin,
        isVerified: false,
        joinedDate: new Date().toISOString(),
    };
    await addUser(user.uid, newUser);
    
    const authUser: AuthUser = {
      id: user.uid,
      email: user.email!,
      name: fullName,
      avatarUrl: `https://picsum.photos/seed/${user.email}/40/40`,
      isHost: isHost,
      isAdmin: isAdmin,
    };

    return {
      success: true,
      message: `Welcome, ${fullName}! Your account has been created.`,
      user: authUser
    };

  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred.';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email address is already in use by another account.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'The email address is not valid.';
        break;
      case 'auth/weak-password':
        errorMessage = 'The password is too weak. Please use at least 6 characters.';
        break;
      default:
        console.error('Firebase Signup Error:', error);
        errorMessage = 'Failed to create an account. Please try again later.';
        break;
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
}
