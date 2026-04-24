
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Memoize initialization to ensure it only happens once on the client
  const firebase = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider 
      app={firebase.app} 
      db={firebase.db} 
      auth={firebase.auth} 
      storage={firebase.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
