"use client";

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Scroll, Gavel, Package, CreditCard, Mail, MapPin } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navigation />
      <div className="pt-40 pb-24 container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <Scroll className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-5xl md:text-7xl text-primary mb-6">Studio Terms</h1>
          <p className="text-muted-foreground italic">"Clear terms for a magical crochet journey."</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl space-y-12 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary flex items-center gap-3">
              <Gavel className="w-6 h-6 text-accent" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Fable and Forever, you agree to be bound by these Studio Terms. If you do not agree, please do not use our site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary flex items-center gap-3">
              <Package className="w-6 h-6 text-accent" /> 2. Handmade Nature
            </h2>
            <p>
              Every item in our boutique is hand-stitched. As such, slight variations in color, size, and pattern are to be expected and are part of the charm of bespoke crochet. No two creations are exactly alike.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-accent" /> 3. Orders and Payments
            </h2>
            <p>
              Custom orders require a consultation. Prices are listed in INR (₹). We reserve the right to refuse service or cancel orders at our discretion, particularly if the custom request falls outside our artistic scope.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary flex items-center gap-3">
              <MapPin className="w-6 h-6 text-accent" /> 4. Shipping and Delivery
            </h2>
            <p>
              <strong>Fable & Forever is based in Kolkata and currently only delivers within Kolkata city limits.</strong> Since each piece is made-to-order, delivery times vary. We do not accept returns on custom-commissioned items unless they arrive damaged. Please inspect your selection upon arrival and contact us immediately if there is a problem.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary">5. Intellectual Property</h2>
            <p>
              All patterns, designs, and imagery on this site are the property of Fable and Forever. They may not be used, reproduced, or sold without express written permission from the studio.
            </p>
          </section>

          <div className="pt-10 border-t border-primary/5">
            <p className="text-sm font-medium italic">
              Questions? Reach out to us at:
            </p>
            <div className="flex items-center gap-3 text-primary font-bold mt-2">
              <Mail className="w-5 h-5 text-accent" />
              <a href="mailto:fableandforevercompany@gmail.com">fableandforevercompany@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
