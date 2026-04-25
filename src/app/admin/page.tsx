"use client";

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminProductManager } from '@/components/AdminProductManager';
import { AdminSettingsManager } from '@/components/AdminSettingsManager';
import { ShoppingBag, Settings, Package, Sparkles, Scroll, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20">
      <Navigation />
      
      {/* Admin Header */}
      <section className="relative pt-48 pb-12 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-paper to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="reveal-on-scroll active">
            <span className="text-white/40 font-bold tracking-[1em] uppercase text-[9px] mb-4 block">Master Weaver Access</span>
            <h1 className="font-headline text-5xl sm:text-7xl leading-none tracking-tighter mb-4">
              Studio <span className="italic">Control.</span>
            </h1>
            <div className="w-16 h-[1px] bg-white/20 mb-12"></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-7xl pb-40 -mt-10 relative z-20">
        <Tabs defaultValue="products" onValueChange={setActiveTab} className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white/80 backdrop-blur-xl p-2 h-auto rounded-[2rem] shadow-2xl border border-primary/5">
              <TabsTrigger 
                value="products" 
                className="rounded-full px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-[10px] font-bold uppercase tracking-widest gap-3"
              >
                <ShoppingBag className="w-4 h-4" /> Boutique
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="rounded-full px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-[10px] font-bold uppercase tracking-widest gap-3"
              >
                <Settings className="w-4 h-4" /> Curation
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="reveal-on-scroll active">
            <TabsContent value="products" className="mt-0 focus-visible:ring-0">
              <AdminProductManager />
            </TabsContent>
            <TabsContent value="settings" className="mt-0 focus-visible:ring-0">
              <AdminSettingsManager />
            </TabsContent>
          </div>
        </Tabs>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-white border-y border-primary/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Scroll, title: 'Order Scrolls', desc: 'View customer requests and delivery details.', link: '/checkout' },
              { icon: Sparkles, title: 'AI Grimoire', desc: 'Generate new inspiration for custom orders.', link: '/#shop' },
              { icon: ArrowRight, title: 'Public Boutique', desc: 'See how your collections appear to the world.', link: '/shop' }
            ].map((item, idx) => (
              <Link key={idx} href={item.link} className="group p-10 rounded-[3rem] bg-paper hover:bg-white border border-primary/5 transition-all hover:shadow-2xl hover:-translate-y-2">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-headline text-2xl text-primary mb-3">{item.title}</h4>
                <p className="text-xs text-primary/40 font-medium italic leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}