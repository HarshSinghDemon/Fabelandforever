"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ImagePlus, Loader2, X, CheckCircle2 } from 'lucide-react';
import { uploadToSupabase } from '@/app/actions/supabase-upload';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SupabaseImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
  className?: string;
}

export function SupabaseImageUpload({ 
  onUploadSuccess, 
  currentImageUrl, 
  label = "Upload Image",
  className 
}: SupabaseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadToSupabase(formData);
      if (result.success && result.url) {
        onUploadSuccess(result.url);
        toast({
          title: "Stitched to Cloud ✨",
          description: "Your image has been safely stored in the gallery.",
        });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Magic Interrupted",
        description: error.message || "We couldn't upload your loop photo.",
      });
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 block ml-2">{label}</label>}
      
      <div className="relative group">
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "relative aspect-[4/5] rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4 bg-paper",
            isUploading ? "border-accent/20 opacity-80" : "border-primary/5 hover:border-accent/30 group-hover:bg-accent/5",
            previewUrl ? "border-solid" : "p-12"
          )}
        >
          {previewUrl ? (
            <>
              <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <ImagePlus className="w-8 h-8 text-white" />
                <span className="text-white font-bold uppercase tracking-widest text-[10px]">Change Photo</span>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-primary">Click to Upload</p>
                <p className="text-[10px] text-primary/30 uppercase tracking-widest">PNG, JPG or WEBP</p>
              </div>
            </>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Weaving...</span>
            </div>
          )}
        </div>

        {previewUrl && !isUploading && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="absolute -top-3 -right-3 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-primary hover:text-destructive transition-colors border border-primary/5 z-30"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}