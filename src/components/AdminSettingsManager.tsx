
"use client";

import React, { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, Loader2, Sparkles, Layout, X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { uploadToSupabase } from '@/app/actions/supabase-upload';

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
      // Migrate old single value to array
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
          toast({ title: "Visual Captured! ✨", description: "Hero visual added to your collection." });
        } else {
          setCustomImageUrl(result.url!);
          toast({ title: "Visual Captured! ✨", description: "Custom section visual updated." });
        }
      } else {
        throw new Error(result.error || "Failed to upload image");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      if (type === 'hero') setUploadingHero(false);
      if (type === 'custom') setUploadingCustom(false);
    }
  };

  const removeHeroImage = (index: number) => {
    setHeroImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveSetting = async (type: 'hero' | 'custom') => {
    if (!db || !heroSettingRef || !customSettingRef) return;
    
    if (type === 'hero') setSavingHero(true);
    if (type === 'custom') setSavingCustom(true);

    try {
      if (type === 'hero') {
        await setDoc(heroSettingRef, {
          values: heroImages,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } else {
        await setDoc(customSettingRef, {
          value: customImageUrl,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      toast({ title: "Magic Applied! ✨", description: `The ${type} section has been transformed.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save Failed", description: "Check your permissions." });
    } finally {
      if (type === 'hero') setSavingHero(false);
      if (type === 'custom') setSavingCustom(false);
    }
  };

  if (loadingHero || loadingCustom) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <Layout className="text-accent w-6 h-6" />
        <h3 className="font-headline text-3xl text-primary">Studio Visuals</h3>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Hero Section Settings */}
        <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
          <CardContent className="p-12 space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sparkles className="text-accent w-5 h-5" />
                <h4 className="font-bold text-lg text-primary uppercase tracking-widest">Homepage Hero Gallery</h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
                {heroImages.length} Visuals in Rotation
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroImages.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/5 group">
                  <Image src={url} alt={`Hero ${idx}`} fill className="object-cover" />
                  <button 
                    onClick={() => removeHeroImage(idx)}
                    className="absolute top-3 right-3 p-2 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="relative aspect-video rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center gap-4 hover:border-accent transition-colors cursor-pointer bg-paper/30">
                <input 
                  type="file" 
                  onChange={(e) => handleImageUpload(e, 'hero')} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  accept="image/*" 
                  disabled={uploadingHero} 
                />
                {uploadingHero ? (
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                ) : (
                  <>
                    <div className="p-4 bg-white rounded-full shadow-sm">
                      <Plus className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Add Hero Visual</p>
                  </>
                )}
              </div>
            </div>

            <Button 
              onClick={() => handleSaveSetting('hero')}
              disabled={savingHero || uploadingHero || heroImages.length === 0}
              className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95"
            >
              {savingHero ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
              {savingHero ? "Weaving Reality..." : "Update Hero Rotation"}
            </Button>
          </CardContent>
        </Card>

        {/* Custom Section Settings */}
        <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
          <CardContent className="p-12 space-y-10">
            <div className="flex items-center gap-4">
              <Layout className="text-accent w-5 h-5" />
              <h4 className="font-bold text-lg text-primary uppercase tracking-widest">Custom Order Section Visual</h4>
            </div>
            
            <div className="space-y-6">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Current Custom Visual</Label>
              <div className="relative aspect-square max-w-md mx-auto w-full rounded-[2.5rem] overflow-hidden bg-muted border-2 border-primary/5 group">
                {customImageUrl ? (
                  <Image src={customImageUrl} alt="Custom preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                    <ImageIcon className="w-12 h-12" />
                    <p className="text-xs font-medium italic">No custom section image set</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Input 
                  placeholder="Custom Section Image URL..." 
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="h-14 rounded-2xl border-2 border-primary/5 bg-muted/20 flex-1 truncate"
                />
                <div className="relative">
                  <input type="file" onChange={(e) => handleImageUpload(e, 'custom')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" disabled={uploadingCustom} />
                  <Button type="button" variant="outline" className="h-14 w-14 rounded-2xl border-2 border-primary/5 shadow-sm">
                    {uploadingCustom ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleSaveSetting('custom')}
              disabled={savingCustom || uploadingCustom}
              className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95"
            >
              {savingCustom ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
              {savingCustom ? "Stitching Vision..." : "Update Custom Visual"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
