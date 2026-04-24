
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';
import React from 'react';

export function initializeFirebase() {
  // Check if we have a valid API key. During Vercel build, these might be missing.
  // We return nulls to prevent the build from crashing.
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    return { app, db, auth, storage };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

/**
 * Hook to memoize Firebase references/queries to prevent infinite re-render loops.
 * Use this when creating collection() or doc() references inside components.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  return React.useMemo(factory, deps);
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
