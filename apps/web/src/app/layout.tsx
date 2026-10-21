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
  metadataBase: new URL('https://yarvohotel.com'),
  title: {
    default: 'Yarvo Hotel OS | Hotel Management System',
    template: '%s | Yarvo Hotel OS',
  },
  description:
    'Yarvo Hotel OS — Modern cloud and offline-first property management system for hotels, resorts, and hospitality businesses.',
  keywords: [
    'hotel management system',
    'property management system',
    'yarvo hotel',
    'hotel os',
    'hospitality pms',
    'hotel pos',
    'liberia hotel software'
  ],
  alternates: {
    canonical: 'https://yarvohotel.com',
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
    url: 'https://yarvohotel.com',
    siteName: 'Yarvo Hotel OS',
    title: 'Yarvo Hotel OS | Hotel Management System',
    description:
      'Yarvo Hotel OS — Modern cloud and offline-first property management system for hotels, resorts, and hospitality businesses.',
    images: [
      {
        url: '/yarvo-logo-new.png',
        width: 1200,
        height: 630,
        alt: 'Yarvo Hotel OS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yarvo Hotel OS | Hotel Management System',
    description:
      'Yarvo Hotel OS — Modern cloud and offline-first property management system for hotels, resorts, and hospitality businesses.',
    images: ['/yarvo-logo-new.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://yarvohotel.com/#software',
      name: 'Yarvo Hotel OS',
      url: 'https://yarvohotel.com',
      description:
        'Modern cloud and offline-first property management system for hotels, resorts, and hospitality businesses.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
    },
    {
      '@type': 'Organization',
      '@id': 'https://yarvohotel.com/#organization',
      name: 'Yarvo Hotel OS',
      url: 'https://yarvohotel.com',
      logo: 'https://yarvohotel.com/yarvo-logo-new.png',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://yarvohotel.com/#website',
      url: 'https://yarvohotel.com',
      name: 'Yarvo Hotel OS',
      publisher: {
        '@id': 'https://yarvohotel.com/#organization',
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
