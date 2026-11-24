import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — UAF Desk Chapter & Student Helpline',
  description: 'Contact Anjuman Talaba-e-Islam (ATI) UAF Chapter. Visit our UAF Chapter Desk at Jinnah Hall, call our 24/7 student helpline, or submit an inquiry for student welfare grants and campus guidance.',
  keywords: [
    'Contact ATI UAF',
    'UAF Desk Chapter',
    'ATI Faisalabad Contact',
    'UAF Student Helpline',
    'Jinnah Hall UAF Desk',
    'Anjuman Talaba-e-Islam Phone'
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://atiuaf.com/contact',
    title: 'Contact ATI UAF — UAF Desk Chapter & Student Helpline',
    description: 'Reach our student council and chapter desk at University of Agriculture Faisalabad.',
    siteName: 'ATI UAF',
    images: [
      {
        url: '/images/student-power-logo.png',
        width: 666,
        height: 666,
        alt: 'Contact ATI UAF',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact ATI UAF — UAF Desk Chapter',
    description: 'Reach our student council and chapter desk at University of Agriculture Faisalabad.',
    images: ['/images/student-power-logo.png'],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
