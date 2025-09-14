import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/lib/firebase/admin-app';
import { getFirestore } from 'firebase-admin/firestore';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getFirestore(app);
    const vehicleId = params.id;
    const { searchParams } = new URL(req.url);
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const from = fromParam ? new Date(fromParam) : null;
    const to = toParam ? new Date(toParam) : null;

    // Bookings (confirmed or pending) treated as unavailable
    const bookingsSnap = await db.collection('bookings')
      .where('vehicle.id', '==', vehicleId)
      .get();
    const booked = bookingsSnap.docs
      .map(d => d.data() as any)
      .filter(b => ['pending', 'confirmed'].includes(b.status))
      .map(b => ({ start: b.startDate, end: b.endDate, type: 'booking' }));

    // Blackouts
    const blackoutsSnap = await db.collection('vehicles').doc(vehicleId).collection('blackouts').get();
    const blackouts = blackoutsSnap.docs.map(d => ({ ...(d.data() as any), id: d.id, type: 'blackout' }));

    return NextResponse.json({ booked, blackouts });
  } catch (e) {
    console.error('Calendar API error:', e);
    return NextResponse.json({ error: 'Failed to load calendar' }, { status: 500 });
  }
}


