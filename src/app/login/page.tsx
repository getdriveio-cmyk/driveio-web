
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GoogleIcon, AppleIcon } from '@/components/social-icons';
import { useEffect, useRef, useState } from 'react';
import { createSessionFromIdToken } from './actions';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, OAuthProvider, signInWithRedirect, getRedirectResult, type User as FirebaseAuthUser } from 'firebase/auth';
import type { AuthUser } from '@/lib/store';
import { getUserByEmail, addUser } from '@/lib/firestore';
import type { User } from '@/lib/types';


function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? 'Logging in...' : 'Log in'}
    </Button>
  );
}

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const login = useAuth.getState().login;
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create server session
      const idToken = await user.getIdToken(true);
      const sessionResult = await createSessionFromIdToken(idToken);
      
      if (!sessionResult.success) {
        console.warn('Failed to create server session');
      }
      
      // Fetch user profile
      const userProfile = await getUserByEmail(user.email!);
      if (!userProfile) {
        setError('Could not find user profile for this account.');
        return;
      }

      const authUser: AuthUser = {
        id: userProfile.id,
        email: user.email!,
        name: user.displayName || userProfile.name || 'User',
        avatarUrl: user.photoURL || userProfile.avatarUrl || `https://picsum.photos/seed/${user.email}/40/40`,
        isHost: userProfile.isHost || false,
        isAdmin: userProfile.isAdmin || false,
      };

      login(authUser);
      toast({
        title: 'Logged In',
        description: `Welcome back, ${authUser.name}!`,
      });
      formRef.current?.reset();
      router.push('/profile');
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorMessage = 'Invalid email or password. Please try again.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          console.error('Firebase Login Error:', error);
          errorMessage = 'Failed to log in. Please try again later.';
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
        await signInWithRedirect(auth, provider);
        return;
      } else {
        const apple = new OAuthProvider('apple.com');
        apple.addScope('email');
        apple.addScope('name');
        await signInWithRedirect(auth, apple);
        return;
      }
      
      // unreachable
      const firebaseUser = auth.currentUser as any;
      
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
  // Handle redirect result for Google/Apple
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const firebaseUser = result.user;
          if (!firebaseUser.email) throw new Error('No email returned from provider');

          let userProfile = await getUserByEmail(firebaseUser.email);
          if (!userProfile) {
            const newUser: Omit<User, 'id'> = {
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email,
              avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.email}/40/40`,
              isHost: false,
              isAdmin: false,
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
          toast({ title: 'Logged In!', description: `Welcome back, ${authUser.name}!` });
          router.push('/profile');
        }
      } catch (err) {
        // No redirect result; ignore
      }
    })();
  }, [login, router, toast]);


  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleEmailLogin} className="grid gap-4">
             {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
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
            <SubmitButton loading={loading} />
          </form>
          
          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleSocialLogin('google')} aria-label="Sign in with Google">
                <GoogleIcon /> <span className="ml-2">Google</span>
              </Button>
              <Button variant="outline" onClick={() => handleSocialLogin('apple')} aria-label="Sign in with Apple">
                <AppleIcon /> <span className="ml-2">Apple</span>
              </Button>
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
