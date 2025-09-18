
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import * as ts from 'typescript';
import { join } from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import 'dotenv/config';

// A helper function to dynamically import and transpile the TS mock data
async function importTsModule(modulePath) {
  const tsCode = await readFile(modulePath, 'utf8');
  const jsCode = ts.transpile(tsCode, { module: ts.ModuleKind.ESNext });
  const tempJsPath = `${modulePath}.mjs`;

  // Use a data URL to avoid writing temporary files to disk
  const dataUrl = `data:text/javascript;base64,${Buffer.from(jsCode).toString('base64')}`;

  // Dynamically import the transpiled code
  const module = await import(dataUrl);
  return module;
}


async function main() {
  console.log('Starting Firestore seeding process...');

  // Initialize Firebase Admin SDK using the same approach as admin-app.ts
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  try {
    // Try to read the service account file
    const serviceAccountPath = join(__dirname, '../firebase-sa.json');
    const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));
    initializeApp({ 
      credential: cert(serviceAccount),
      projectId: 'studio-2955014337-be726'
    });
  } catch (error) {
    console.warn('Could not read service account file, using default credentials:', error);
    // In GCP environments (App Hosting), default credentials are available
    initializeApp({ 
      projectId: 'studio-2955014337-be726'
    });
  }

  const db = getFirestore();
  console.log('Firebase Admin SDK initialized.');

  // Import mock data by transpiling it
  const mockData = await importTsModule(new URL('../src/lib/mock-data.ts', import.meta.url));
  const { hosts, vehicles, testimonials } = mockData;
  console.log('Successfully loaded mock data.');

  // Seed hosts
  console.log('Seeding hosts collection...');
  for (const host of hosts) {
    const { id, ...hostData } = host;
    await db.collection('hosts').doc(id).set(hostData);
    console.log(`  - Upserted host: ${host.name} (ID: ${id})`);
  }

  // Seed vehicles
  console.log('Seeding vehicles collection...');
  for (const vehicle of vehicles) {
    const { id, ...vehicleData } = vehicle;
    await db.collection('vehicles').doc(id).set(vehicleData);
    console.log(`  - Upserted vehicle: ${vehicle.name} (ID: ${id})`);
  }

  // Seed testimonials
  console.log('Seeding testimonials collection...');
  for (const testimonial of testimonials) {
    const { name, ...testimonialData } = testimonial;
    const docId = name.replace(/\s+/g, '_').toLowerCase();
    await db.collection('testimonials').doc(docId).set({ name, ...testimonialData });
    console.log(`  - Upserted testimonial: ${name} (ID: ${docId})`);
  }

  console.log('\nFirestore seeding completed successfully!');
}

main().catch((error) => {
  console.error('An error occurred during seeding:', error);
  process.exit(1);
});
