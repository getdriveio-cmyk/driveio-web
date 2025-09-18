import { NextRequest, NextResponse } from 'next/server';
import { getVehiclesAdmin } from '@/lib/firestore-admin';
import { allowRequest } from '@/lib/rate-limit';
import { vehicles } from '@/lib/mock-data';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Temporarily disable rate limiting until Firestore connection is fixed
    // const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';
    // const limit = await allowRequest('api_vehicles_get', ip, 60);
    // if (!limit.allowed) {
    //   return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds || 60) } as any });
    // }
    
    const { searchParams } = new URL(req.url);
    const countParam = searchParams.get('count');
    const count = countParam ? Number(countParam) : undefined;
    
    // Use mock data temporarily until Firestore connection is fixed
    let resultVehicles = vehicles;
    if (Number.isFinite(count as number) && count! > 0) {
      resultVehicles = vehicles.slice(0, count);
    }
    
    return NextResponse.json({ vehicles: resultVehicles });
  } catch (e) {
    console.error('Vehicles API error:', e);
    return NextResponse.json({ error: 'Failed to load vehicles' }, { status: 500 });
  }
}


