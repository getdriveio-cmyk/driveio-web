
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, LifeBuoy } from "lucide-react";
import Link from "next/link";

const faqCategories = [
  {
    category: "For Renters",
    questions: [
      {
        question: "How do I book a car on DriveIO?",
        answer: "Booking a car is simple! Start by entering your desired location and travel dates into the search bar on our homepage. You can then browse available vehicles, use filters to narrow your search, and select the perfect car for your trip. Once you've chosen a car, click 'Book Now' and follow the prompts to confirm your payment details and reservation."
      },
      {
        question: "What documents do I need to rent a car?",
        answer: "To rent a car on DriveIO, you'll need a valid driver's license, a major credit card in your name for the security deposit, and you must meet the minimum age requirement. The standard minimum age is 21, but this can vary by location and the type of vehicle you wish to rent."
      },
       {
        question: "Is insurance included with my rental?",
        answer: "Absolutely. For your peace of mind, every rental booked through DriveIO includes a standard insurance policy that covers liability and physical damage, subject to a deductible. You may also have the option to purchase premium coverage for additional protection during the checkout process."
      },
      {
        question: "How do the vehicle pick-up and drop-off processes work?",
        answer: "Pick-up and drop-off procedures are arranged directly with the vehicle's host. After your booking is confirmed, you'll be able to communicate with them through our messaging system to coordinate the details. Many hosts offer convenient options, including contactless check-in or delivery to your location for a small fee."
      }
    ]
  },
  {
    category: "For Hosts",
    questions: [
      {
        question: "How do I list my car?",
        answer: "Listing your car is easy and free. Just click on 'List Your Car' from the main menu, and we'll guide you through the process of adding photos, writing a description, setting your price, and outlining your car's availability. Our AI tools can even help you write a great description and suggest a competitive price!"
      },
      {
        question: "How am I protected as a host?",
        answer: "We provide comprehensive protection for our hosts. This includes up to $750,000 in third-party liability insurance, 24/7 roadside assistance for your guests, and various physical damage protection plans. We also verify all renters to ensure a trusted community."
      },
       {
        question: "How and when do I get paid?",
        answer: "Payments are processed securely through our platform. Your earnings will be deposited directly into your bank account via direct deposit, typically within 3-5 business days after a trip is completed. You can track your earnings and payment history in your Host Dashboard."
      },
    ]
  },
   {
    category: "General",
    questions: [
      {
        question: "What are the cancellation policy options?",
        answer: "Cancellation policies are set by each individual host and can vary. You can find the specific policy for each vehicle on its listing page before you book. We encourage hosts to offer flexible options, but some may have moderate or strict policies, especially for high-demand vehicles or dates."
      },
      {
        question: "How does DriveIO verify users?",
        answer: "To maintain a safe and trusted community, we require all users to complete an identity verification process. This typically involves submitting a government-issued photo ID and may include a selfie for comparison. This helps us confirm that everyone is who they say they are."
      }
    ]
  },
];

export default function HelpCenterPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Help Center</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Have questions? We've got answers. Find the help you need to get back on the road.
        </p>
        <div className="mt-6 max-w-lg mx-auto relative">
          <Input placeholder="Search topics, e.g., 'cancellation policy'" className="pr-10 h-12 text-base" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-10">
        {faqCategories.map((category) => (
            <div key={category.category}>
                <h2 className="text-2xl font-bold font-headline mb-4">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
            </div>
        ))}
        
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-2">
              <LifeBuoy className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>Can't find what you're looking for?</CardTitle>
            <CardDescription>
              Our support team is always here to help. Reach out to us for personalized assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
