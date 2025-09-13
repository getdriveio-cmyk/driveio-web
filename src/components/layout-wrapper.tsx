
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Helper component to conditionally render layout
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // The admin layout is already applied within its own layout file,
    // so we just render the children directly.
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
