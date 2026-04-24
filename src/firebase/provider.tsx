
'use client';

import React, { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';

interface FirebaseContextType {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ 
  children, 
  app, 
  db, 
  auth,
  storage
}: { 
  children: React.ReactNode;
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
}) {
  return (
    <FirebaseContext.Provider value={{ app, db, auth, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebase must be used within FirebaseProvider');
  return context;
};

export const useFirestore = () => {
  const db = useFirebase().db;
  if (!db) throw new Error("Firestore not initialized. Check your environment variables.");
  return db;
};

export const useAuth = () => {
  const auth = useFirebase().auth;
  if (!auth) throw new Error("Auth not initialized. Check your environment variables.");
  return auth;
};

export const useFirebaseApp = () => {
  const app = useFirebase().app;
  if (!app) throw new Error("Firebase App not initialized. Check your environment variables.");
  return app;
};

export const useStorage = () => {
  const storage = useFirebase().storage;
  if (!storage) throw new Error("Storage not initialized. Check your environment variables.");
  return storage;
};
