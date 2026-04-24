
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CustomOrder } from '@/components/CustomOrder';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedProducts />
      
      {/* Story / About Section */}
      <section id="story" className="py-24 bg-background border-y border-border overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-secondary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Our Philosophy</span>
            <h2 className="font-headline text-4xl md:text-5xl text-primary mb-8 leading-tight">
              We believe in the luxury of <br />
              <span className="italic">slow design</span> and the warmth <br />
              of human touch.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 text-left">
              <div>
                <h4 className="font-headline text-xl text-primary mb-4">Ethical Sourcing</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We only use sustainably harvested natural fibers and yarns from local independent producers.
                </p>
              </div>
              <div>
                <h4 className="font-headline text-xl text-primary mb-4">Timeless Beauty</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our designs transcend fleeting trends, focusing on classic silhouettes and lasting durability.
                </p>
              </div>
              <div>
                <h4 className="font-headline text-xl text-primary mb-4">Artisan Growth</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every order supports our local community of skilled artisans and their traditional craft.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-96 h-96 watercolor-accent rounded-full opacity-10"></div>
      </section>

      <CustomOrder />
      
      {/* Newsletter / CTA Section */}
      <section className="py-24 bg-background line-art-bg">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-primary rounded-3xl p-12 text-center text-primary-foreground shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <div className="relative z-10">
               <h2 className="font-headline text-4xl mb-6">Stay Inspired</h2>
               <p className="mb-10 text-primary-foreground/80 max-w-lg mx-auto">
                 Join our studio circle for exclusive previews of new collections and stories from behind the crochet hook.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                 <input 
                   type="email" 
                   placeholder="Your email address" 
                   className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                 />
                 <button className="bg-secondary text-white px-8 py-3 rounded-full hover:bg-secondary/90 transition-all font-medium whitespace-nowrap">
                   Join Us
                 </button>
               </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
