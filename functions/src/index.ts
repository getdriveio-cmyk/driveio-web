import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sharp from 'sharp';

admin.initializeApp();

export const ping = functions.https.onRequest((req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).send({ ok: true, ts: new Date().toISOString() });
});

// Generate thumbnails for images uploaded under vehicles/ and avatars/
export const generateThumbnails = functions.storage.object().onFinalize(async (object) => {
  const bucket = admin.storage().bucket(object.bucket);
  const filePath = object.name || '';
  const contentType = object.contentType || '';
  if (!contentType.startsWith('image/')) return;
  if (filePath.includes('_thumb.') || filePath.includes('_web.')) return;

  const file = bucket.file(filePath);
  const [buffer] = await file.download();

  // Create web size (max width 1600) and thumbnail (max width 400)
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

// Sync hosts/{uid}.isBanned -> Firebase Auth disabled flag
export const onHostUpdate = functions.firestore.document('hosts/{userId}').onUpdate(async (change, ctx) => {
  const before = change.before.data();
  const after = change.after.data();
  if (before?.isBanned === after?.isBanned) return;
  await admin.auth().updateUser(ctx.params.userId, { disabled: !!after?.isBanned });
});

// On booking status changes, add a timestamped activity record (analytics/tracking)
export const onBookingUpdate = functions.firestore.document('bookings/{bookingId}').onUpdate(async (change, ctx) => {
  const before = change.before.data();
  const after = change.after.data();
  if (before?.status === after?.status) return;
  await admin.firestore().collection('booking_activity').add({
    bookingId: ctx.params.bookingId,
    from: before?.status,
    to: after?.status,
    at: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Scheduled cleanup: remove pending bookings older than 48h
export const cleanStalePending = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const snap = await admin.firestore().collection('bookings')
    .where('status', '==', 'pending')
    .where('createdAt', '<', new Date(cutoff)).get();
  const batch = admin.firestore().batch();
  snap.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
});


