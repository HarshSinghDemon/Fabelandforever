"use client";

import React, { useState } from 'react';
import { generateCustomCrochetIdeas } from '@/ai/flows/generate-custom-crochet-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Wand2, Heart, Star } from 'lucide-react';

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
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border-4 border-primary/10 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Star className="text-accent fill-accent w-6 h-6 floating-sparkle" />
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
            <Heart className="text-primary fill-primary w-6 h-6" />
          </div>
          <h3 className="font-fancy text-3xl text-primary">Inspiration Magic Box</h3>
          <p className="text-sm text-muted-foreground mt-2">Not sure what you want? Let's dream together! ✨</p>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="itemType" className="text-xs font-bold uppercase tracking-widest text-primary/60">I want to make a...</Label>
              <Input 
                id="itemType"
                placeholder="e.g., Smiley Strawberry"
                className="bg-white border-2 border-primary/10 focus:border-primary rounded-2xl h-12"
                value={formData.itemType}
                onChange={(e) => setFormData({...formData, itemType: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color" className="text-xs font-bold uppercase tracking-widest text-primary/60">Color Palette 🍭</Label>
              <Input 
                id="color"
                placeholder="e.g., Pastel rainbow"
                className="bg-white border-2 border-primary/10 focus:border-primary rounded-2xl h-12"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style" className="text-xs font-bold uppercase tracking-widest text-primary/60">Vibe Check ✨</Label>
              <Input 
                id="style"
                placeholder="e.g., Super Kawaii"
                className="bg-white border-2 border-primary/10 focus:border-primary rounded-2xl h-12"
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion" className="text-xs font-bold uppercase tracking-widest text-primary/60">For who/what? 🎁</Label>
              <Input 
                id="occasion"
                placeholder="e.g., Bestie's Bday"
                className="bg-white border-2 border-primary/10 focus:border-primary rounded-2xl h-12"
                value={formData.occasion}
                onChange={(e) => setFormData({...formData, occasion: e.target.value})}
              />
            </div>
          </div>
          
          <Button 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 py-7 rounded-2xl text-xl font-bold group transition-all shadow-lg shadow-primary/20"
          >
            {loading ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-6 w-6 group-hover:rotate-45 transition-transform" />
            )}
            Make Magic! ✨
          </Button>
        </form>

        {ideas.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-sm font-bold text-primary text-center uppercase tracking-[0.2em]">Magical Suggestions:</h4>
            <div className="grid gap-4">
              {ideas.map((idea, idx) => (
                <div 
                  key={idx} 
                  className="p-5 bg-white rounded-2xl border-2 border-primary/5 text-sm text-foreground leading-relaxed shadow-sm hover:shadow-md transition-shadow flex items-start gap-3"
                >
                  <span className="text-lg">🎀</span>
                  {idea}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}