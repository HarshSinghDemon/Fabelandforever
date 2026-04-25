"use client";

import React, { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, Loader2, Sparkles, Layout, Plus, Trash2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { uploadToSupabase } from '@/app/actions/supabase-upload';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function AdminSettingsManager() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [uploadingHero, setUploadingHero] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>([]);

  const [uploadingCustom, setUploadingCustom] = useState(false);
  const [savingCustom, setSavingCustom] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const heroSettingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'hero');
  }, [db]);
  
  const customSettingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'custom');
  }, [db]);
  
  const { data: heroSetting, loading: loadingHero } = useDoc(heroSettingRef);
  const { data: customSetting, loading: loadingCustom } = useDoc(customSettingRef);

  useEffect(() => {
    if (heroSetting?.values) {
      setHeroImages(heroSetting.values);
    } else if (heroSetting?.value) {
      setHeroImages([heroSetting.value]);
    }
  }, [heroSetting]);

  useEffect(() => {
    if (customSetting?.value) setCustomImageUrl(customSetting.value);
  }, [customSetting]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'custom') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'hero') setUploadingHero(true);
    if (type === 'custom') setUploadingCustom(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadToSupabase(formData);
      if (result.success && result.url) {
        if (type === 'hero') {
          setHeroImages(prev => [...prev, result.url!]);
          toast({ title: "Hero Vision Added ✨", description: "Visual linked to Supabase cloud." });
        } else {
          setCustomImageUrl(result.url!);
          toast({ title: "Custom Vision Updated ✨", description: "Banner visual stored in Supabase." });
        }
      } else {
        toast({ 
          variant: "destructive", 
          title: "Cloud Glitch", 
          description: result.error || "Failed to link to Supabase storage." 
        });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Connection Error", 
        description: "The magic threads to Supabase are disconnected." 
      });
    } finally {
      if (type === 'hero') setUploadingHero(false);
      if (type === 'custom') setUploadingCustom(false);
    }
  };

  const removeHeroImage = (index: number) => {
    setHeroImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveSetting = (type: 'hero' | 'custom') => {
    if (!db || !heroSettingRef || !customSettingRef) return;
    
    if (type === 'hero') setSavingHero(true);
    if (type === 'custom') setSavingCustom(true);

    const data = type === 'hero' 
      ? { values: heroImages, updatedAt: serverTimestamp() }
      : { value: customImageUrl, updatedAt: serverTimestamp() };

    const ref = type === 'hero' ? heroSettingRef : customSettingRef;

    setDoc(ref, data, { merge: true })
      .then(() => {
        toast({ title: "Site Transformed ✨", description: `The ${type} visions are now live.` });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'write',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        if (type === 'hero') setSavingHero(false);
        if (type === 'custom') setSavingCustom(false);
      });
  };

  if (loadingHero || loadingCustom) {
    return (
      <div className="flex justify-center py-40">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="flex items-center gap-4">
        <Layout className="text-accent w-6 h-6" />
        <h3 className="font-headline text-3xl text-primary">Supabase Cloud Visuals</h3>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Hero Gallery Section */}
        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className="space-y-2">
              <h4 className="font-bold text-xl text-primary uppercase tracking-widest">Hero Storyboard</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Managed via Supabase Storage</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {heroImages.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-[2.5rem] overflow-hidden group shadow-lg border-2 border-primary/5">
                <Image src={url} alt={`Hero ${idx}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => removeHeroImage(idx)}
                    className="p-4 bg-destructive text-white rounded-2xl shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="relative aspect-video rounded-[2.5rem] border-2 border-dashed border-primary/10 flex flex-col items-center justify-center gap-4 hover:border-accent transition-all cursor-pointer bg-paper/30 group">
              <input type="file" onChange={(e) => handleImageUpload(e, 'hero')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" disabled={uploadingHero} />
              {uploadingHero ? (
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              ) : (
                <>
                  <div className="p-5 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/30">Upload to Cloud</p>
                </>
              )}
            </div>
          </div>

          <Button 
            onClick={() => handleSaveSetting('hero')}
            disabled={savingHero || uploadingHero || heroImages.length === 0}
            className="w-full h-20 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
          >
            {savingHero ? <Loader2 className="animate-spin mr-3" /> : <Wand2 className="mr-3 h-5 w-5" />}
            {savingHero ? "Transforming Studio..." : "Apply Cloud Storyboard ✨"}
          </Button>
        </div>

        {/* Custom Section Visual */}
        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
          <h4 className="font-bold text-xl text-primary uppercase tracking-widest mb-16">Custom Section Banner</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-paper border-2 border-primary/5 shadow-inner">
              {customImageUrl ? (
                <Image src={customImageUrl} alt="Custom Preview" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/10 gap-4">
                  <ImageIcon className="w-16 h-16" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Cloud Vision</p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center space-y-10">
              <div className="space-y-4">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/40 ml-4">Upload Banner to Supabase</Label>
                <div className="relative">
                  <input type="file" onChange={(e) => handleImageUpload(e, 'custom')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" disabled={uploadingCustom} />
                  <Button type="button" variant="outline" className="h-20 w-full rounded-3xl border-2 border-dashed border-primary/10 group-hover:border-accent">
                    {uploadingCustom ? <Loader2 className="animate-spin mr-3" /> : <Plus className="w-5 h-5 text-accent mr-3" />}
                    {uploadingCustom ? "Uploading..." : "Select New Visual"}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => handleSaveSetting('custom')}
                disabled={savingCustom || uploadingCustom}
                className="w-full h-20 rounded-[2.5rem] bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
              >
                {savingCustom ? <Loader2 className="animate-spin mr-3" /> : <Sparkles className="mr-3 h-5 w-5" />}
                {savingCustom ? "Weaving Vision..." : "Manifest Banner ✨"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
