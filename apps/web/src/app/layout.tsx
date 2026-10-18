import type { Metadata } from 'next';
import { Inter, Geist, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth-provider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { SyncProvider } from '@/lib/sync-provider';
import { CurrencyProvider } from '@/lib/currency';
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
  metadataBase: new URL('https://kwaleebeachresort.com'),
  title: {
    default: 'Kwalee Beach Resort | Beach Resort in Liberia',
    template: '%s | Kwalee Beach Resort',
  },
  description:
    'Discover Kwalee Beach Resort — a coastal destination in Liberia offering beach relaxation, poolside experiences, dining, drinks and unforgettable events by the ocean.',
  keywords: [
    'kwalee beach resort',
    'liberia beach resort',
    'marshall liberia',
    'beach resort liberia',
    'luxury resort liberia',
    'oceanfront tents',
    'beachfront resort liberia',
    'coastal getaway liberia'
  ],
  alternates: {
    canonical: 'https://kwaleebeachresort.com',
  },
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
    url: 'https://kwaleebeachresort.com',
    siteName: 'Kwalee Beach Resort',
    title: 'Kwalee Beach Resort | Beach Resort in Liberia',
    description:
      'Discover Kwalee Beach Resort — a coastal destination in Liberia offering beach relaxation, poolside experiences, dining, drinks and unforgettable events by the ocean.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kwalee Beach Resort',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kwalee Beach Resort | Beach Resort in Liberia',
    description:
      'Discover Kwalee Beach Resort — a coastal destination in Liberia offering beach relaxation, poolside experiences, dining, drinks and unforgettable events by the ocean.',
    images: ['/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Resort',
      '@id': 'https://kwaleebeachresort.com/#resort',
      name: 'Kwalee Beach Resort',
      url: 'https://kwaleebeachresort.com',
      description:
        'Discover Kwalee Beach Resort — a coastal destination in Liberia offering beach relaxation, poolside experiences, dining, drinks and unforgettable events by the ocean.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Marshall',
        addressRegion: 'Margibi County',
        addressCountry: 'LR',
      },
      telephone: '+231-00-000-000',
    },
    {
      '@type': 'Organization',
      '@id': 'https://kwaleebeachresort.com/#organization',
      name: 'Kwalee Beach Resort',
      url: 'https://kwaleebeachresort.com',
      logo: 'https://kwaleebeachresort.com/logo.jpg',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://kwaleebeachresort.com/#website',
      url: 'https://kwaleebeachresort.com',
      name: 'Kwalee Beach Resort',
      publisher: {
        '@id': 'https://kwaleebeachresort.com/#organization',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth", geist.variable, inter.variable, playfair.variable)} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <ToastProvider>
            <SyncProvider>
              <CurrencyProvider>
                {children}
              </CurrencyProvider>
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
