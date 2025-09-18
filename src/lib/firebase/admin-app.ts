import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { join } from 'path';

let app: App;

if (!getApps().length) {
  try {
    // Try to read the service account file
    const serviceAccountPath = join(process.cwd(), 'firebase-sa.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    app = initializeApp({ 
      credential: cert(serviceAccount),
      projectId: 'studio-2955014337-be726'
    });
  } catch (error) {
    console.warn('Could not load service account file, using default credentials:', error);
    // In GCP environments (App Hosting), default credentials are available
    app = initializeApp({
      projectId: 'studio-2955014337-be726'
    });
  }
} else {
  app = getApps()[0];
}

export { app };


