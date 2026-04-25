import type {Metadata} from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FloatingContact } from '@/components/FloatingContact';

export const metadata: Metadata = {
  title: 'Fable & Forever | Artisanal Crochet Tales',
  description: 'Bespoke, luxury crochet creations woven with care and elegance. সুতোয় বোনা প্রতিটি গল্প।',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Pacifico&display=swap" rel="stylesheet" />
      </head>
      <body className="font-cute antialiased bg-background text-foreground scroll-smooth">
        <FirebaseClientProvider>
          <CartProvider>
            {children}
            <FloatingContact />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
