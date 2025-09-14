import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/lib/firebase/admin-app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { auth } from '@/lib/firebase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { user } = await auth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getFirestore(app);
    const actorDoc = await db.collection('hosts').doc(user.uid).get();
    if (!actorDoc.exists || !(actorDoc.data() as any)?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let isBanned: boolean | null = null;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json().catch(() => ({} as any));
      isBanned = Boolean(body?.isBanned);
    } else {
      const form = await req.formData();
      const val = form.get('isBanned');
      isBanned = val === 'true' || val === '1' || val === 'on';
    }
    if (isBanned === null) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const targetId = params.userId;
    await db.collection('hosts').doc(targetId).set({ isBanned }, { merge: true });
    await getAuth(app).updateUser(targetId, { disabled: isBanned });

    const redirect = new URL('/admin/users', req.url);
    return NextResponse.redirect(redirect, 303);
  } catch (e) {
    console.error('Admin ban error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


