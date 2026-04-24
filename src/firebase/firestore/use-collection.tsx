
'use client';

import { useState, useEffect } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData,
  CollectionReference
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T & { id: string })));
        setLoading(false);
      },
      (error: any) => {
        if (error.code === 'permission-denied') {
          // Attempt to extract a clean path from the query object
          let path = 'unknown collection';
          try {
            // Safely try to find path info in various SDK versions/internal structures
            path = (query as any)._query?.path?.toString() || (query as any).path || 'collection';
          } catch (e) {}
          
          const permissionError = new FirestorePermissionError({
            path: path,
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading };
}
