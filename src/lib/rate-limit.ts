import { getFirestore } from 'firebase-admin/firestore';
import { app } from '@/lib/firebase/admin-app';

export type RateLimitResult = { allowed: boolean; retryAfterSeconds?: number };

// Sliding window limiter using Firestore. Keyed by client IP + route id.
export async function allowRequest(routeId: string, clientKey: string, maxPerMinute: number = 60): Promise<RateLimitResult> {
    const db = getFirestore(app);
    const now = Date.now();
    const windowMs = 60 * 1000;
    const windowStart = now - windowMs;
    const docRef = db.collection('rate_limits').doc(`${routeId}__${clientKey}`);

    await db.runTransaction(async (tx) => {
        const snap = await tx.get(docRef);
        const data = snap.exists ? snap.data() as any : { hits: [] };
        const hits: number[] = (data.hits || []).filter((ts: number) => ts > windowStart);
        hits.push(now);
        tx.set(docRef, { hits }, { merge: true });
    });

    const updated = await docRef.get();
    const info = updated.data() as any;
    const hits: number[] = (info?.hits || []).filter((ts: number) => ts > windowStart);
    if (hits.length > maxPerMinute) {
        const earliest = Math.min(...hits);
        const retryAfter = Math.ceil((earliest + windowMs - now) / 1000);
        return { allowed: false, retryAfterSeconds: retryAfter > 0 ? retryAfter : 1 };
    }
    return { allowed: true };
}


