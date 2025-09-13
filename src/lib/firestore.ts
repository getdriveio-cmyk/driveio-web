import { collection, doc, getDoc, getDocs, query, where, limit, addDoc, updateDoc, serverTimestamp, setDoc, deleteDoc, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Vehicle, Booking } from './types';

// Helper function to convert Firestore doc data to a Vehicle object
const toVehicle = (docData: any, id: string): Vehicle => {
  // Firestore timestamps need to be converted to strings for serializability
  // This can be adjusted if you handle Date objects on the client
  const host = {
    ...docData.host,
    joinedDate: docData.host.joinedDate?.toDate ? docData.host.joinedDate.toDate().toISOString() : docData.host.joinedDate,
  };
  
  const reviews = docData.reviews?.map((review: any) => ({
      ...review,
      // Convert timestamp if it exists, otherwise use as is
      date: review.date?.toDate ? review.date.toDate().toISOString() : review.date,
  })) || [];
  
  return {
    id: id,
    ...docData,
    host,
    reviews,
  } as Vehicle;
};

// Helper function to convert Firestore doc data to a User object
const toUser = (docData: any, id: string): User => {
    return {
        id,
        ...docData,
        joinedDate: docData.joinedDate?.toDate ? docData.joinedDate.toDate().toISOString() : docData.joinedDate,
    } as User;
}

// Helper function to convert Firestore doc data to a Booking object
const toBooking = (docData: any, id: string): Booking => {
    // Manually reconstruct the vehicle object from the booking data
    const vehicleData = docData.vehicle || {};
    const vehicle: Vehicle = {
        id: vehicleData.id || '',
        name: vehicleData.name || '',
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year || 0,
        type: vehicleData.type || '',
        pricePerDay: vehicleData.pricePerDay || 0,
        location: vehicleData.location || '',
        rating: vehicleData.rating || 0,
        reviewsCount: vehicleData.reviewsCount || 0,
        features: vehicleData.features || [],
        images: vehicleData.images || [],
        host: {
            id: vehicleData.host?.id || '',
            name: vehicleData.host?.name || '',
            email: vehicleData.host?.email || '',
            avatarUrl: vehicleData.host?.avatarUrl || '',
            isVerified: vehicleData.host?.isVerified || false,
            joinedDate: vehicleData.host?.joinedDate || '',
        },
        description: vehicleData.description || '',
        policies: vehicleData.policies || { cancellation: '', mileage: '', fuel: '' },
        reviews: vehicleData.reviews || [],
    };
    
    return {
        id,
        ...docData,
        vehicle, // Use the reconstructed vehicle object
        startDate: docData.startDate?.toDate ? docData.startDate.toDate().toISOString() : docData.startDate,
        endDate: docData.endDate?.toDate ? docData.endDate.toDate().toISOString() : docData.endDate,
        createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate().toISOString() : docData.createdAt,
    } as Booking;
};


interface VehicleFilters {
    type?: string;
    maxPrice?: number;
    features?: string[];
    minRating?: number;
    location?: string;
}

export async function getVehicles(count?: number, filters?: VehicleFilters): Promise<Vehicle[]> {
  try {
    const vehiclesCol = collection(db, 'vehicles');
    const queryConstraints: QueryConstraint[] = [];

    if (filters?.type && filters.type !== 'all') {
        queryConstraints.push(where('type', '==', filters.type.toLowerCase()));
    }
    if (filters?.maxPrice && filters.maxPrice < 1000) {
        queryConstraints.push(where('pricePerDay', '<=', filters.maxPrice));
    }
    if (filters?.minRating && filters.minRating > 0) {
        queryConstraints.push(where('rating', '>=', filters.minRating));
    }
    // Firestore does not support array-contains-all, so we filter features in memory.
    // For a more scalable solution, a different data structure or a third-party search service would be needed.
    
    // Note: If combining multiple inequality filters (e.g., price and rating), 
    // Firestore requires a composite index. One has been pre-configured in firestore.indexes.json for (type, pricePerDay).
    
    if (count) {
      queryConstraints.push(limit(count));
    }

    const q = query(vehiclesCol, ...queryConstraints);
    const vehicleSnapshot = await getDocs(q);
    
    let vehicleList = vehicleSnapshot.docs.map(doc => toVehicle(doc.data(), doc.id));

    // In-memory filtering for features and location
    if (filters?.features && filters.features.length > 0) {
        vehicleList = vehicleList.filter(vehicle => 
            filters.features!.every(feature => 
                vehicle.features.map(f => f.toLowerCase()).includes(feature.toLowerCase())
            )
        );
    }
     if (filters?.location) {
        vehicleList = vehicleList.filter(vehicle => 
            vehicle.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
    }
    
    return vehicleList;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const vehicleDocRef = doc(db, 'vehicles', id);
    const vehicleSnapshot = await getDoc(vehicleDocRef);

    if (vehicleSnapshot.exists()) {
      return toVehicle(vehicleSnapshot.data(), vehicleSnapshot.id);
    } else {
      console.warn(`No vehicle found with id: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching vehicle with id ${id}:`, error);
    return null;
  }
}

export async function getVehiclesByHost(hostId: string): Promise<Vehicle[]> {
    try {
        const vehiclesCol = collection(db, 'vehicles');
        const q = query(vehiclesCol, where('host.id', '==', hostId));
        const vehicleSnapshot = await getDocs(q);
        const vehicleList = vehicleSnapshot.docs.map(doc => toVehicle(doc.data(), doc.id));
        return vehicleList;
    } catch (error) {
        console.error(`Error fetching vehicles for host ${hostId}:`, error);
        return [];
    }
}

export async function getHost(id: string): Promise<User | null> {
  try {
    const hostDocRef = doc(db, 'hosts', id);
    const hostSnapshot = await getDoc(hostDocRef);

    if (hostSnapshot.exists()) {
      return toUser(hostSnapshot.data(), hostSnapshot.id);
    } else {
      console.warn(`No host found with id: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching host with id ${id}:`, error);
    return null;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const usersCol = collection(db, 'hosts');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => toUser(doc.data(), doc.id));
    return userList;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}


export async function addVehicle(vehicleData: Omit<Vehicle, 'id' | 'rating' | 'reviewsCount' | 'reviews'>) {
    try {
        const vehiclesCol = collection(db, 'vehicles');
        // Add createdAt timestamp for new documents
        const docData = {
            ...vehicleData,
            createdAt: serverTimestamp(),
            rating: 0,
            reviewsCount: 0,
            reviews: []
        };
        const docRef = await addDoc(vehiclesCol, docData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding vehicle:", error);
        throw new Error('Failed to add vehicle to Firestore.');
    }
}


export async function updateVehicle(vehicleId: string, vehicleData: Partial<Omit<Vehicle, 'id'>>) {
    try {
        const vehicleDocRef = doc(db, 'vehicles', vehicleId);
        // Add updatedAt timestamp for updates
        const docData = {
            ...vehicleData,
            updatedAt: serverTimestamp()
        };
        await updateDoc(vehicleDocRef, docData);
    } catch (error) {
        console.error(`Error updating vehicle with id ${vehicleId}:`, error);
        throw new Error('Failed to update vehicle in Firestore.');
    }
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
    try {
        const vehicleDocRef = doc(db, 'vehicles', vehicleId);
        await deleteDoc(vehicleDocRef);
    } catch (error) {
        console.error(`Error deleting vehicle with id ${vehicleId}:`, error);
        throw new Error('Failed to delete vehicle from Firestore.');
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const hostsCol = collection(db, 'hosts');
    const q = query(hostsCol, where('email', '==', email), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return toUser(userDoc.data(), userDoc.id);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    return null;
  }
}

export async function addUser(userId: string, userData: Omit<User, 'id'>) {
    try {
        const userDocRef = doc(db, 'hosts', userId);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error("Error adding user:", error);
        throw new Error('Failed to add user to Firestore.');
    }
}

export async function addContactMessage(data: { name: string; email: string; message: string; }) {
    try {
        const contactsCol = collection(db, 'contacts');
        await addDoc(contactsCol, {
            ...data,
            submittedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding contact message:", error);
        throw new Error('Failed to save contact message.');
    }
}

export async function addBooking(bookingData: Omit<Booking, 'id'>) {
    try {
        const bookingsCol = collection(db, 'bookings');
        const docRef = await addDoc(bookingsCol, {
            ...bookingData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding booking:", error);
        throw new Error('Failed to add booking to Firestore.');
    }
}

export async function getBooking(bookingId: string): Promise<Booking | null> {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    const bookingSnapshot = await getDoc(bookingDocRef);

    if (bookingSnapshot.exists()) {
      return toBooking(bookingSnapshot.data(), bookingSnapshot.id);
    } else {
      console.warn(`No booking found with id: ${bookingId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching booking with id ${bookingId}:`, error);
    return null;
  }
}

export async function getBookingsForHost(hostId: string): Promise<Booking[]> {
    try {
        const bookingsCol = collection(db, 'bookings');
        const q = query(bookingsCol, where('vehicle.host.id', '==', hostId), orderBy('startDate', 'desc'));
        const bookingSnapshot = await getDocs(q);
        const bookingList = bookingSnapshot.docs.map(doc => toBooking(doc.data(), doc.id));
        return bookingList;
    } catch (error) {
        console.error(`Error fetching bookings for host ${hostId}:`, error);
        return [];
    }
}


export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'completed' | 'cancelled' | 'declined') {
    try {
        const bookingDocRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingDocRef, {
            status: status,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error(`Error updating booking status for bookingId ${bookingId}:`, error);
        throw new Error('Failed to update booking status in Firestore.');
    }
}

export async function banUser(userId: string, isBanned: boolean) {
  try {
    const userDocRef = doc(db, 'hosts', userId);
    await updateDoc(userDocRef, {
      isBanned: isBanned,
    });
  } catch (error) {
    console.error(`Error updating user ban status for userId ${userId}:`, error);
    throw new Error('Failed to update user ban status in Firestore.');
  }
}
