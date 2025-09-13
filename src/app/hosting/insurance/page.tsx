
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, LifeBuoy, FileText } from "lucide-react";

const insuranceFeatures = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Comprehensive Liability Coverage",
    description: "Rest easy knowing you're protected. All hosts are covered by a third-party liability insurance policy from a top-rated insurance provider, up to $750,000.",
  },
  {
    icon: <LifeBuoy className="w-10 h-10 text-primary" />,
    title: "24/7 Roadside Assistance",
    description: "The unexpected can happen. That's why every trip is covered with 24/7 nationwide roadside assistance for lockouts, flat tires, and other on-the-road issues.",
  },
  {
    icon: <FileText className="w-10 h-10 text-primary" />,
    title: "Physical Damage Protection",
    description: "Your car is your asset. Choose from various protection plans that offer reimbursement for physical damage to your car, subject to a deductible.",
  },
];

export default function InsuranceProtectionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Insurance & Protection</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Share your car with confidence. We provide the coverage and support to protect you and your vehicle.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {insuranceFeatures.map((feature, index) => (
           <Card key={index} className="flex flex-col items-center text-center">
            <CardHeader>
              <div className="p-4 bg-primary/10 rounded-full">
                {feature.icon}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold font-headline mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Learn More About Your Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page provides a summary of our host protection plans. For full details, including all terms, conditions, and exclusions, please visit our Help Center or review the complete insurance policy documents available to all active hosts. Our primary goal is to provide you with total peace of mind, so you can focus on providing a great experience for your guests and maximizing your earnings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
