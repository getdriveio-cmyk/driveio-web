
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GoogleIcon, AppleIcon } from '@/components/social-icons';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useRef, useState } from 'react';
import { createSessionFromIdToken } from '../login/actions';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { AuthUser } from '@/lib/store';
import { getUserByEmail, addUser } from '@/lib/firestore';
import type { User } from '@/lib/types';

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? 'Creating Account...' : 'Create Account'}
    </Button>
  );
}

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const login = useAuth.getState().login;
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const isHost = formData.get('isHost') === 'on';

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, { displayName: name });
      
      // Create server session
      const idToken = await user.getIdToken(true);
      const sessionResult = await createSessionFromIdToken(idToken);
      
      if (!sessionResult.success) {
        console.warn('Failed to create server session');
      }
      
      // Create user profile in Firestore
      const newUser: User = {
        id: user.uid,
        email: user.email!,
        name: name,
        avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.email}/40/40`,
        isHost: isHost,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await addUser(newUser);

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatarUrl: newUser.avatarUrl,
        isHost: newUser.isHost,
        isAdmin: newUser.isAdmin,
      };

      login(authUser);
      toast({
        title: 'Account Created!',
        description: `Welcome to DriveIO, ${authUser.name}!`,
      });
      formRef.current?.reset();
      
      if (authUser.isHost) {
        router.push('/host/listings/start');
      } else {
        router.push('/profile');
      }
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          console.error('Firebase Signup Error:', error);
          errorMessage = 'Failed to create account. Please try again later.';
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'apple') => {
    try {
      let provider;
      if (providerName === 'google') {
        provider = new GoogleAuthProvider();
      } else {
        toast({ variant: 'destructive', title: 'Apple Login Not Implemented' });
        return;
      }
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (!firebaseUser.email) {
          throw new Error("No email returned from social provider.");
      }
      
      let userProfile = await getUserByEmail(firebaseUser.email);
      
      // If user profile doesn't exist, create it
      if (!userProfile) {
        // Admin status should be explicitly set in the database, not inferred from email on signup.
        const isAdmin = false; 
        const newUser: Omit<User, 'id'> = {
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email,
          avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.email}/40/40`,
          isHost: false, // Default for new social signups
          isAdmin: isAdmin,
          isVerified: false,
          joinedDate: new Date().toISOString(),
        };
        await addUser(firebaseUser.uid, newUser);
        userProfile = { ...newUser, id: firebaseUser.uid };
      }
      
      const authUser: AuthUser = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        avatarUrl: userProfile.avatarUrl,
        isHost: userProfile.isHost || false,
        isAdmin: userProfile.isAdmin || false,
      };

      login(authUser);
      toast({
        title: 'Logged In!',
        description: `Welcome, ${authUser.name}!`,
      });
      router.push('/profile');

    } catch (error: any) {
      console.error('Social Login Error:', error);
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'An unexpected error occurred during social signup.' });
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join DriveIO to start your journey. You will be logged in automatically after signing up.</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleEmailSignup} className="grid gap-4">
             {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Signup Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <div className="flex items-center space-x-2">
                <Checkbox id="isHost" name="isHost" />
                <Label htmlFor="isHost" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I also want to list my car as a host
                </Label>
            </div>

            <SubmitButton loading={loading} />
          </form>
            
          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleSocialLogin('google')}><GoogleIcon /> <span className="ml-2">Google</span></Button>
              <Button variant="outline" onClick={() => handleSocialLogin('apple')}><AppleIcon /> <span className="ml-2">Apple</span></Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
