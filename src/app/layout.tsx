
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import LayoutWrapper from '@/components/layout-wrapper';
import CookieBanner from '@/components/cookie-banner';
import TrackingPixel from '@/components/tracking-pixel';

// This metadata will be the fallback for all pages.
// Specific pages will override this with their own metadata.
export const metadata: Metadata = {
  title: {
    default: 'DriveIO - Seamless Car Rentals for Every Journey',
    template: '%s | DriveIO',
  },
  description: 'Book unique cars from trusted hosts. DriveIO is a peer-to-peer car sharing marketplace where you can rent any car you want, wherever you want it, from a vibrant community of local hosts.',
  openGraph: {
    title: 'DriveIO - Seamless Car Rentals for Every Journey',
    description: 'Book unique cars from trusted hosts.',
    url: 'https://getdriveio.com',
    siteName: 'DriveIO',
    images: [
      {
        url: 'https://picsum.photos/seed/og-image/1200/630',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DriveIO - Seamless Car Rentals for Every Journey',
    description: 'Book unique cars from trusted hosts.',
    creator: '@getdriveio',
    images: ['https://picsum.photos/seed/og-image/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster />
        <CookieBanner />
        <TrackingPixel />
      </body>
    </html>
  );
}
