
import EditListing from "@/components/edit-listing";

export default function EditListingPage({ params }: { params: { id: string } }) {
  return <EditListing vehicleId={params.id} />;
}
