"use client";

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Lock, Eye, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navigation />
      <div className="pt-40 pb-24 container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-5xl md:text-7xl text-primary mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground italic">"Protecting your trust is the first stitch in our relationship."</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl space-y-12 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary">1. Information We Collect</h2>
            <p>
              When you visit Fable and Forever, we collect information you provide directly to us. This includes your name, email address, and message details when you use our contact form, as well as shipping information if you place an order.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your custom orders and inquiries.</li>
              <li>Communicate with you about your "forever loops."</li>
              <li>Improve our boutique experience.</li>
              <li>Send occasional updates if you've opted into our newsletter.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data. However, no method of transmission over the internet is 100% secure. We strive to use commercially acceptable means to protect your personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary">4. Cookies</h2>
            <p>
              We use essential cookies to manage your shopping basket and preferences. These are necessary for the basic functioning of the site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-3xl text-primary">5. Contact Us</h2>
            <p>
              If you have any questions about our privacy practices, please contact the Master Weaver at:
            </p>
            <div className="flex items-center gap-3 text-primary font-bold">
              <Mail className="w-5 h-5 text-accent" />
              <a href="mailto:fableandforevercompany@gmail.com">fableandforevercompany@gmail.com</a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
