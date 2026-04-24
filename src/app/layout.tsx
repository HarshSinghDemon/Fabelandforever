
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Crochet Studio | Handcrafted Comfort',
  description: 'Bespoke, handcrafted crochet items designed for elegance and comfort.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground scroll-smooth">
        {children}
      </body>
    </html>
  );
}
