import { NextRequest, NextResponse } from 'next/server';
import { getVehiclesAdmin } from '@/lib/firestore-admin';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const countParam = searchParams.get('count');
    const count = countParam ? Number(countParam) : undefined;
    const vehicles = await getVehiclesAdmin(Number.isFinite(count as number) ? (count as number) : undefined);
    return NextResponse.json({ vehicles });
  } catch (e) {
    console.error('Vehicles API error:', e);
    return NextResponse.json({ error: 'Failed to load vehicles' }, { status: 500 });
  }
}


