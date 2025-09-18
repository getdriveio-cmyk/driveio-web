import { NextRequest, NextResponse } from 'next/server';
import { getVehiclesAdmin } from '@/lib/firestore-admin';
import { allowRequest } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Re-enable rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';
    const limit = await allowRequest('api_vehicles_get', ip, 60);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds || 60) } as any });
    }
    
    const { searchParams } = new URL(req.url);
    const countParam = searchParams.get('count');
    const count = countParam ? Number(countParam) : undefined;
    
    // Use only Firestore data - no fallback to mock data
    const vehicles = await getVehiclesAdmin(Number.isFinite(count as number) ? (count as number) : undefined);
    return NextResponse.json({ vehicles });
  } catch (e) {
    console.error('Vehicles API error:', e);
    return NextResponse.json({ error: 'Failed to load vehicles' }, { status: 500 });
  }
}


