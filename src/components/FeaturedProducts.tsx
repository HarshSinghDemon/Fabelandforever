"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart } from 'lucide-react';

const products = [
  {
    id: 'product-1',
    title: 'Strawberry Sweetie',
    price: '$25',
    category: 'Amigurumi'
  },
  {
    id: 'product-2',
    title: 'Honey Bear Buddy',
    price: '$35',
    category: 'Plushie'
  },
  {
    id: 'product-3',
    title: 'Dreamy Flower Set',
    price: '$20',
    category: 'Cozy Decor'
  }
];

export function FeaturedProducts() {
  return (
    <section id="shop" className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-10 left-10 text-primary opacity-5 animate-pulse text-6xl">🧶</div>
      <div className="absolute bottom-10 right-10 text-primary opacity-5 animate-pulse text-6xl">✨</div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Take Home a Friend</span>
          <h2 className="font-fancy text-5xl md:text-6xl text-primary mb-6">Our Little Shop</h2>
          <p className="text-muted-foreground text-lg italic">
            "Every loop is a hug, every stitch is a kiss!"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product) => {
            const imageData = PlaceHolderImages.find(img => img.id === product.id);
            return (
              <Card key={product.id} className="group border-none shadow-none bg-transparent overflow-visible">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-6 border-[8px] border-secondary/20 shadow-xl group-hover:shadow-primary/10 transition-all">
                    <Image
                      src={imageData?.imageUrl || "https://picsum.photos/600/600"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint="cute crochet"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      <Heart className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <span className="text-[11px] uppercase tracking-widest text-primary font-bold mb-2 block">{product.category}</span>
                    <h3 className="font-bold text-2xl text-foreground mb-1">{product.title}</h3>
                    <p className="text-primary font-bold text-lg">{product.price}</p>
                    <button className="mt-4 bg-secondary text-secondary-foreground font-bold px-6 py-2 rounded-full text-sm hover:scale-105 transition-transform">
                      I want it! 🎀
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