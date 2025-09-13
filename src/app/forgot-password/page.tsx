
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { forgotPasswordAction } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const initialState = {
  message: '',
  error: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Sending...' : 'Send Password Reset Email'}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
          <CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.success ? (
            <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Email Sent!</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
                <div className="mt-4">
                    <Button asChild>
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </div>
            </Alert>
          ) : (
            <form action={formAction} className="grid gap-4">
              {state.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="m@example.com" required />
              </div>
              <SubmitButton />
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            Remembered your password?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
