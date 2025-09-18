import { NextRequest, NextResponse } from 'next/server';
import { getVehiclesAdmin } from '@/lib/firestore-admin';
import { verifyAppCheckToken } from '@/lib/firebase/server';
import { allowRequest } from '@/lib/rate-limit';
import { vehicles } from '@/lib/mock-data';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const appCheckToken = req.headers.get('X-Firebase-AppCheck') || req.headers.get('x-firebase-appcheck') || undefined;
    const { valid } = await verifyAppCheckToken(appCheckToken);
    const enforce = process.env.APP_CHECK_ENFORCE === 'true';
    if (enforce && !valid) {
      return NextResponse.json({ error: 'App Check verification failed' }, { status: 401 });
    }
    // Temporarily disable rate limiting until Firestore authentication is fixed
    // const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';
    // const limit = await allowRequest('api_search', ip, 30);
    // if (!limit.allowed) {
    //   return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds || 60) } as any });
    // }
    
    const body = await req.json().catch(() => ({}));
    const { count, ...filters } = body || {};
    
    // Try to use real Firestore data, fallback to mock data
    try {
      const firestoreVehicles = await getVehiclesAdmin(typeof count === 'number' ? count : undefined, filters);
      return NextResponse.json({ vehicles: firestoreVehicles });
    } catch (firestoreError) {
      console.warn('Firestore unavailable, using mock data:', firestoreError);
      // Fallback to mock data with filtering
      let resultVehicles = vehicles;
      
      // Apply basic filtering
      if (filters.type) {
        resultVehicles = resultVehicles.filter(v => v.type === filters.type);
      }
      if (filters.location) {
        resultVehicles = resultVehicles.filter(v => 
          v.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.minPrice) {
        resultVehicles = resultVehicles.filter(v => v.pricePerDay >= filters.minPrice);
      }
      if (filters.maxPrice) {
        resultVehicles = resultVehicles.filter(v => v.pricePerDay <= filters.maxPrice);
      }
      
      // Apply count limit
      if (typeof count === 'number' && count > 0) {
        resultVehicles = resultVehicles.slice(0, count);
      }
      
      return NextResponse.json({ vehicles: resultVehicles });
    }
  } catch (e) {
    console.error('Search API error:', e);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}


