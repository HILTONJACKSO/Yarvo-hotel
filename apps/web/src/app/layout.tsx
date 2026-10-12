import type { Metadata } from 'next';
import { Inter, Geist, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth-provider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { SyncProvider } from '@/lib/sync-provider';
import Script from 'next/script';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Yarvo Hotel | Smarter Hotel Management',
    template: '%s | Yarvo Hotel',
  },
  description:
    'Yarvo is a strictly modular Property Management System (PMS) built for modern hotels, boutique resorts, and multi-property hospitality operators. Smarter hotel management.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yarvohotel.app',
    siteName: 'Yarvo Hotel',
    title: 'Yarvo Hotel | Smarter Hotel Management',
    description:
      'The strictly modular Property Management System. Run your property your exact way with unified PMS, POS, and real-time operations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Yarvo Hotel - Smarter Hotel Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yarvo Hotel | Smarter Hotel Management',
    description:
      'The strictly modular Property Management System. Run your property your exact way.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth", geist.variable, inter.variable, playfair.variable)} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <ToastProvider>
            <SyncProvider>
            {children}
          </SyncProvider>
          </ToastProvider>
        </AuthProvider>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", function() {
                  navigator.serviceWorker.register("/sw.js").catch(console.error);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
