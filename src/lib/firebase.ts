// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArOdztwUTpSu1Ct1WlbYWeHnel6eqjb2I",
  authDomain: "studio-2955014337-be726.firebaseapp.com",
  projectId: "studio-2955014337-be726",
  storageBucket: "studio-2955014337-be726.firebasestorage.app",
  messagingSenderId: "859294258668",
  appId: "1:859294258668:web:fc32cbff35f21adb95dcc9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics and App Check only on the client side
if (typeof window !== 'undefined') {
  // Initialize Analytics
  try {
    getAnalytics(app);
  } catch (e) {
    console.warn('Analytics init failed', e);
  }
  
  // Initialize App Check with reCAPTCHA v3
  try {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY as string | undefined;
    if (siteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } else {
      console.warn('NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY not set - App Check disabled');
    }
  } catch (e) {
    // App Check init best-effort; don't crash client
    console.warn('App Check init failed', e);
  }
}


export { app, auth, db, storage };
