import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let isFirebaseInitialized = false;

try {
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
    isFirebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully with service account.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    isFirebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized via GOOGLE_APPLICATION_CREDENTIALS.');
  } else {
    console.log('ℹ️ Firebase credentials not provided in environment; operating in hybrid memory-persistent mode.');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin init notice (operating in standalone memory mode):', (error as Error).message);
}

export { admin, isFirebaseInitialized };
