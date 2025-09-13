
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CookieBanner() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie_consent');
    setConsent(storedConsent);
  }, []);

  const handleConsent = (decision: 'accepted' | 'declined') => {
    localStorage.setItem('cookie_consent', decision);
    setConsent(decision);
  };

  if (consent) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground p-4 shadow-lg transition-transform duration-300',
        consent === null ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-left">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          <Link href="/privacy-policy" className="underline ml-1">
            Learn more
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => handleConsent('declined')}>
            Decline
          </Button>
          <Button size="sm" onClick={() => handleConsent('accepted')}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
