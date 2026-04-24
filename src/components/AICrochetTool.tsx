"use client";

import React, { useState } from 'react';
import { generateCustomCrochetIdeas } from '@/ai/flows/generate-custom-crochet-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Wand2, BookOpen, Star, Heart } from 'lucide-react';

export function AICrochetTool() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    itemType: '',
    color: '',
    style: '',
    occasion: ''
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemType) return;

    setLoading(true);
    try {
      const result = await generateCustomCrochetIdeas(formData);
      setIdeas(result.ideas);
    } catch (error) {
      console.error("Failed to generate ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[3rem] border-[3px] border-accent/20 shadow-2xl relative overflow-hidden stitching-border">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/15 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-accent/20 rounded-full mb-4 relative">
            <div className="absolute inset-0 bg-accent/40 rounded-full animate-ping opacity-20"></div>
            <BookOpen className="text-primary w-8 h-8 relative z-10" />
          </div>
          <h3 className="font-fancy text-4xl text-primary">Inspiration Grimoire 📖</h3>
          <p className="text-sm text-muted-foreground mt-3 font-medium">Whisper your wishes, and let the magic begin! ✨</p>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-8 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="itemType" className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-2">I dream of a... 🧸</Label>
              <Input 
                id="itemType"
                placeholder="e.g., Forest Dragon"
                className="bg-white border-2 border-primary/10 focus:border-accent rounded-2xl h-14 px-6 text-lg focus:ring-accent"
                value={formData.itemType}
                onChange={(e) => setFormData({...formData, itemType: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color" className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-2">Color Magic 🎨</Label>
              <Input 
                id="color"
                placeholder="e.g., Deep Teal & Lavender"
                className="bg-white border-2 border-primary/10 focus:border-accent rounded-2xl h-14 px-6 text-lg focus:ring-accent"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style" className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-2">Vibe Essence ✨</Label>
              <Input 
                id="style"
                placeholder="e.g., Ethereal & Soft"
                className="bg-white border-2 border-primary/10 focus:border-accent rounded-2xl h-14 px-6 text-lg focus:ring-accent"
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion" className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-2">The Gift Of... 🎁</Label>
              <Input 
                id="occasion"
                placeholder="e.g., A New Home"
                className="bg-white border-2 border-primary/10 focus:border-accent rounded-2xl h-14 px-6 text-lg focus:ring-accent"
                value={formData.occasion}
                onChange={(e) => setFormData({...formData, occasion: e.target.value})}
              />
            </div>
          </div>
          
          <Button 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 py-8 rounded-2xl text-xl font-bold group transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            ) : (
              <Wand2 className="mr-3 h-6 w-6 group-hover:rotate-45 transition-transform" />
            )}
            Cast the Spell ✨
          </Button>
        </form>

        {ideas.length > 0 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h4 className="text-[10px] font-bold text-accent text-center uppercase tracking-[0.4em]">Prophetic Visions:</h4>
            <div className="grid gap-4">
              {ideas.map((idea, idx) => (
                <div 
                  key={idx} 
                  className="p-6 bg-accent/5 rounded-3xl border border-accent/20 text-primary font-medium leading-relaxed shadow-sm hover:shadow-md transition-all flex items-start gap-4 group"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">📜</span>
                  {idea}
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <Heart className="text-accent animate-bounce w-5 h-5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}