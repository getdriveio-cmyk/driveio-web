import ListingForm from "@/components/host/listing-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewListingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a new listing</CardTitle>
          <CardDescription>Fill out the form below to add your vehicle to DriveIO.</CardDescription>
        </CardHeader>
        <CardContent>
          <ListingForm />
        </CardContent>
      </Card>
    </div>
  );
}
