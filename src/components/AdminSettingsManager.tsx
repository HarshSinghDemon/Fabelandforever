"use client";

import React, { useState, useMemo } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { SupabaseImageUpload } from './SupabaseImageUpload';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings, Sparkles, Image as ImageIcon, Loader2, Save, Trash2, LayoutGrid, Scissors, Wind, Info } from 'lucide-react';
import Image from 'next/image';

export function AdminSettingsManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const heroRef = useMemoFirebase(() => db ? doc(db, 'settings', 'hero') : null, [db]);

  const { data: heroSetting } = useDoc(heroRef);

  const defaultHeroImages = [
    "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/Gemini_Generated_Image_bx4li2bx4li2bx4l.png",
    "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/Gemini_Generated_Image_t8i3g7t8i3g7t8i3.png"
  ];

  const activeHeroImages = useMemo(() => {
    // If we have explicit values in Firestore, use them
    if (heroSetting?.values && heroSetting.values.length > 0) {
      return { images: heroSetting.values, isDefault: false };
    }
    // Otherwise, show the hardcoded defaults
    return { images: defaultHeroImages, isDefault: true };
  }, [heroSetting]);

  const addHeroImage = async (url: string) => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'hero'), {
        id: 'hero',
        values: arrayUnion(url),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Gallery Expanded ✨", description: "New visual added to the hero loop." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add image to gallery." });
    } finally {
      setIsSaving(false);
    }
  };

  const removeHeroImage = async (url: string) => {
    if (!db) return;
    setIsSaving(true);
    try {
      // If we are currently showing defaults and removing one, 
      // we need to initialize Firestore with the REMAINING defaults first
      if (activeHeroImages.isDefault) {
        const remainingDefaults = defaultHeroImages.filter(img => img !== url);
        await setDoc(doc(db, 'settings', 'hero'), {
          id: 'hero',
          values: remainingDefaults,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } else {
        // Otherwise just remove the specific URL from the existing array
        await updateDoc(doc(db, 'settings', 'hero'), {
          values: arrayRemove(url),
          updatedAt: new Date().toISOString()
        });
      }
      
      toast({ title: "Visual Withdrawn", description: "Image removed from the gallery loop globally." });
    } catch (error) {
      console.error("Remove error:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not remove image from the grimoire." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h3 className="font-headline text-5xl text-primary flex items-center justify-center gap-4">
          <Settings className="w-10 h-10 text-accent" /> Boutique Curation
        </h3>
        <p className="text-primary/40 font-bold uppercase tracking-[0.5em] text-[11px]">Managing the Visual Grimoire</p>
      </div>

      {/* Hero Gallery Section */}
      <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-primary/5 stitching-border space-y-12">
        <div className="flex items-center justify-between border-b border-primary/5 pb-8">
          <div className="space-y-2">
            <h4 className="font-headline text-3xl text-primary flex items-center gap-3">
              <LayoutGrid className="w-6 h-6 text-accent" /> Hero Gallery
            </h4>
            <p className="text-sm text-primary/40 italic font-medium leading-relaxed">
              "Curate the shifting atmosphere of your studio entry. Removing an image here removes it globally."
            </p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold uppercase tracking-widest text-primary/20">Active Visuals</p>
             <p className="font-headline text-2xl text-primary">{activeHeroImages.images.length}</p>
          </div>
        </div>

        {activeHeroImages.isDefault && (
          <div className="p-6 bg-accent/5 border border-accent/10 rounded-[2rem] flex items-center gap-4 text-accent">
            <Info className="w-5 h-5 shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Currently using Heritage Defaults. Removing one will set your custom gallery globally.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeHeroImages.images.map((url: string, idx: number) => (
            <div key={idx} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group border border-primary/5 shadow-sm">
              <Image src={url} alt={`Hero ${idx}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button 
                  onClick={() => removeHeroImage(url)}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-destructive hover:scale-110 transition-transform shadow-xl"
                  title="Remove Globally"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {activeHeroImages.isDefault && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 text-center border border-primary/5 rounded-xl pointer-events-none">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-primary/40">Heritage Default</span>
                </div>
              )}
            </div>
          ))}
          <SupabaseImageUpload 
            onUploadSuccess={addHeroImage}
            label=""
            className="aspect-[4/5]"
          />
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
