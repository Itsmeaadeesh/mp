import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_demo_key_skill_setu_2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skill-setu-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skill-setu-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skill-setu-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

let app: any;
let auth: any;
let db: any;
let storage: any;
let googleProvider: any;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
} catch (err) {
  console.warn('Firebase client initialized with local fallback provider:', err);
}

export { app, auth, db, storage, googleProvider };
