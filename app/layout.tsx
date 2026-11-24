import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SITE_METADATA } from '@/lib/data';

export const metadata: Metadata = {
  title: {
    default: `Student Power UAF — Anjuman Talaba-e-Islam (University of Agriculture Faisalabad)`,
    template: `%s | Student Power UAF`,
  },
  description: 'Official platform of Student Power — Anjuman Talaba-e-Islam (ATI) Chapter at the University of Agriculture, Faisalabad (UAF). Jinnah Hall, Jail Road, Faisalabad.',
  keywords: [
    'Student Power UAF',
    'ATI UAF',
    'Anjuman Talaba-e-Islam UAF',
    'University of Agriculture Faisalabad',
    'UAF Student Welfare',
    'Jinnah Hall UAF',
    'Student Rights UAF',
  ],
  authors: [{ name: 'Student Power' }],
  creator: 'Student Power Central Secretariat',
  metadataBase: new URL('https://studentpower.org.pk'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://studentpower.org.pk',
    title: `${SITE_METADATA.name} — Official Platform`,
    description: SITE_METADATA.description,
    siteName: SITE_METADATA.name,
    images: [
      {
        url: '/images/student-power-logo.png',
        width: 666,
        height: 666,
        alt: 'Student Power Official Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_METADATA.name,
    description: SITE_METADATA.description,
    images: ['/images/student-power-logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo-192.png',
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
        {/* JSON-LD Schema for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Student Power — ATI UAF',
              alternateName: 'Anjuman Talaba-e-Islam UAF Chapter',
              url: 'https://studentpower.org.pk',
              logo: 'https://studentpower.org.pk/images/student-power-logo.png',
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
      </body>
    </html>
  );
}
