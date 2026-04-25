"use client";

import React, { useState } from 'react';
import { generateCustomCrochetIdeas } from '@/ai/flows/generate-custom-crochet-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Wand2, BookOpen, Star, Heart, Scroll, Feather } from 'lucide-react';

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
    <div className="bg-white p-1 sm:p-12 rounded-[3rem] sm:rounded-[5rem] border-[4px] border-primary/5 shadow-2xl relative overflow-hidden group stitching-border">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
      
      <div className="relative z-10 p-6 sm:p-12">
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-block p-6 bg-paper rounded-full mb-8 relative group-hover:scale-110 transition-transform duration-700 shadow-inner">
            <Feather className="text-accent w-10 h-10 relative z-10" />
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-20"></div>
          </div>
          <h3 className="font-headline text-4xl sm:text-6xl text-primary mb-6">Consult the <span className="italic">Grimoire</span> ✨</h3>
          <p className="text-lg text-primary/40 font-bold uppercase tracking-widest italic">"Whisper your wishes, let the AI weaver manifest visions."</p>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-8 sm:space-y-12 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
            {[
              { id: 'itemType', label: 'Item Essence 🧸', placeholder: 'e.g., A guardian dragon', value: formData.itemType, key: 'itemType' },
              { id: 'color', label: 'Color Magic 🎨', placeholder: 'e.g., Teal & Silver Dusk', value: formData.color, key: 'color' },
              { id: 'style', label: 'Style Vibe ✨', placeholder: 'e.g., Boho Vintage', value: formData.style, key: 'style' },
              { id: 'occasion', label: 'Purpose Of... 🎁', placeholder: 'e.g., A Housewarming Gift', value: formData.occasion, key: 'occasion' }
            ].map((field) => (
              <div key={field.id} className="space-y-3">
                <Label htmlFor={field.id} className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30 ml-6">{field.label}</Label>
                <Input 
                  id={field.id}
                  placeholder={field.placeholder}
                  className="bg-paper border-none border-b border-primary/10 rounded-none h-16 px-6 text-lg focus:border-accent transition-all font-headline placeholder:text-primary/10 focus-visible:ring-0"
                  value={field.value}
                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  required={field.id === 'itemType'}
                />
              </div>
            ))}
          </div>
          
          <Button 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 h-24 rounded-full text-xl font-bold group transition-all shadow-2xl shadow-primary/20 active:scale-[0.98] glow-hover"
          >
            {loading ? (
              <div className="flex items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="uppercase tracking-[0.4em] text-xs">Weaving Visions...</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Wand2 className="h-7 w-7 group-hover:rotate-45 transition-transform duration-500" />
                <span className="uppercase tracking-[0.4em] text-xs">Manifest Design Suggestions ✨</span>
              </div>
            )}
          </Button>
        </form>

        {ideas.length > 0 && (
          <div className="space-y-10 animate-fade-in-up">
            <div className="flex items-center justify-center gap-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-accent/30"></div>
              <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.6em] flex items-center gap-3">
                <Scroll className="w-4 h-4" />
                Visions From The Loom
              </h4>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-accent/30"></div>
            </div>

            <div className="grid gap-6">
              {ideas.map((idea, idx) => (
                <div 
                  key={idx} 
                  className="p-10 bg-paper rounded-[3rem] border border-primary/5 text-primary font-headline text-xl italic leading-relaxed shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-start gap-8 group/item"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <span className="text-3xl group-hover/item:scale-125 transition-all">📜</span>
                  {idea}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-8">
              <div className="p-4 bg-accent/10 rounded-full animate-float">
                <Heart className="text-accent fill-accent w-6 h-6" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-accent/20 pointer-events-none"></div>
      <div className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-accent/20 pointer-events-none"></div>
    </div>
  );
}