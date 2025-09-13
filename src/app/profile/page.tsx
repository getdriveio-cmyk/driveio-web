
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function ProfilePage() {
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    const handleSaveChanges = () => {
        // In a real app, you would handle form submission here.
        alert("Profile updated!");
    }

    if (!isLoggedIn || !user) {
        return null; // or a loading spinner
    }

    const [firstName, lastName] = user.name.split(' ');

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue={firstName || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue={lastName || ''} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                        <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (123) 456-7890" />
                    </div>
                    <div className="pt-2">
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold font-headline">Notifications</h3>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label htmlFor="email-notifications" className="font-semibold">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive updates about your bookings and promotions.</p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label htmlFor="sms-notifications" className="font-semibold">SMS Notifications</Label>
                                <p className="text-sm text-muted-foreground">Get text alerts for important trip updates.</p>
                            </div>
                            <Switch id="sms-notifications" />
                        </div>
                    </div>
                        <Separator />
                    <div className="space-y-4">
                            <h3 className="text-lg font-bold font-headline">Security</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Lock className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">Change Password</p>
                                    <p className="text-sm text-muted-foreground">Last changed over a year ago.</p>
                                </div>
                            </div>
                            <Button variant="outline">Change</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">Identity Verification</p>
                                    <p className="text-sm text-muted-foreground">Not verified.</p>
                                </div>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/profile/verify">Verify Now</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
