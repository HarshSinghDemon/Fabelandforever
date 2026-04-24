
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';
import React from 'react';

/**
 * Initializes Firebase safely. 
 * During build time (SSR), it handles missing environment variables 
 * to prevent the build from failing.
 */
export function initializeFirebase() {
  // If we are on the server and the API key is missing (typical during Vercel build),
  // return dummy objects to prevent the Firebase SDK from throwing an error.
  if (typeof window === 'undefined' && !firebaseConfig.apiKey) {
    return {
      app: null as any as FirebaseApp,
      db: null as any as Firestore,
      auth: null as any as Auth,
      storage: null as any as FirebaseStorage
    };
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  return { app, db, auth, storage };
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
