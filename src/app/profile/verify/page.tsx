
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

type VerificationStep = 'requesting' | 'ready' | 'capturing' | 'verifying' | 'verified' | 'denied' | 'failed';

export default function VerifyIdPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<VerificationStep>('requesting');

  useEffect(() => {
    const getCameraPermission = async () => {
      // Only run on the client
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStep('ready');
        } catch (error) {
          console.error('Error accessing camera:', error);
          setStep('denied');
        }
      }
    };
    getCameraPermission();
  }, []);

  const handleCapture = () => {
    setStep('capturing');
    setTimeout(() => {
      setStep('verifying');
      setTimeout(() => {
        // In a real app, you'd get a result from your verification service
        const isVerified = Math.random() > 0.2; // Simulate success or failure
        if (isVerified) {
          setStep('verified');
        } else {
          setStep('failed');
        }
      }, 3000);
    }, 1000);
  };

  const handleRetry = () => {
    setStep('ready');
  };

  const renderContent = () => {
    switch (step) {
      case 'requesting':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Requesting camera access...</p>
          </div>
        );
      case 'ready':
      case 'capturing':
        return (
          <div className="space-y-4 w-full">
            <p className="text-center text-muted-foreground">Position your government-issued ID in the frame and click capture.</p>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-secondary">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {step === 'capturing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-4 border-white animate-ping"></div>
                  </div>
              )}
            </div>
            <Button className="w-full" size="lg" onClick={handleCapture} disabled={step === 'capturing'}>
              <Camera className="mr-2 h-5 w-5" />
              Capture ID
            </Button>
          </div>
        );
      case 'verifying':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Verifying your document... Please wait.</p>
          </div>
        );
      case 'verified':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h3 className="text-2xl font-bold mt-4">You're Verified!</h3>
            <p className="text-muted-foreground mt-2">
              Your identity has been successfully verified. You can now continue booking and hosting.
            </p>
            <Button asChild className="mt-6">
              <Link href="/profile">Return to Profile</Link>
            </Button>
          </div>
        );
      case 'denied':
         return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              We couldn't access your camera. Please enable camera permissions in your browser settings and refresh the page.
            </AlertDescription>
          </Alert>
        );
       case 'failed':
        return (
          <div className="text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                We were unable to verify your ID. Please ensure the image is clear and try again.
              </AlertDescription>
            </Alert>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
          <CardDescription>
            To ensure the safety of our community, we require all users to verify their identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
