import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onObjectFinalized, onObjectDeleted } from 'firebase-functions/v2/storage';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import sharp from 'sharp';

admin.initializeApp();
setGlobalOptions({ region: 'us-central1' });

export const ping = onRequest((req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).send({ ok: true, ts: new Date().toISOString() });
});

// Generate thumbnails for images uploaded under vehicles/ and avatars/
export const generateThumbnails = onObjectFinalized({ memory: '512MiB', timeoutSeconds: 120 }, async (event) => {
  const bucket = admin.storage().bucket(event.data.bucket);
  const filePath = event.data.name || '';
  const contentType = event.data.contentType || '';
  if (!contentType.startsWith('image/')) return;
  if (filePath.includes('_thumb.') || filePath.includes('_web.')) return;

  const file = bucket.file(filePath);
  const [buffer] = await file.download();

  const [webBuf, thumbBuf] = await Promise.all([
    sharp(buffer).rotate().resize({ width: 1600, withoutEnlargement: true }).toFormat('jpeg', { quality: 82 }).toBuffer(),
    sharp(buffer).rotate().resize({ width: 400, withoutEnlargement: true }).toFormat('jpeg', { quality: 78 }).toBuffer(),
  ]);

  const base = filePath.replace(/\.[^/.]+$/, '');
  const webPath = `${base}_web.jpg`;
  const thumbPath = `${base}_thumb.jpg`;

  await Promise.all([
    bucket.file(webPath).save(webBuf, { contentType: 'image/jpeg', resumable: false, metadata: { cacheControl: 'public,max-age=31536000,immutable' } }),
    bucket.file(thumbPath).save(thumbBuf, { contentType: 'image/jpeg', resumable: false, metadata: { cacheControl: 'public,max-age=31536000,immutable' } }),
  ]);
});

// Cleanup derived files when original is deleted
export const cleanupDerived = onObjectDeleted(async (event) => {
  const bucket = admin.storage().bucket(event.data.bucket);
  const filePath = event.data.name || '';
  const base = filePath.replace(/\.[^/.]+$/, '');
  const webPath = `${base}_web.jpg`;
  const thumbPath = `${base}_thumb.jpg`;
  await Promise.allSettled([
    bucket.file(webPath).delete({ ignoreNotFound: true }),
    bucket.file(thumbPath).delete({ ignoreNotFound: true }),
  ]);
});

// Sync hosts/{uid}.isBanned -> Firebase Auth disabled flag
export const onHostUpdate = onDocumentUpdated('hosts/{userId}', async (event) => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();
  if (!before || !after) return;
  if (before.isBanned === after.isBanned) return;
  await admin.auth().updateUser(event.params.userId, { disabled: !!after.isBanned });
});

// On booking status changes, add a timestamped activity record (analytics/tracking)
export const onBookingUpdate = onDocumentUpdated('bookings/{bookingId}', async (event) => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();
  if (!before || !after) return;
  if (before.status === after.status) return;
  await admin.firestore().collection('booking_activity').add({
    bookingId: event.params.bookingId,
    from: before.status,
    to: after.status,
    at: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Scheduled cleanup: remove pending bookings older than 48h
export const cleanStalePending = onSchedule('every 24 hours', async () => {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const snap = await admin.firestore().collection('bookings')
    .where('status', '==', 'pending')
    .where('createdAt', '<', new Date(cutoff)).get();
  const batch = admin.firestore().batch();
  snap.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
});


