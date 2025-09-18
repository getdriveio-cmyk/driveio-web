import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { app } from '@/lib/firebase/admin-app';
import type { Vehicle, Booking, User, Testimonial } from './types';

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

const toUser = (docData: any, id: string): User => {
  return {
    id,
    ...docData,
    joinedDate: toIso(docData?.joinedDate),
  } as User;
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

export async function hasBookingConflict(vehicleId: string, fromIso: string, toIso: string): Promise<boolean> {
  // Find any booking for same vehicle where startDate < toIso and endDate > fromIso
  // We query startDate < toIso, then filter endDate in memory to minimize indexes.
  const snap = await db.collection('bookings')
    .where('vehicle.id', '==', vehicleId)
    .where('startDate', '<', toIso)
    .limit(5)
    .get();
  for (const doc of snap.docs) {
    const b = doc.data() as any;
    const status = (b.status || '').toString();
    if (status === 'cancelled' || status === 'declined') continue;
    const existingEnd = (b.endDate || '').toString();
    if (existingEnd > fromIso) {
      return true;
    }
  }
  return false;
}

export async function getUsersAdmin(): Promise<User[]> {
  try {
    const snap = await db.collection('hosts').get();
    return snap.docs.map(d => toUser(d.data(), d.id));
  } catch (e) {
    console.error('Admin getUsers failed:', e);
    return [];
  }
}

export async function getBookingsAdmin(limitCount = 50): Promise<Booking[]> {
  try {
    const snap = await db.collection('bookings').orderBy('createdAt', 'desc').limit(limitCount).get();
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Booking));
  } catch (e) {
    console.error('Admin getBookings failed:', e);
    return [];
  }
}

export async function getBannedUsersAdmin(): Promise<User[]> {
  try {
    const snap = await db.collection('hosts').where('isBanned', '==', true).get();
    return snap.docs.map(d => toUser(d.data(), d.id));
  } catch (e) {
    console.error('Admin getBannedUsers failed:', e);
    return [];
  }
}

export async function getContactsAdmin(limitCount = 100): Promise<any[]> {
  try {
    const snap = await db.collection('contacts').orderBy('submittedAt', 'desc').limit(limitCount).get();
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any), submittedAt: toIso((d.data() as any)?.submittedAt) }));
  } catch (e) {
    console.error('Admin getContacts failed:', e);
    return [];
  }
}

export async function getAdminAuditLogs(limitCount = 100): Promise<any[]> {
  try {
    const snap = await db.collection('admin_audit').orderBy('at', 'desc').limit(limitCount).get();
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any), at: toIso((d.data() as any)?.at) }));
  } catch (e) {
    console.error('Admin getAdminAuditLogs failed:', e);
    return [];
  }
}

export async function getVehiclesByHostAdmin(hostId: string): Promise<Vehicle[]> {
  try {
    const snap = await db.collection('vehicles').where('host.id', '==', hostId).get();
    return snap.docs.map(d => toVehicle(d.data(), d.id));
  } catch (e) {
    console.error('Admin getVehiclesByHost failed:', e);
    return [];
  }
}

export async function getBookingsForHostAdmin(hostId: string): Promise<Booking[]> {
  try {
    const snap = await db.collection('bookings')
      .where('vehicle.host.id', '==', hostId)
      .orderBy('startDate', 'desc')
      .limit(200)
      .get();
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Booking));
  } catch (e) {
    console.error('Admin getBookingsForHost failed:', e);
    return [];
  }
}

export async function getTestimonialsAdmin(): Promise<Testimonial[]> {
  try {
    const snap = await db.collection('testimonials').orderBy('rating', 'desc').limit(10).get();
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Testimonial));
  } catch (e) {
    console.error('Admin getTestimonials failed:', e);
    return [];
  }
}


