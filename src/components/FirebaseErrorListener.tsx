
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      const isProductRead = error.context.path.includes('products') && error.context.operation === 'list';
      
      if (isProductRead) {
        console.warn('Public Access Restricted: Visitors cannot see your treasures yet. Please update Firestore rules to allow public read for the products collection.');
      } else {
        toast({
          variant: "destructive",
          title: "Magic Boundary Encountered",
          description: `The loom blocked a ${error.context.operation} at ${error.context.path}. Check your Security Rules.`,
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
