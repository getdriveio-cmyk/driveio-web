
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const guidelines = [
  "Maintain exceptional cleanliness. Keep your vehicle clean, inside and out, and well-maintained for every guest. A clean car is the foundation of a 5-star review.",
  "Stay up-to-date. Ensure your vehicle's registration, inspection, and any required permits are always current. Safety and legality are non-negotiable.",
  "Be responsive and communicative. Respond to booking requests and inquiries promptly, ideally within a few hours. Clear and friendly communication sets the stage for a great trip.",
  "Provide a seamless handover. Create a clear and simple check-in and check-out process. Provide detailed instructions for your guests to ensure a smooth start and end to their trip.",
  "Represent your vehicle accurately. Your listing should have clear, recent photos and an honest, detailed description of your vehicle's features and condition.",
  "Be a great host. Maintain a high standard of communication and hospitality. A little effort goes a long way in making your guests feel welcome and valued.",
  "Report any issues immediately. Should any problems or incidents arise, report them to DriveIO support without delay. We are here to help you resolve things quickly."
];

export default function HostGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Host Guidelines</CardTitle>
          <p className="text-muted-foreground pt-2">
            To ensure a safe, reliable, and enjoyable experience for everyone in the DriveIO community, we ask our hosts to uphold the following standards. Adherence to these guidelines is key to your success.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-4">
            {guidelines.map((guideline, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary mt-1 shrink-0" />
                <span className="text-muted-foreground">{guideline}</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-foreground mb-2 font-headline">Our Mutual Commitment</h3>
            <p className="text-muted-foreground">
              By following these guidelines, you not only help create a trusted and thriving community but also set yourself up for positive reviews, repeat bookings, and greater earnings. We're committed to supporting you every step of the way in your journey as a successful host. For more detailed information, please refer to our full Terms of Service.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
