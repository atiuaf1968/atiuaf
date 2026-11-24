import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { SITE_METADATA } from '@/lib/data';

export const viewport: Viewport = {
  themeColor: '#087A43',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: `ATI UAF — Anjuman Talaba-e-Islam | University of Agriculture Faisalabad`,
    template: `%s | ATI UAF`,
  },
  description: 'Official platform of Anjuman Talaba-e-Islam (ATI) UAF Chapter at the University of Agriculture, Faisalabad. Defending student rights, providing interest-free aid, blood society, and free book banks since 1968.',
  keywords: [
    'ATI UAF',
    'Anjuman Talaba-e-Islam UAF',
    'Student Power UAF',
    'University of Agriculture Faisalabad',
    'UAF Student Welfare',
    'UAF Desk Chapter',
    'Jinnah Hall UAF',
    'UAF Student Rights',
    'UAF Blood Donation',
    'UAF Book Bank',
    'Faisalabad Student Movement',
  ],
  authors: [{ name: 'Anjuman Talaba-e-Islam (ATI) UAF' }],
  creator: 'ATI UAF Central Secretariat',
  metadataBase: new URL('https://atiuaf.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ATI UAF',
  },
  alternates: {
    canonical: 'https://atiuaf.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://atiuaf.com',
    title: `ATI UAF — Anjuman Talaba-e-Islam | University of Agriculture Faisalabad`,
    description: SITE_METADATA.description,
    siteName: 'ATI UAF',
    images: [
      {
        url: '/images/student-power-logo.png',
        width: 666,
        height: 666,
        alt: 'ATI UAF Official Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATI UAF — Anjuman Talaba-e-Islam',
    description: SITE_METADATA.description,
    images: ['/images/student-power-logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo-192.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const isAdmin = headersList.get('x-is-admin') === 'true';

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ATI UAF" />
        {/* JSON-LD Schema for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Anjuman Talaba-e-Islam (ATI) UAF Chapter',
              alternateName: 'ATI UAF Student Power',
              url: 'https://atiuaf.com',
              logo: 'https://atiuaf.com/images/student-power-logo.png',
              description: SITE_METADATA.description,
              email: 'atiuafpak@gmail.com',
              telephone: '+923172011968',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Jinnah Hall, University of Agriculture (UAF), Jail Road',
                addressLocality: 'Faisalabad',
                addressCountry: 'PK',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-surface text-brand-black antialiased font-sans">
        {!isAdmin && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <PWAInstallPrompt />}
      </body>
    </html>
  );
}
