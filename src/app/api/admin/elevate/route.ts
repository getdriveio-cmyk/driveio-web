import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/firebase/server';
import { app } from '@/lib/firebase/admin-app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

export const runtime = 'nodejs';

const ElevateSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  reason: z.string().optional(),
}).refine((v) => !!v.userId || !!v.email, { message: 'userId or email is required' });

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore(app);

    const body = await req.json().catch(() => ({}));
    const parsed = ElevateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const bootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN || '';
    const headerToken = req.headers.get('x-admin-bootstrap-token') || '';
    const usingBootstrap = !!bootstrapToken && headerToken && headerToken === bootstrapToken;

    let actorId: string | null = null;
    let actorEmail: string | null = null;
    let actorIsAdmin = false;

    if (!usingBootstrap) {
      const { user } = await auth();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      actorId = user.uid;
      actorEmail = user.email || null;
      const actorDoc = await db.collection('hosts').doc(user.uid).get();
      actorIsAdmin = !!actorDoc.exists && !!(actorDoc.data() as any)?.isAdmin;
      if (!actorIsAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Resolve target user
    let targetId: string | null = parsed.data.userId || null;
    let targetEmail: string | null = parsed.data.email || null;
    if (!targetId && targetEmail) {
      const q = await db.collection('hosts').where('email', '==', targetEmail).limit(1).get();
      if (q.empty) {
        return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
      }
      targetId = q.docs[0].id;
    }
    if (!targetId) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    const targetDoc = await db.collection('hosts').doc(targetId).get();
    if (targetDoc.exists) {
      const d = targetDoc.data() as any;
      if (!targetEmail) targetEmail = d?.email || null;
    }

    // Update Firestore flag
    await db.collection('hosts').doc(targetId).set({ isAdmin: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

    // Optional: set custom claims for convenience in client UI
    try {
      await getAuth(app).setCustomUserClaims(targetId, { isAdmin: true });
    } catch {}

    // Audit log
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    await db.collection('admin_audit').add({
      action: 'elevate',
      targetId,
      targetEmail: targetEmail || null,
      actorId: actorId,
      actorEmail: actorEmail,
      via: usingBootstrap ? 'bootstrap' : 'admin',
      reason: parsed.data.reason || null,
      at: FieldValue.serverTimestamp(),
      ip,
    });

    return NextResponse.json({ ok: true, userId: targetId });
  } catch (e) {
    console.error('Elevate admin error:', e);
    return NextResponse.json({ error: 'Failed to elevate user' }, { status: 500 });
  }
}


