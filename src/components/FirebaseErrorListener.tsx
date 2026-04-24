
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // We only toast for specific paths or if in an admin context to avoid 
      // spamming visitors if the rules aren't perfect yet.
      const isProductRead = error.context.path.includes('products') && error.context.operation === 'list';
      
      if (isProductRead) {
        console.warn('Shop Visibility: Visitors cannot see products. Update Firestore rules to allow public read.');
      } else {
        toast({
          variant: "destructive",
          title: "Magic Boundary Encountered",
          description: `The loom blocked a ${error.context.operation} at ${error.context.path}. Check your Security Rules.`,
        });
      }
      
      console.error('Firestore Permission Denied:', error.context);
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
