
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GoogleIcon, AppleIcon } from '@/components/social-icons';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, createSessionFromIdToken } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, type User as FirebaseAuthUser } from 'firebase/auth';
import type { AuthUser } from '@/lib/store';
import { getUserByEmail, addUser } from '@/lib/firestore';
import type { User } from '@/lib/types';


const initialState = {
  message: '',
  error: '',
  user: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Logging in...' : 'Log in'}
    </Button>
  );
}

export default function LoginPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(loginAction, initialState);
  const router = useRouter();
  const login = useAuth.getState().login;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && state?.user) {
      toast({
        title: 'Logged In',
        description: state.message,
      });
      login(state.user);
      formRef.current?.reset();
      router.push('/profile');
    }
  }, [state, toast, router, login]);
  
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
      
      if (!userProfile) {
        // Admin status should be explicitly set in the database, not inferred from email on signup.
        const isAdmin = false; 
        const newUser: Omit<User, 'id'> = {
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email,
          avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.email}/40/40`,
          isHost: false,
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

      // Establish server-side session cookie for server actions
      try {
        const idToken = await firebaseUser.getIdToken(true);
        const res = await createSessionFromIdToken(idToken);
        if (!res?.success) {
          console.warn('Failed to create server session from ID token');
        }
      } catch (e) {
        console.error('Error creating server session from ID token:', e);
      }

      login(authUser);
      toast({
        title: 'Logged In!',
        description: `Welcome back, ${authUser.name}!`,
      });
      router.push('/profile');
    } catch (error: any) {
      console.error('Social Login Error:', error);
      toast({ variant: 'destructive', title: 'Login Failed', description: 'An unexpected error occurred during social login.' });
    }
  };


  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="grid gap-4">
             {state?.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
            <SubmitButton />
          </form>
          
          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleSocialLogin('google')}><GoogleIcon /> <span className="ml-2">Google</span></Button>
              <Button variant="outline" onClick={() => handleSocialLogin('apple')}><AppleIcon /> <span className="ml-2">Apple</span></Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
