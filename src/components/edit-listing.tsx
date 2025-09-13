
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getVehicle } from '@/lib/firestore';
import ListingForm from "@/components/host/listing-form";

interface EditListingProps {
  vehicleId: string;
}

export default async function EditListing({ vehicleId }: EditListingProps) {
  const vehicle = await getVehicle(vehicleId);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editing: {vehicle.name}</CardTitle>
          <CardDescription>Update the details for your vehicle listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <ListingForm isEditMode={true} vehicleData={vehicle} />
        </CardContent>
      </Card>
    </div>
  );
}
