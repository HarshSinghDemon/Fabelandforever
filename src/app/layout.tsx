import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cloudy Crochet | Handcrafted Cuteness',
  description: 'Bespoke, adorable crochet items designed to bring a smile to your face.',
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
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Pacifico&display=swap" rel="stylesheet" />
      </head>
      <body className="font-cute antialiased bg-background text-foreground scroll-smooth">
        {children}
      </body>
    </html>
  );
}