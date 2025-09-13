
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Mail, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const pressReleases = [
  {
    date: "October 26, 2023",
    title: "DriveIO Secures $50M in Series B Funding to Accelerate Global Expansion and EV Fleet",
    source: "TechCrunch",
    link: "#",
    image: "https://picsum.photos/seed/press1/400/200"
  },
  {
    date: "September 15, 2023",
    title: "The Sharing Economy Hits the Open Road: How DriveIO is Redefining Car Ownership",
    source: "Forbes",
    link: "#",
    image: "https://picsum.photos/seed/press2/400/200"
  },
  {
    date: "July 01, 2023",
    title: "DriveIO Launches in Europe, Bringing Peer-to-Peer Car Sharing to 10 New Major Cities",
    source: "Bloomberg",
    link: "#",
    image: "https://picsum.photos/seed/press3/400/200"
  },
];

export default function PressPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center">
        <Newspaper className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold font-headline mt-4">Press & Media</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Welcome to the DriveIO press room. Find our latest news, media assets, and contact information for press inquiries.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <Mail className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Media Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              For all media-related questions, interview requests, or other press inquiries, please contact our communications team. We're always happy to share our story and provide more information.
            </p>
            <Button asChild className="mt-4">
              <a href="mailto:press@driveio.com">Contact Our Team</a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Download className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Brand & Media Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Need our logo or other brand assets for your story? Download our official media kit, which includes logos, executive photos, and brand usage guidelines.
            </p>
            <Button variant="outline" className="mt-4">
              Download Media Kit
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-3xl font-bold font-headline text-center mb-8">Featured In the News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pressReleases.map((release, index) => (
            <Card key={index} className="overflow-hidden">
               <div className="relative aspect-video">
                 <Image src={release.image} alt={release.title} fill className="object-cover" data-ai-hint="news article" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
               </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{release.date} &middot; {release.source}</p>
                <h3 className="font-bold mt-1 mb-2 leading-tight">{release.title}</h3>
                <Link href={release.link} className="text-sm font-semibold text-primary hover:underline">
                  Read article &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
