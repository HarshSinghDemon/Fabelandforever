"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Star } from 'lucide-react';

const products = [
  {
    id: 'product-1',
    title: 'Teal Forest Sprite',
    price: '$28',
    category: 'Creature'
  },
  {
    id: 'product-2',
    title: 'Golden Honey Bear',
    price: '$42',
    category: 'Guardian'
  },
  {
    id: 'product-3',
    title: 'Fairy Blossom Set',
    price: '$24',
    category: 'Enchanted'
  }
];

export function FeaturedProducts() {
  return (
    <section id="shop" className="py-24 bg-white/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block p-2 bg-accent/10 rounded-full mb-4">
             <Star className="text-accent fill-accent w-5 h-5 animate-spin-slow" />
          </div>
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">The Enchanted Collection</span>
          <h2 className="font-fancy text-5xl md:text-6xl text-primary mb-6">Treasures to Keep</h2>
          <p className="text-muted-foreground text-lg italic max-w-lg mx-auto">
            "Every creation is a piece of a larger story waiting to be told in your home."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product) => {
            const imageData = PlaceHolderImages.find(img => img.id === product.id);
            return (
              <Card key={product.id} className="group border-none shadow-none bg-transparent overflow-visible">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] mb-8 border-[10px] border-white shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-primary/20">
                    <Image
                      src={imageData?.imageUrl || "https://picsum.photos/seed/tale/600/800"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint="teal crochet toy"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 p-3 rounded-full shadow-lg text-primary hover:bg-accent hover:text-white transition-all cursor-pointer">
                      <Heart className="w-5 h-5" />
                    </div>
                    {/* Soft Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-3 block">{product.category}</span>
                    <h3 className="font-bold text-2xl text-primary mb-2 group-hover:text-accent transition-colors">{product.title}</h3>
                    <p className="text-primary/60 font-medium text-lg mb-6">{product.price}</p>
                    <button className="bg-primary text-white font-bold px-10 py-3 rounded-full text-sm hover:bg-accent hover:text-accent-foreground transition-all shadow-lg hover:scale-105 active:scale-95">
                      Adopt Now ✨
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