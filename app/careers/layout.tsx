import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Us — Student Volunteer & Membership Induction',
  description: 'Apply for voluntary membership with Anjuman Talaba-e-Islam (ATI) at the University of Agriculture, Faisalabad. Join academic study circles, student rights advocacy, free book bank network, and campus representation.',
  keywords: [
    'Join ATI UAF',
    'ATI Membership UAF',
    'University of Agriculture Faisalabad Volunteer',
    'Student Power Membership',
    'Anjuman Talaba-e-Islam Induction'
  ],
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://atiuaf.com/careers',
    title: 'Join ATI UAF — Student Volunteer & Membership Induction',
    description: 'Apply online for voluntary membership in ATI at University of Agriculture Faisalabad. Free student mentorship, book bank support, and leadership development.',
    siteName: 'ATI UAF',
    images: [
      {
        url: '/images/student-power-logo.png',
        width: 666,
        height: 666,
        alt: 'Join ATI UAF Membership Induction',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join ATI UAF — Student Volunteer & Membership Induction',
    description: 'Become an official member of ATI at University of Agriculture Faisalabad.',
    images: ['/images/student-power-logo.png'],
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
