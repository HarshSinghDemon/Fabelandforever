'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Define paths that are expected to be public
      const isPublicPath = 
        error.context.path.includes('products') || 
        error.context.path.includes('settings/hero');
      
      const isReadOperation = 
        error.context.operation === 'list' || 
        error.context.operation === 'get';

      // If a visitor can't read public data yet, we log it silently to the console 
      // instead of showing a disruptive toast.
      if (isPublicPath && isReadOperation) {
        console.warn(
          `Public Access Note: The loom is currently restricted at ${error.context.path}. ` +
          `To show this content to visitors, update your Firestore Rules to allow public read.`
        );
        return;
      }

      // For actual write failures or restricted admin data, show the toast.
      toast({
        variant: "destructive",
        title: "Magic Boundary Encountered",
        description: `The loom blocked a ${error.context.operation} at ${error.context.path}. Check your Security Rules.`,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
