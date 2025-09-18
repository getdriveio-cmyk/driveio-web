import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { storage } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const healthData = {
    timestamp: new Date().toISOString(),
    services: {
      firestore: false,
      storage: false,
      auth: false,
      functions: false,
    },
    status: 'unhealthy' as 'healthy' | 'degraded' | 'unhealthy',
    responseTime: Date.now(),
  };

  let healthyServices = 0;
  const totalServices = Object.keys(healthData.services).length;

  try {
    // Test Firestore
    try {
      await db.enableNetwork();
      healthData.services.firestore = true;
      healthyServices++;
    } catch (error) {
      console.warn('Firestore health check failed:', error);
    }

    // Test Auth
    try {
      // Just check if auth is initialized
      if (auth.app) {
        healthData.services.auth = true;
        healthyServices++;
      }
    } catch (error) {
      console.warn('Auth health check failed:', error);
    }

    // Test Storage
    try {
      // Check if storage is initialized
      if (storage.app) {
        healthData.services.storage = true;
        healthyServices++;
      }
    } catch (error) {
      console.warn('Storage health check failed:', error);
    }

    // Test Functions (ping endpoint)
    try {
      const functionsResponse = await fetch(
        'https://ping-wvxqbnfxca-uc.a.run.app',
        { 
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        }
      );
      if (functionsResponse.ok) {
        healthData.services.functions = true;
        healthyServices++;
      }
    } catch (error) {
      console.warn('Functions health check failed:', error);
    }

    // Determine overall status
    if (healthyServices === totalServices) {
      healthData.status = 'healthy';
    } else if (healthyServices > 0) {
      healthData.status = 'degraded';
    } else {
      healthData.status = 'unhealthy';
    }

    healthData.responseTime = Date.now() - healthData.responseTime;

    // Return appropriate HTTP status
    const httpStatus = healthData.status === 'healthy' ? 200 : 
                      healthData.status === 'degraded' ? 207 : 503;

    return NextResponse.json(healthData, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      ...healthData,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - healthData.responseTime,
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  }
}
