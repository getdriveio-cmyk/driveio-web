import 'server-only';
import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';

let app: App;

if (!getApps().length) {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (key) {
    try {
      const serviceAccount = JSON.parse(key);
      app = initializeApp({ credential: cert(serviceAccount) });
    } catch {
      app = initializeApp();
    }
  } else {
    // In GCP environments (App Hosting), default credentials are available
    app = initializeApp();
  }
} else {
  app = getApps()[0];
}

export { app };


