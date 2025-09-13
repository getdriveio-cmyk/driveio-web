import { NextRequest, NextResponse } from 'next/server';
import { getVehiclesAdmin } from '@/lib/firestore-admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const filters = await req.json();
    const vehicles = await getVehiclesAdmin(undefined, filters);
    return NextResponse.json({ vehicles });
  } catch (e) {
    console.error('Search API error:', e);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}


