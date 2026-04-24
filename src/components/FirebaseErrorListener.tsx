
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Surface the error to the developer/admin
      toast({
        variant: "destructive",
        title: "Magic Boundary Encountered",
        description: `The loom blocked a ${error.context.operation} at ${error.context.path}. Check your Security Rules.`,
      });
      
      // In development, this will also be caught by the Next.js error overlay 
      // if we throw it here, but emitting is enough for UI feedback.
      console.error('Firestore Permission Denied:', error.context);
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
