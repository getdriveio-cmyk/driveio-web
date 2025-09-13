import { NextRequest, NextResponse } from 'next/server';
import { getVehiclesAdmin } from '@/lib/firestore-admin';
import { verifyAppCheckToken } from '@/lib/firebase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const appCheckToken = req.headers.get('X-Firebase-AppCheck') || req.headers.get('x-firebase-appcheck') || undefined;
    const { valid } = await verifyAppCheckToken(appCheckToken);
    if (!valid) {
      return NextResponse.json({ error: 'App Check verification failed' }, { status: 401 });
    }
    const body = await req.json().catch(() => ({}));
    const { count, ...filters } = body || {};
    const vehicles = await getVehiclesAdmin(typeof count === 'number' ? count : undefined, filters);
    return NextResponse.json({ vehicles });
  } catch (e) {
    console.error('Search API error:', e);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}


