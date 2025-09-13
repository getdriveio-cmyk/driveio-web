import { NextRequest, NextResponse } from 'next/server';
import { getVehiclesAdmin } from '@/lib/firestore-admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { count, ...filters } = body || {};
    const vehicles = await getVehiclesAdmin(typeof count === 'number' ? count : undefined, filters);
    return NextResponse.json({ vehicles });
  } catch (e) {
    console.error('Search API error:', e);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}


