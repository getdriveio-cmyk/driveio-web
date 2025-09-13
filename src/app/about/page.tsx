
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, Rocket } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the mission, vision, and team behind DriveIO, a community-driven car sharing marketplace.',
};

const teamMembers = [
  {
    name: "William Gilbert",
    role: "Founder & CEO",
    avatar: "https://picsum.photos/seed/team1/100/100",
  },
  {
    name: "Maria Garcia",
    role: "Head of Operations",
    avatar: "https://picsum.photos/seed/team2/100/100",
  },
  {
    name: "Sam Chen",
    role: "Lead Engineer",
    avatar: "https://picsum.photos/seed/team3/100/100",
  },
  {
    name: "Jessica Brown",
    role: "Marketing Director",
    avatar: "https://picsum.photos/seed/team4/100/100",
  },
];

export default function AboutUsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">About DriveIO</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          We are revolutionizing personal mobility by creating a trusted, community-driven car sharing marketplace that connects car owners with people who need a vehicle, right in their neighborhood.
        </p>
      </section>

      <section className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
        <Image
          src="https://picsum.photos/seed/about-hero/1200/600"
          alt="Happy people driving in a convertible car on a sunny day"
          fill
          className="object-cover"
          data-ai-hint="happy people driving"
        />
      </section>

      <section className="grid md:grid-cols-3 gap-8 text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">To empower people with the freedom of mobility by providing a seamless and affordable way to access cars anywhere, anytime, while enabling car owners to earn significant income from their underutilized assets.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <Rocket className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We envision a future with fewer cars on the road and more connected communities. By fostering a culture of sharing, we aim to build a global network where travel is more accessible, sustainable, and enjoyable for everyone.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Founded in a small garage in 2020, DriveIO was born from a simple yet powerful idea: what if we could make better use of the millions of cars that sit idle every day? We've since grown into a vibrant, international community of owners and renters.</p>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold font-headline">Meet Our Team</h2>
        <p className="mt-2 text-muted-foreground">The passionate people innovating at the intersection of technology and transportation.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h4 className="font-bold text-lg">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
