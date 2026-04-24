import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';
import React from 'react';

export function initializeFirebase() {
  // Check if we have a minimally valid config to prevent SDK crashes during build
  const hasValidConfig = 
    typeof firebaseConfig.apiKey === 'string' && 
    firebaseConfig.apiKey.length > 10 &&
    firebaseConfig.apiKey !== 'undefined';

  if (!hasValidConfig) {
    return { 
      app: null, 
      db: null, 
      auth: null, 
      storage: null 
    };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    return { app, db, auth, storage };
  } catch (error) {
    console.error("Firebase failed to initialize:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

/**
 * Hook to memoize Firebase references/queries to prevent infinite re-render loops.
 * Use this when creating collection() or doc() references inside components.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T | null {
  return React.useMemo(() => {
    // If any dependency (like db or auth) is null, don't execute the factory
    if (deps.some(d => d === null || d === undefined)) return null;
    return factory();
  }, deps);
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
