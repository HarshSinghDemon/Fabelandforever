"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles, Heart, ArrowRight, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadToSupabase } from '@/app/actions/supabase-upload';

export function CustomOrder() {
  const bgImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too heavy",
        description: "Please share an image smaller than 5MB.",
      });
      return;
    }

    setUploading(true);
    setUploadedUrl(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadToSupabase(formData);

      if (result.success && result.url) {
        setUploadedUrl(result.url);
        toast({
          title: "Inspiration Captured! ✨",
          description: "Your reference image has been woven into our storage vault.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Interrupted",
        description: error.message || "Connection to the storage loom failed.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="custom" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-40"></div>
            <div className="relative z-10">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Bespoke Heirlooms</span>
              <h2 className="font-headline text-5xl md:text-7xl text-primary mb-8 leading-tight">Your Vision, <br /><span className="italic text-accent">Our Loops</span></h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-lg italic font-medium">
                "Every custom piece begins with a spark. Share your inspiration and let's create a forever loop together."
              </p>
              
              <div className="space-y-8 mb-12">
                {[
                  { step: '01', title: 'Fiber Selection', desc: 'Curating the softest ethically-sourced yarns for your vision.' },
                  { step: '02', title: 'Pattern Magic', desc: 'Translating your inspiration into a hand-crafted crochet chart.' },
                  { step: '03', title: 'The Final Stitch', desc: 'Execution with heirloom precision and a weaver\'s care.' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-8 group">
                    <span className="font-headline text-3xl text-accent/30 group-hover:text-accent transition-colors duration-500">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-primary text-xl mb-2">{item.title}</h4>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-accent/5 p-8 rounded-[2rem] stitching-border max-w-md">
                <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Share Your Inspiration
                </h4>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    disabled={uploading}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                  />
                  <div className="bg-white border-2 border-dashed border-accent/40 rounded-xl p-8 text-center group hover:border-accent transition-all duration-300">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Weaving into Storage...</span>
                      </div>
                    ) : uploadedUrl ? (
                      <div className="flex flex-col items-center gap-3 text-primary">
                        <CheckCircle2 className="w-8 h-8 text-primary animate-in zoom-in" />
                        <span className="text-xs font-bold uppercase tracking-widest">Image Secured ✨</span>
                        <div className="mt-2 text-[10px] text-muted-foreground break-all px-4 bg-muted/30 py-1 rounded-md line-clamp-1">
                          {uploadedUrl}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-accent/10 rounded-full group-hover:scale-110 transition-transform">
                          <Sparkles className="w-8 h-8 text-accent" />
                        </div>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Click or drag a photo</span>
                        <p className="text-[10px] text-muted-foreground">PNG, JPG or WEBP up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
                {!uploadedUrl && !uploading && (
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-primary/40 text-[9px] uppercase tracking-widest justify-center">
                      <AlertCircle className="w-3 h-3" />
                      Requires "uploads" bucket in Supabase
                    </div>
                  </div>
                )}
              </div>
              
              <Button asChild className="mt-12 bg-primary hover:bg-primary/90 text-white h-16 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all hover:scale-105">
                <a href="#contact">Start Your Consultation <ArrowRight className="ml-3 w-4 h-4" /></a>
              </Button>
            </div>
          </div>

          <div className="relative">
             <div className="relative aspect-square w-full rounded-[4rem] overflow-hidden border-[15px] border-white shadow-2xl transition-all duration-700 hover:-translate-y-2">
                <Image
                  src={bgImage?.imageUrl || "https://picsum.photos/seed/yarn-custom/800/800"}
                  alt="Luxury yarn and craft materials"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                
                <div className="absolute top-10 right-10 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-accent/10 floating">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-accent w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Master Weaver</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground italic">"Every loop is a promise of forever."</p>
                </div>

                <div className="absolute bottom-10 left-10 flex items-center gap-4">
                    <div className="bg-accent text-white p-5 rounded-full shadow-lg">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <div className="text-white">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Authentic</p>
                        <p className="font-headline text-2xl">Fiber Arts</p>
                    </div>
                </div>
             </div>
             <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
