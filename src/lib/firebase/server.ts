
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { nextTick } from 'process';
import { app } from '@/lib/firebase/admin-app';

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

/**
 * Creates a Firebase session cookie from a client ID token and writes it.
 * Default expiration: 14 days.
 */
const setSessionCookie = async (idToken: string, expiresInMs: number = 14 * 24 * 60 * 60 * 1000) => {
    const sessionCookie = await getAuth(app).createSessionCookie(idToken, { expiresIn: expiresInMs });
    cookies().set('session', sessionCookie, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: Math.floor(expiresInMs / 1000),
    });
};

/**
 * Clears the auth session cookie.
 */
const clearSessionCookie = () => {
    cookies().delete('session');
};

export { auth, setSessionCookie, clearSessionCookie };
