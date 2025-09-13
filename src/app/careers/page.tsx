import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase } from "lucide-react";

const jobOpenings = [
  {
    title: "Senior Frontend Engineer",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    description: "Architect and build beautiful, intuitive user interfaces using modern web technologies. You will be a key player in shaping the user experience of the DriveIO platform, working with React, Next.js, and TypeScript to create performant and scalable features.",
  },
  {
    title: "Product Marketing Manager",
    location: "New York, NY",
    type: "Full-time",
    description: "Become the voice of DriveIO. You will be responsible for defining product positioning, crafting compelling messaging, and executing go-to-market strategies that drive user acquisition and engagement. Your work will directly impact our growth and brand presence.",
  },
  {
    title: "Customer Support Specialist",
    location: "Austin, TX",
    type: "Part-time",
    description: "Be the first point of contact for our community. You'll provide exceptional support, troubleshoot issues, and gather user feedback to help improve our service. Excellent communication and problem-solving skills are a must for this critical role.",
  },
  {
    title: "Backend Engineer (Go)",
    location: "Remote",
    type: "Full-time",
    description: "Design, build, and maintain the scalable, resilient microservices that power our platform. We're looking for an engineer with strong experience in Go, distributed systems, and cloud infrastructure to help us handle our growing scale and complexity.",
  },
];

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Join Our Team</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          We're on a mission to build a more sustainable and accessible future for transportation. If you're passionate about technology, community, and creating amazing experiences, we want to hear from you.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Open Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobOpenings.map((job, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.type}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{job.description}</p>
              </CardContent>
              <CardFooter>
                <Button>Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
