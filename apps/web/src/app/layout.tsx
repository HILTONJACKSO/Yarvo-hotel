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
  metadataBase: new URL('https://yarvohotel.com'),
  title: {
    default: 'Yarvo Hotel — Modular Property Management System (PMS)',
    template: '%s | Yarvo Hotel PMS',
  },
  description:
    'Modular Property Management System (PMS) built for modern hotels and resorts. Streamline reservations, guests, front desk, and billing with zero bloat.',
  keywords: [
    'hotel management system',
    'property management system',
    'hotel PMS',
    'modular hotel software',
    'hotel reservation software',
    'front desk management',
    'hospitality POS',
    'hotel billing software',
    'hotel operations'
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
    siteName: 'Yarvo Hotel PMS',
    title: 'Yarvo Hotel — Modular Property Management System (PMS)',
    description:
      'Modular Property Management System (PMS) built for modern hotels and resorts. Streamline reservations, guests, front desk, and billing with zero bloat.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Yarvo Hotel — Modular Property Management System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yarvo Hotel — Modular Property Management System (PMS)',
    description:
      'Modular Property Management System (PMS) built for modern hotels and resorts. Streamline reservations, guests, front desk, and billing with zero bloat.',
    images: ['/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://yarvohotel.com/#software',
      name: 'Yarvo Hotel PMS',
      operatingSystem: 'All (Cloud-native Web Application)',
      applicationCategory: 'BusinessApplication',
      url: 'https://yarvohotel.com',
      description:
        'A strictly modular Property Management System (PMS) designed for boutique hotels, luxury resorts, and multi-property operators.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        description: '14-day free trial, no credit card required',
      },
      featureList: [
        'Modular architecture',
        'Front desk & reservations management',
        'Guest CRM & history',
        'Unified Folio and billing',
        'Housekeeping & Maintenance tracking',
        'Integrated POS for restaurant and bar',
        'Night audit and financial reports',
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://yarvohotel.com/#organization',
      name: 'Yarvo Hotel',
      url: 'https://yarvohotel.com',
      logo: 'https://yarvohotel.com/yarvo-logo-new.png',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: 'https://yarvohotel.com/#contact',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://yarvohotel.com/#website',
      url: 'https://yarvohotel.com',
      name: 'Yarvo Hotel',
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
