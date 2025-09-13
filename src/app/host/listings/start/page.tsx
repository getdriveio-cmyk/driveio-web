
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Camera, DollarSign, CheckCircle } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        icon: <List className="w-8 h-8 text-primary" />,
        title: "Tell us about your car",
        description: "Share some basic details like the make, model, and year. Our AI tools can help you with the rest!",
    },
    {
        icon: <Camera className="w-8 h-8 text-primary" />,
        title: "Add some photos",
        description: "Upload at least 6 high-quality photos to make your listing stand out to potential renters.",
    },
    {
        icon: <DollarSign className="w-8 h-8 text-primary" />,
        title: "Set your price",
        description: "You're in control of your daily price. We'll even suggest a competitive rate based on your car's market value.",
    },
    {
        icon: <CheckCircle className="w-8 h-8 text-primary" />,
        title: "Publish your listing",
        description: "Review your details and publish! You'll be ready to start accepting bookings and earning money.",
    },
];

export default function StartListingPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">List your car on DriveIO</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Join our community of hosts and turn your car into an earning opportunity. Let's get your listing created in just a few easy steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="mt-1">{step.icon}</div>
                        <div>
                            <h3 className="font-bold text-lg">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center pt-4">
                <Button size="lg" asChild>
                    <Link href="/host/listings/new">Let's get started</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
