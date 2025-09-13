
'use client';

import Link from 'next/link';
import Logo from './logo';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, User, MessageSquare, Car, Heart, Briefcase, LogOut, ChevronDown, Shield } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useAuth } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Separator } from './ui/separator';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { logoutAction } from '@/app/login/actions';
import type { AuthUser } from '@/lib/store';


const NavLinks = ({ isLoggedIn, isHost }: { isLoggedIn: boolean, isHost: boolean }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/search" className={navigationMenuTriggerStyle()}>
              Find a car
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={navigationMenuTriggerStyle()}>
                  Hosting
                  <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isHost ? (
                  <DropdownMenuItem asChild>
                    <Link href="/host/dashboard">Host Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/host">Become a Host</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/hosting/guidelines">Host Guidelines</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hosting/insurance">Insurance & Protection</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <NavigationMenuLink asChild>
                <Link href="/host" className={navigationMenuTriggerStyle()}>
                  Become a host
                </Link>
              </NavigationMenuLink>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const UserNav = ({ user, onLogout }: { user: AuthUser, onLogout: () => void }) => {
  // A simple check for admin role. In a real app, this would be more robust.
  const isAdmin = user.isAdmin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href="/profile/trips"><Briefcase className="mr-2 h-4 w-4" />My Trips</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/profile/favorites"><Heart className="mr-2 h-4 w-4" />Favorites</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/messages"><MessageSquare className="mr-2 h-4 w-4" />Messages</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" />Account</Link></DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild><Link href="/admin"><Shield className="mr-2 h-4 w-4" />Admin Console</Link></DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const AuthButtons = () => (
  <>
    <Button variant="ghost" asChild>
      <Link href="/login">Log In</Link>
    </Button>
    <Button asChild>
      <Link href="/signup">Sign Up</Link>
    </Button>
  </>
);


const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await logoutAction();
      logout();
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  const isHost = user?.isHost || false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks isLoggedIn={isLoggedIn} isHost={isHost} />
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn && user ? <UserNav user={user} onLogout={handleLogout} /> : <AuthButtons />}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-4 flex flex-col h-full">
                <Link href="/" className="mb-6 block">
                  <Logo />
                </Link>
                <nav className="flex flex-col gap-4 mb-6">
                   <Link href="/search" className="text-lg font-medium hover:text-primary transition-colors">Find a car</Link>
                    <Link href={isHost ? "/host/dashboard" : "/host"} className="text-lg font-medium hover:text-primary transition-colors">
                        {isHost ? 'Host Dashboard' : 'Become a host'}
                    </Link>
                </nav>
                
                {isLoggedIn && (
                  <>
                    <Separator />
                    <nav className="flex flex-col gap-4 my-6">
                      <Link href="/profile/trips" className="text-lg font-medium hover:text-primary transition-colors">My Trips</Link>
                      <Link href="/profile/favorites" className="text-lg font-medium hover:text-primary transition-colors">Favorites</Link>
                      <Link href="/messages" className="text-lg font-medium hover:text-primary transition-colors">Messages</Link>
                    </nav>
                  </>
                )}

                <div className="mt-auto flex flex-col gap-2">
                   {isLoggedIn && user ? (
                     <>
                      <Button variant="outline" asChild><Link href="/profile">Account</Link></Button>
                      <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
                     </>
                   ) : <AuthButtons />}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
