import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campus Activities & Event Gallery',
  description: 'Explore campus book fairs, free semester book banks, voluntary blood donation camps, declamation contests, and community welfare initiatives by ATI at the University of Agriculture, Faisalabad.',
  keywords: [
    'ATI UAF Activities',
    'UAF Campus Drives',
    'UAF Book Fair',
    'UAF Blood Donation Camp',
    'Anjuman Talaba-e-Islam Faisalabad Events',
    'Student Welfare Activities UAF'
  ],
  alternates: {
    canonical: '/activities',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://atiuaf.com/activities',
    title: 'Campus Activities & Event Gallery | ATI UAF',
    description: 'Explore student drives, free book banks, and campus events by ATI at University of Agriculture Faisalabad.',
    siteName: 'ATI UAF',
    images: [
      {
        url: '/images/student-power-logo.png',
        width: 666,
        height: 666,
        alt: 'ATI UAF Campus Activities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Activities & Events — ATI UAF',
    description: 'Explore student drives, free book banks, and campus events by ATI at University of Agriculture Faisalabad.',
    images: ['/images/student-power-logo.png'],
  },
};

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
