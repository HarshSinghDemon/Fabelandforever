
"use client";

import React, { useState } from 'react';
import { generateCustomCrochetIdeas } from '@/ai/flows/generate-custom-crochet-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
    <div className="bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-primary/10 shadow-xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 watercolor-accent rounded-full opacity-20"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="text-primary w-5 h-5" />
          </div>
          <h3 className="font-headline text-2xl text-primary">Design Concierge</h3>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemType" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">What should we make?</Label>
              <Input 
                id="itemType"
                placeholder="e.g., Baby blanket, Wall hanging"
                className="bg-background/50 border-primary/20 focus:border-primary rounded-xl"
                value={formData.itemType}
                onChange={(e) => setFormData({...formData, itemType: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Color Palette</Label>
              <Input 
                id="color"
                placeholder="e.g., Sage and cream, Sunset"
                className="bg-background/50 border-primary/20 focus:border-primary rounded-xl"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Aesthetic Style</Label>
              <Input 
                id="style"
                placeholder="e.g., Boho-chic, Minimalist"
                className="bg-background/50 border-primary/20 focus:border-primary rounded-xl"
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Occasion</Label>
              <Input 
                id="occasion"
                placeholder="e.g., Wedding, Housewarming"
                className="bg-background/50 border-primary/20 focus:border-primary rounded-xl"
                value={formData.occasion}
                onChange={(e) => setFormData({...formData, occasion: e.target.value})}
              />
            </div>
          </div>
          
          <Button 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 py-6 rounded-xl text-lg group transition-all"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            )}
            Inspire Me
          </Button>
        </form>

        {ideas.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Tailored Suggestions:</h4>
            <div className="grid gap-3">
              {ideas.map((idea, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-background/80 rounded-xl border border-primary/5 text-sm text-foreground leading-relaxed shadow-sm hover:shadow-md transition-shadow"
                >
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
