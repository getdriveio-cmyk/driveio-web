import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { app } from '@/lib/firebase/admin-app';
import type { Vehicle, Booking, User } from './types';

const db = getFirestore(app);

const toIso = (v: any) => (v instanceof Timestamp ? v.toDate().toISOString() : v);

const toVehicle = (docData: any, id: string): Vehicle => {
  const host = {
    ...docData.host,
    joinedDate: toIso(docData.host?.joinedDate),
  };
  const reviews = (docData.reviews || []).map((r: any) => ({ ...r, date: toIso(r?.date) }));
  return { id, ...docData, host, reviews } as Vehicle;
};

export interface VehicleFilters {
  type?: string;
  maxPrice?: number;
  features?: string[];
  minRating?: number;
  location?: string;
}

export async function getVehiclesAdmin(count?: number, filters?: VehicleFilters): Promise<Vehicle[]> {
  try {
    let q: FirebaseFirestore.Query = db.collection('vehicles');

    if (filters?.type && filters.type !== 'all') {
      q = q.where('type', '==', filters.type.toLowerCase());
    }
    if (filters?.maxPrice && filters.maxPrice < 1000) {
      q = q.where('pricePerDay', '<=', filters.maxPrice);
    }
    if (filters?.minRating && filters.minRating > 0) {
      q = q.where('rating', '>=', filters.minRating);
    }
    if (count) {
      q = q.limit(count);
    }

    const snap = await q.get();
    let vehicles = snap.docs.map(d => toVehicle(d.data(), d.id));

    if (filters?.features && filters.features.length > 0) {
      vehicles = vehicles.filter(v => filters.features!.every(f => v.features.map(x => x.toLowerCase()).includes(f.toLowerCase())));
    }
    if (filters?.location) {
      vehicles = vehicles.filter(v => v.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }

    return vehicles;
  } catch (e) {
    console.error('Admin getVehicles failed:', e);
    return [];
  }
}


