
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function TrackingPixel() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const checkConsent = () => {
      const storedConsent = localStorage.getItem('cookie_consent');
      setConsent(storedConsent);
    };

    // Check consent on initial load
    checkConsent();

    // Listen for changes in localStorage from the cookie banner
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'cookie_consent') {
        checkConsent();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (consent !== 'accepted') {
    return null;
  }

  return (
    <>
      {/* 
        This is where you would add your tracking scripts.
        They will only be rendered and executed if the user has accepted the cookie policy.
        
        Example for Google Analytics (gtag.js):
      */}
      {/* 
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR_GA_ID', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      */}
      
      {/* 
        Example for Facebook Pixel:
      */}
      {/* 
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `,
        }}
      />
      */}
    </>
  );
}
