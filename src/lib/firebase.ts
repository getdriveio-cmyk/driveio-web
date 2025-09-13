// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

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

// Initialize Analytics only on the client side
if (typeof window !== 'undefined') {
  getAnalytics(app);
}


export { app, auth, db };
