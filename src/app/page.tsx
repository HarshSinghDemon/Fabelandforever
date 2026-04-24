import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CustomOrder } from '@/components/CustomOrder';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-dots">
      <Navigation />
      <Hero />
      
      {/* Whimsical Divider */}
      <div className="h-24 bg-gradient-to-b from-transparent to-white/50"></div>

      <FeaturedProducts />
      
      {/* Story / About Section */}
      <section id="story" className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">A Tale of Threads</span>
            <h2 className="font-fancy text-4xl md:text-5xl text-primary mb-8 leading-tight">
              Crafting stories, one <br />
              <span className="text-accent italic">magical loop</span> at a time.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 text-left">
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] stitching-border magic-shadow">
                <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                  <span>🌿</span> Fair Source
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use the softest, ethically harvested fibers that feel like a warm hug from nature herself.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] stitching-border magic-shadow">
                <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                  <span>📖</span> Storybound
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each creation is unique, carrying its own tiny history and character to your home.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] stitching-border magic-shadow">
                <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                  <span>✨</span> Artisan Magic
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Slow-made by hand, ensuring every stitch is filled with love, patience, and magic.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </section>

      <CustomOrder />
      
      {/* Newsletter / CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 text-center text-primary-foreground shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')] opacity-10"></div>
             <div className="relative z-10">
               <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Join the Studio Circle</span>
               <h2 className="font-fancy text-4xl md:text-5xl mb-6">Never miss a stitch!</h2>
               <p className="mb-10 text-primary-foreground/80 max-w-lg mx-auto font-medium">
                 Be the first to hear about new collection drops and magical crochet patterns from our dreamy valley.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                 <input 
                   type="email" 
                   placeholder="Your magical email address" 
                   className="flex-1 bg-white/20 border border-white/30 rounded-full px-8 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent/50 backdrop-blur-sm"
                 />
                 <button className="bg-accent text-accent-foreground px-10 py-4 rounded-full hover:bg-accent/90 transition-all font-bold whitespace-nowrap shadow-lg">
                   Subscribe ✨
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