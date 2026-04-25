
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      const context = error.context;
      const path = context?.path?.toLowerCase() || '';
      const isPublicPath = 
        path.includes('products') || 
        path.includes('settings');
      
      const isReadOperation = 
        context?.operation === 'list' || 
        context?.operation === 'get';

      if (isPublicPath && isReadOperation) {
        console.error(
          `%c PUBLIC ACCESS BLOCKED: %c The treasures at ${path} are private. ` +
          `The artisan has attempted to open the grimoire. If you still see this, please click 'Publish' in your Firebase Console Rules tab.`,
          "color: white; background: red; font-weight: bold; padding: 4px; border-radius: 4px;",
          "color: red; font-weight: bold;"
        );
        
        toast({
          variant: "destructive",
          title: "Treasures are Hidden 🔒",
          description: "Your database rules are currently private. I've triggered a deployment, but you might need to manually Publish the rules in the Firebase Console.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Magic Boundary Encountered",
        description: `The loom blocked a ${context?.operation || 'action'} at ${path || 'unknown path'}. Check your Security Rules.`,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
