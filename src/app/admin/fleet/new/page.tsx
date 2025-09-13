
import ListingForm from "@/components/host/listing-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNewVehiclePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add a new vehicle</CardTitle>
          <CardDescription>Fill out the form below to add a vehicle to the DriveIO platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <ListingForm />
        </CardContent>
      </Card>
    </div>
  );
}
