"use client";

import React, { useState } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SupabaseImageUpload } from './SupabaseImageUpload';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings, Sparkles, Image as ImageIcon, Loader2, Save } from 'lucide-react';

export function AdminSettingsManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const heroRef = useMemoFirebase(() => db ? doc(db, 'settings', 'hero') : null, [db]);
  const customRef = useMemoFirebase(() => db ? doc(db, 'settings', 'custom') : null, [db]);

  const { data: heroSetting } = useDoc(heroRef);
  const { data: customSetting } = useDoc(customRef);

  const updateSetting = async (id: string, value: any) => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', id), {
        id,
        value: typeof value === 'string' ? value : '',
        values: Array.isArray(value) ? value : [],
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Settings Weaved ✨", description: "Boutique visuals updated successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Glitch", description: "Could not update settings." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h3 className="font-headline text-4xl text-primary flex items-center justify-center gap-3">
          <Settings className="w-8 h-8 text-accent" /> Boutique Curation
        </h3>
        <p className="text-primary/40 font-bold uppercase tracking-[0.4em] text-[10px]">Managing the Visual Grimoire</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Hero Image Setting */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-primary/5 stitching-border space-y-8">
          <div className="space-y-2">
            <h4 className="font-headline text-2xl text-primary flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-accent" /> Hero Visual
            </h4>
            <p className="text-xs text-primary/40 italic font-medium leading-relaxed">
              "The first loop your visitors see. Choose a masterpiece."
            </p>
          </div>

          <SupabaseImageUpload 
            currentImageUrl={heroSetting?.value}
            onUploadSuccess={(url) => updateSetting('hero', url)}
          />
          
          <div className="pt-4 border-t border-dashed border-primary/5">
            <p className="text-[8px] font-bold uppercase tracking-widest text-primary/20 text-center">
              Recommended: 1920x1080px (Landscape)
            </p>
          </div>
        </div>

        {/* Custom Section Setting */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-primary/5 stitching-border space-y-8">
          <div className="space-y-2">
            <h4 className="font-headline text-2xl text-primary flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent" /> Custom Banner
            </h4>
            <p className="text-xs text-primary/40 italic font-medium leading-relaxed">
              "Showcase your bespoke talent in the personalization section."
            </p>
          </div>

          <SupabaseImageUpload 
            currentImageUrl={customSetting?.value}
            onUploadSuccess={(url) => updateSetting('custom', url)}
          />

          <div className="pt-4 border-t border-dashed border-primary/5">
            <p className="text-[8px] font-bold uppercase tracking-widest text-primary/20 text-center">
              Recommended: 1000x1000px (Square)
            </p>
          </div>
        </div>
      </div>

      {isSaving && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 z-[100]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Updating Boutique...</span>
        </div>
      )}
    </div>
  );
}