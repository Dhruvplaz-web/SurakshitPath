/**
 * SurakshitPath Firebase Configuration
 * 
 * Configures Firebase App and Firebase Authentication with secure client-side
 * environment variable fallbacks and offline session caching.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeySurakshitPath2026PuneNight",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "surakshit-path-pune.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "surakshit-path-pune",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "surakshit-path-pune.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "987654321012",
  appId: env.VITE_FIREBASE_APP_ID || "1:987654321012:web:a1b2c3d4e5f6g7h8i9j0"
};

// Initialize Firebase safely (prevent re-initialization during hot module reloading)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
