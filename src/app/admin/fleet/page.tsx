
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Upload, Edit, Trash2 } from "lucide-react";
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import type { Vehicle } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteVehicleAction } from './actions';

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Available':
      return 'default';
    case 'Rented':
      return 'secondary';
    case 'Pending Approval':
      return 'outline';
    case 'Under Repair':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function AdminFleetPage() {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const res = await fetch('/api/vehicles', { cache: 'no-store' });
        const data = await res.json();
        setVehicles(data.vehicles || []);
      } catch (e) {
        setVehicles([]);
      }
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedVehicle) {
      const result = await deleteVehicleAction(selectedVehicle.id);
      if (result.success) {
        setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
        toast({
          title: 'Vehicle Deleted',
          description: `"${selectedVehicle.name}" has been removed.`,
        });
      } else {
         toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);
    }
  };


  if (loading) {
    return <div>Loading fleet...</div>
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Fleet Management</h1>
          <p className="text-muted-foreground">
              Oversee and manage all vehicles on the DriveIO platform.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Upload className="mr-2" /> Import CSV</Button>
            <Button asChild>
              <Link href="/admin/fleet/new">
                <PlusCircle className="mr-2" /> Add Vehicle
              </Link>
            </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map(vehicle => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={vehicle.host.avatarUrl} alt={vehicle.host.name} />
                        <AvatarFallback>{vehicle.host.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{vehicle.host.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* Note: Status is hardcoded as 'Available' as it's not in the data model yet */}
                    <Badge variant={getStatusBadgeVariant('Available')}>Available</Badge>
                  </TableCell>
                  <TableCell>${vehicle.pricePerDay}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/fleet/${vehicle.id}/edit`}>
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(vehicle)}>
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the listing for the "{selectedVehicle?.name}" and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
