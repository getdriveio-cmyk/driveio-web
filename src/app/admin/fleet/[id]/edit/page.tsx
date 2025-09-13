
import EditListing from "@/components/edit-listing";

export default function AdminEditVehiclePage({ params }: { params: { id: string } }) {
  return <EditListing vehicleId={params.id} />;
}
