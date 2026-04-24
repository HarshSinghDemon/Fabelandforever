
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const products = [
  {
    id: 'product-1',
    title: 'Textured Heirloom Pillow',
    price: '$85',
    category: 'Home Decor'
  },
  {
    id: 'product-2',
    title: 'Minimalist Wall Tapestry',
    price: '$120',
    category: 'Art'
  },
  {
    id: 'product-3',
    title: 'Set of Azure Coasters',
    price: '$45',
    category: 'Dining'
  }
];

export function FeaturedProducts() {
  return (
    <section id="shop" className="py-24 bg-background line-art-bg">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-headline text-4xl md:text-5xl text-primary mb-6">Featured Creations</h2>
          <div className="w-24 h-px bg-secondary mx-auto mb-6"></div>
          <p className="text-muted-foreground">
            Each piece is meticulously hand-stitched over hours of dedicated craftsmanship, ensuring no two items are exactly alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((product) => {
            const imageData = PlaceHolderImages.find(img => img.id === product.id);
            return (
              <Card key={product.id} className="group border-none shadow-none bg-transparent overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-xl mb-6">
                    <Image
                      src={imageData?.imageUrl || "https://picsum.photos/600/600"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint="crochet item"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <button className="bg-background text-primary px-6 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-2 block">{product.category}</span>
                    <h3 className="font-headline text-xl text-primary mb-2">{product.title}</h3>
                    <p className="text-muted-foreground font-light">{product.price}</p>
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
