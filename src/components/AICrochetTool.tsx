"use client";

import React, { useState } from 'react';
import { generateCustomCrochetIdeas } from '@/ai/flows/generate-custom-crochet-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Wand2, BookOpen, Star, Heart, Scroll } from 'lucide-react';

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
    <div className="bg-white p-1 md:p-12 rounded-[4rem] border-[4px] border-accent/10 shadow-[0_50px_100px_-20px_rgba(45,115,107,0.1)] relative overflow-hidden group">
      {/* Decorative inner pattern */}
      <div className="absolute inset-4 border border-dashed border-accent/20 rounded-[3.5rem] pointer-events-none"></div>
      
      <div className="relative z-10 p-10">
        <div className="text-center mb-16">
          <div className="inline-block p-6 bg-accent/10 rounded-full mb-6 relative group-hover:scale-110 transition-transform duration-700">
            <div className="absolute inset-0 bg-accent/30 rounded-full animate-ping opacity-20"></div>
            <BookOpen className="text-primary w-10 h-10 relative z-10" />
          </div>
          <h3 className="font-fancy text-5xl text-primary mb-4">Inspiration Grimoire 📖</h3>
          <p className="text-lg text-muted-foreground font-medium italic">"Whisper your wishes, and let the magical loops reveal themselves."</p>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-10 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {[
              { id: 'itemType', label: 'I dream of a... 🧸', placeholder: 'e.g., Forest Dragon', value: formData.itemType, key: 'itemType' },
              { id: 'color', label: 'Color Magic 🎨', placeholder: 'e.g., Deep Teal & Gold', value: formData.color, key: 'color' },
              { id: 'style', label: 'Vibe Essence ✨', placeholder: 'e.g., Ethereal & Soft', value: formData.style, key: 'style' },
              { id: 'occasion', label: 'The Gift Of... 🎁', placeholder: 'e.g., A New Home', value: formData.occasion, key: 'occasion' }
            ].map((field) => (
              <div key={field.id} className="space-y-3">
                <Label htmlFor={field.id} className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 ml-4">{field.label}</Label>
                <Input 
                  id={field.id}
                  placeholder={field.placeholder}
                  className="bg-paper border-2 border-primary/5 focus:border-accent rounded-[2rem] h-16 px-8 text-lg focus:ring-accent transition-all shadow-sm"
                  value={field.value}
                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  required={field.id === 'itemType'}
                />
              </div>
            ))}
          </div>
          
          <Button 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 h-24 rounded-[2.5rem] text-2xl font-bold group transition-all shadow-2xl shadow-primary/20 active:scale-[0.98] glow-hover"
          >
            {loading ? (
              <div className="flex items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span>Weaving Prophecies...</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Wand2 className="h-8 w-8 group-hover:rotate-45 transition-transform duration-500" />
                <span>Cast the Weaving Spell ✨</span>
              </div>
            )}
          </Button>
        </form>

        {ideas.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex items-center justify-center gap-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-accent/30"></div>
              <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.5em] flex items-center gap-3">
                <Scroll className="w-4 h-4" />
                Visions From The Loom
              </h4>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-accent/30"></div>
            </div>

            <div className="grid gap-6">
              {ideas.map((idea, idx) => (
                <div 
                  key={idx} 
                  className="p-10 bg-paper rounded-[3rem] border border-accent/10 text-primary font-medium text-xl leading-relaxed shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex items-start gap-6 group/item"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <span className="text-3xl group-hover/item:scale-150 group-hover/item:rotate-12 transition-all duration-500">📜</span>
                  {idea}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-8">
              <div className="p-4 bg-accent/10 rounded-full animate-bounce">
                <Heart className="text-accent fill-accent w-6 h-6" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating magic background elements */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/5 rounded-full blur-[80px] group-hover:bg-accent/10 transition-colors"></div>
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors"></div>
    </div>
  );
}