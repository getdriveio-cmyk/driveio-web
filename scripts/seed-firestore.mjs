
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import * as ts from 'typescript';
import { pathToFileURL } from 'url';
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

  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY is not set in the environment variables.');
    console.error('Please ensure your .env file is correctly set up with the service account JSON.');
    process.exit(1);
  }

  // Initialize Firebase Admin SDK
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();
  console.log('Firebase Admin SDK initialized.');

  // Import mock data by transpiling it
  const mockData = await importTsModule(new URL('../src/lib/mock-data.ts', import.meta.url));
  const { hosts, vehicles } = mockData;
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

  console.log('\nFirestore seeding completed successfully!');
}

main().catch((error) => {
  console.error('An error occurred during seeding:', error);
  process.exit(1);
});
