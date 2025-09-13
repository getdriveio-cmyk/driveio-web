
'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart, Briefcase, Car, CreditCard, Star } from "lucide-react";
import { useAuth } from "@/lib/store";
import { useEffect } from "react";

export default function SidebarNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoggedIn, isHydrating } = useAuth();

    useEffect(() => {
        if (!isHydrating && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isHydrating, router]);

    const navItems = [
        { id: 'profile', label: 'Account', icon: User, href: '/profile' },
        { id: 'trips', label: 'My Trips', icon: Briefcase, href: '/profile/trips'},
        { id: 'favorites', label: 'Favorites', icon: Heart, href: '/profile/favorites' },
        { id: 'reviews', label: 'Reviews', icon: Star, href: '/profile/reviews' },
        { id: 'payments', label: 'Payments', icon: CreditCard, href: '/profile/payments' },
    ];
    
    if (user?.isHost) {
        navItems.push({ id: 'dashboard', label: 'Host Dashboard', icon: Car, href: '/host/dashboard' });
    }

    if (isHydrating || !user) {
        return null; // Or a loading skeleton
    }
    
    return (
        <Card>
            <CardHeader className="items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
                {navItems.map(item => (
                     <Button 
                        key={item.id}
                        variant={pathname === item.href ? 'secondary' : 'ghost'} 
                        className="w-full justify-start gap-2"
                        asChild
                    >
                        <Link href={item.href}>
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
};
