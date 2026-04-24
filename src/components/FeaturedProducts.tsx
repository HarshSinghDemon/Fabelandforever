"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const products = [
  {
    id: 'product-1',
    title: 'Teal Forest Sprite',
    price: 32.00,
    category: 'Creature',
    image: '' 
  },
  {
    id: 'product-2',
    title: 'Golden Honey Bear',
    price: 48.00,
    category: 'Guardian',
    image: ''
  },
  {
    id: 'product-3',
    title: 'Fairy Blossom Set',
    price: 26.00,
    category: 'Enchanted',
    image: ''
  }
];

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    const imageData = PlaceHolderImages.find(img => img.id === product.id);
    addToCart({
      ...product,
      image: imageData?.imageUrl || "https://picsum.photos/seed/tale/600/800"
    });
    toast({
      title: "Basket Blessed! ✨",
      description: `${product.title} has joined your collection.`,
    });
  };

  return (
    <section id="shop" className="py-32 relative overflow-hidden bg-white/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-block p-4 bg-accent/40 rounded-full mb-8 relative">
             <div className="absolute inset-0 bg-accent/60 rounded-full animate-ping opacity-20"></div>
             <Star className="text-primary fill-primary w-6 h-6 relative z-10" />
          </div>
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-6 block">The Summer Solstice Drops</span>
          <h2 className="font-fancy text-6xl md:text-7xl text-primary mb-8">Ethereal Keepsakes</h2>
          <p className="text-muted-foreground text-xl italic max-w-xl mx-auto font-medium">
            "Hand-picked from the loom of our artisan hollow, just for you."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {products.map((product) => {
            const imageData = PlaceHolderImages.find(img => img.id === product.id);
            return (
              <Card key={product.id} className="group border-none shadow-none bg-transparent overflow-visible">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] mb-10 border-[12px] border-white shadow-xl transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-[0_40px_80px_-20px_rgba(45,115,107,0.2)]">
                    <Image
                      src={imageData?.imageUrl || "https://picsum.photos/seed/tale/600/800"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      data-ai-hint="teal crochet toy"
                    />
                    
                    {/* Floating Lavender Badge */}
                    <div className="absolute top-8 left-8 bg-accent/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold text-primary border border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                      Rare Craft ✨
                    </div>

                    <div className="absolute top-8 right-8 bg-white/95 p-4 rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all cursor-pointer group/heart active:scale-90 opacity-0 group-hover:opacity-100">
                      <Heart className="w-5 h-5 group-hover/heart:fill-current" />
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="w-3 h-3 text-accent" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">{product.category}</span>
                      <Sparkles className="w-3 h-3 text-accent" />
                    </div>
                    <h3 className="font-bold text-3xl text-primary mb-3 group-hover:text-accent transition-colors duration-500">{product.title}</h3>
                    <p className="text-primary/70 font-bold text-xl mb-8">${product.price.toFixed(2)}</p>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn-squish glow-hover bg-primary text-white font-bold px-12 py-4 rounded-[1.5rem] text-sm hover:shadow-2xl hover:shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
                    >
                      Adopt Treasure <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
