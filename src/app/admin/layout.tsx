
'use client';

import { Sidebar, SidebarProvider, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Logo from "@/components/logo";
import { Users, LifeBuoy, LayoutDashboard, Car, BookOpenCheck, DollarSign, ShieldAlert, LineChart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn, isHydrating } = useAuth.getState();
  const router = useRouter();

  useEffect(() => {
    // Wait until hydration is complete before checking auth status
    if (!isHydrating && (!isLoggedIn || !user?.isAdmin)) {
      router.push('/');
    }
  }, [isLoggedIn, user, router, isHydrating]);

  // Show a loading state while the auth store is rehydrating
  if (isHydrating) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }
  
  // If user is not an admin after hydration, they will be redirected by the useEffect.
  // Render null or a loading state to prevent flashing the admin UI.
  if (!isLoggedIn || !user?.isAdmin) {
    return (
       <div className="flex items-center justify-center h-screen">
            <p>Redirecting...</p>
        </div>
    );
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="User Management">
                 <Link href="/admin/users">
                  <Users />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Fleet Management">
                 <Link href="/admin/fleet">
                  <Car />
                  <span>Fleet</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Bookings">
                 <Link href="/admin/bookings">
                  <BookOpenCheck />
                  <span>Bookings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Payments">
                 <Link href="/admin/payments">
                  <DollarSign />
                  <span>Payments</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Analytics">
                 <Link href="/admin/analytics">
                  <LineChart />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Support Tickets">
                 <Link href="/admin/support">
                  <LifeBuoy />
                  <span>Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Security">
                 <Link href="/admin/security">
                  <ShieldAlert />
                  <span>Security</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
