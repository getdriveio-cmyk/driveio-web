"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanStalePending = exports.onBookingUpdate = exports.onHostUpdate = exports.cleanupDerived = exports.generateThumbnails = exports.ping = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const storage_1 = require("firebase-functions/v2/storage");
const v2_1 = require("firebase-functions/v2");
const admin = __importStar(require("firebase-admin"));
const sharp_1 = __importDefault(require("sharp"));
admin.initializeApp();
(0, v2_1.setGlobalOptions)({ region: 'us-central1' });
exports.ping = (0, https_1.onRequest)((req, res) => {
    res.set('Cache-Control', 'no-store');
    res.status(200).send({ ok: true, ts: new Date().toISOString() });
});
// Generate thumbnails for images uploaded under vehicles/ and avatars/
exports.generateThumbnails = (0, storage_1.onObjectFinalized)({ memory: '512MiB', timeoutSeconds: 120 }, async (event) => {
    const bucket = admin.storage().bucket(event.data.bucket);
    const filePath = event.data.name || '';
    const contentType = event.data.contentType || '';
    if (!contentType.startsWith('image/'))
        return;
    if (filePath.includes('_thumb.') || filePath.includes('_web.'))
        return;
    const file = bucket.file(filePath);
    const [buffer] = await file.download();
    const [webBuf, thumbBuf] = await Promise.all([
        (0, sharp_1.default)(buffer).rotate().resize({ width: 1600, withoutEnlargement: true }).toFormat('jpeg', { quality: 82 }).toBuffer(),
        (0, sharp_1.default)(buffer).rotate().resize({ width: 400, withoutEnlargement: true }).toFormat('jpeg', { quality: 78 }).toBuffer(),
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
exports.cleanupDerived = (0, storage_1.onObjectDeleted)(async (event) => {
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
exports.onHostUpdate = (0, firestore_1.onDocumentUpdated)('hosts/{userId}', async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after)
        return;
    if (before.isBanned === after.isBanned)
        return;
    await admin.auth().updateUser(event.params.userId, { disabled: !!after.isBanned });
});
// On booking status changes, add a timestamped activity record (analytics/tracking)
exports.onBookingUpdate = (0, firestore_1.onDocumentUpdated)('bookings/{bookingId}', async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after)
        return;
    if (before.status === after.status)
        return;
    await admin.firestore().collection('booking_activity').add({
        bookingId: event.params.bookingId,
        from: before.status,
        to: after.status,
        at: admin.firestore.FieldValue.serverTimestamp(),
    });
});
// Scheduled cleanup: remove pending bookings older than 48h
exports.cleanStalePending = (0, scheduler_1.onSchedule)('every 24 hours', async () => {
    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    const snap = await admin.firestore().collection('bookings')
        .where('status', '==', 'pending')
        .where('createdAt', '<', new Date(cutoff)).get();
    const batch = admin.firestore().batch();
    snap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
});
