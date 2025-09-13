
import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { cookies } from 'next/headers';
import { nextTick } from 'process';

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

const auth = async () => {
    const session = cookies().get('session')?.value;
    if (!session) {
        return { user: null };
    }
    
    try {
        const decodedIdToken = await getAuth(app).verifySessionCookie(session, true);
        const user = await getAuth(app).getUser(decodedIdToken.uid);
        return { user };
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return { user: null };
    }
}

export { auth };
