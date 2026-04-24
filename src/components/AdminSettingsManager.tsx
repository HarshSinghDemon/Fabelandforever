
"use client";

import React, { useState, useEffect } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, Loader2, Sparkles, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { uploadToSupabase } from '@/app/actions/supabase-upload';

export function AdminSettingsManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const heroSettingRef = doc(db, 'settings', 'hero');
  const { data: heroSetting, loading: loadingSetting } = useDoc(heroSettingRef);

  const [heroImageUrl, setHeroImageUrl] = useState('');

  useEffect(() => {
    if (heroSetting?.value) {
      setHeroImageUrl(heroSetting.value);
    }
  }, [heroSetting]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadToSupabase(formData);
      if (result.success && result.url) {
        setHeroImageUrl(result.url);
        toast({ title: "Visual Captured! ✨", description: "Hero photo uploaded successfully." });
      } else {
        throw new Error(result.error || "Failed to upload image");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(heroSettingRef, {
        value: heroImageUrl,
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast({ title: "Magic Applied! ✨", description: "The front page has been transformed." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save Failed", description: "Check your permissions." });
    } finally {
      setSaving(false);
    }
  };

  if (loadingSetting) {
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
        <h3 className="font-headline text-3xl text-primary">Front Page Settings</h3>
      </div>

      <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
        <CardContent className="p-12 space-y-10">
          <div className="space-y-6">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Current Hero Visual</Label>
            
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-muted border-2 border-primary/5 group">
              {heroImageUrl ? (
                <Image 
                  src={heroImageUrl} 
                  alt="Hero preview" 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                  <ImageIcon className="w-12 h-12" />
                  <p className="text-xs font-medium italic">No hero image set</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Input 
                placeholder="Hero Image URL..." 
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                className="h-14 rounded-2xl border-2 border-primary/5 bg-muted/20 flex-1 truncate"
              />
              <div className="relative">
                <input 
                  type="file" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  accept="image/*" 
                  disabled={uploading} 
                />
                <Button type="button" variant="outline" className="h-14 w-14 rounded-2xl border-2 border-primary/5 shadow-sm">
                  {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                </Button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSaveSettings}
            disabled={saving || uploading}
            className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
            {saving ? "Weaving Reality..." : "Update Front Page"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
