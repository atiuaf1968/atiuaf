import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  BookOpen,
  HeartHandshake,
  Heart,
  Award,
  Activity,
  ArrowRight,
  ShieldCheck,
  Users,
  Compass,
  CheckCircle2,
  Sparkles,
  Target,
  ChevronRight,
  Share2,
  Calendar,
  MapPin,
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { IslamicPattern } from '@/components/IslamicPattern';
import { SITE_METADATA } from '@/lib/data';
import { getActivitiesAsync } from '@/lib/activities';
import { ActivityItem } from '@/lib/types';

export const metadata: Metadata = {
  title: 'ATI UAF — Anjuman Talaba-e-Islam | University of Agriculture Faisalabad',
  description: 'Official platform of Anjuman Talaba-e-Islam (ATI) UAF Chapter. Student rights advocacy, free book banks, interest-free student welfare aid, and Islamic character building at UAF since 1968.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://atiuaf.com',
    title: 'ATI UAF — Anjuman Talaba-e-Islam | University of Agriculture Faisalabad',
    description: 'Official platform of Anjuman Talaba-e-Islam (ATI) UAF Chapter. Student rights advocacy, free book banks, and student aid at UAF.',
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
};

export default async function HomePage() {
  let latestActivities: ActivityItem[] = [];
  try {
    const activities = await getActivitiesAsync();
    if (Array.isArray(activities)) {
      latestActivities = activities.slice(0, 3);
    }
  } catch (err) {
    console.error('Error fetching homepage activities:', err);
    latestActivities = [];
  }
  return (
    <div className="flex flex-col w-full">
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative bg-white pt-4 pb-16 sm:pt-6 sm:pb-20 lg:pt-8 lg:pb-24 overflow-hidden border-b border-gray-100">
        {/* Subtle dual-color Islamic geometric lattice */}
        <IslamicPattern opacity={0.05} variant="dual" />

        {/* Ambient atmospheric lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-green-100/40 via-brand-red-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-black tracking-tight leading-[1.12]">
                ANJUMAN TALABA-E-ISLAM <br className="hidden sm:inline" />
                <span className="text-brand-green-700">ATI </span>
                <span className="text-brand-red-600">UAF</span>
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Welcome to the official website of <strong className="text-brand-black font-extrabold">Anjuman Talaba-e-Islam UAF</strong>, the esteemed Non-Political Student Association of Islam in Pakistan! We are delighted to have you here and share the rich tapestry of opportunities and resources our organization offers students.
              </p>

              {/* Official Motto Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-green-50/90 via-white to-brand-red-50/90 border-2 border-brand-green-200 shadow-sm text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-green-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-green-800">Our Official Motto</span>
                    <p className="text-xs sm:text-sm font-bold text-brand-black italic leading-snug mt-0.5">
                      &ldquo;Awakening the true Islamic spirit among students is impossible without lighting the candle of Ishq-e-Mustafa ﷺ in their hearts.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action Buttons: Green Primary & Red Secondary */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/careers"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-lg shadow-brand-green-600/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Become a Member</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="#activities"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-brand-red-700 bg-brand-red-50 hover:bg-brand-red-100 border-2 border-brand-red-300 shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-brand-red-600" />
                  <span>Campus Activities</span>
                </Link>
              </div>

              {/* Institutional Trust Highlights */}
              <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-600 flex-shrink-0" />
                  <span>UAF Desk Chapter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-red-600 flex-shrink-0" />
                  <span>Interest-Free UAF Student Aid</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-600 flex-shrink-0" />
                  <span>Hostel & Campus Rights Advocacy</span>
                </div>
              </div>
            </div>

            {/* Right Emblem Showcase Column */}
            <div className="lg:col-span-5 flex justify-center mt-4 lg:mt-0">
              <div className="relative group max-w-full">
                {/* Decorative Circular Halo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-green-500/20 via-brand-red-500/20 to-brand-green-500/20 blur-2xl transform group-hover:scale-105 transition-transform duration-500" />

                {/* Rotating Geometric Border Ring */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-2 bg-gradient-to-tr from-brand-green-600 via-white to-brand-red-600 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white p-3 sm:p-4 flex items-center justify-center relative overflow-hidden">
                    <IslamicPattern opacity={0.08} variant="dual" />
                    
                    {/* Official Brand Logo Emblem */}
                    <div className="relative w-52 h-52 sm:w-68 sm:h-68 md:w-76 md:h-76 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src="/images/student-power-logo.png"
                        alt="Student Power Official Logo Emblem"
                        width={300}
                        height={300}
                        priority
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Green */}
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-white/95 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-brand-green-200 shadow-lg flex items-center gap-2 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-green-100 flex items-center justify-center text-brand-green-700 flex-shrink-0">
                    <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] sm:text-xs font-bold text-brand-black">15,000+ Students</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500">Mentored Annually</p>
                  </div>
                </div>

                {/* Floating Badge 2: Red */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-white/95 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-brand-red-200 shadow-lg flex items-center gap-2 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-red-100 flex items-center justify-center text-brand-red-700 flex-shrink-0">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] sm:text-xs font-bold text-brand-black">58+ Years Heritage</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500">Founded 1968</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. WELCOME TO ANJUMAN TALABA-E-ISLAM (ATI) UAF
         ========================================================================= */}
      <section className="py-20 bg-brand-surface relative overflow-hidden">
        <IslamicPattern opacity={0.04} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Non-Political Student Association • Est. 1968"
            badgeColor="green"
            title="Welcome to"
            highlightText="Anjuman Talaba-e-Islam UAF"
            highlightColor="red"
            subtitle="The esteemed Non-Political Student Association of Islam in Pakistan, sharing the rich tapestry of opportunities and resources for university students."
          />

          {/* Heroic Welcome Narrative Box */}
          <div className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 relative overflow-hidden">
            <IslamicPattern opacity={0.02} variant="green" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Authentic ATI UAF Heritage & Model */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green-50 text-brand-green-800 border border-brand-green-200 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-brand-green-600" />
                  <span>Serving Student Institutions Since 1968</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-brand-black leading-snug">
                  Role in Islamic and Student Rights Movements
                </h3>

                <p className="text-base text-gray-700 leading-relaxed">
                  ATI has played a pivotal role in student institutions since 1968. ATI has played a role in Islamic and student rights movements. ATI firmly works on the model of the <strong className="text-brand-black">Love of Prophet Muhammad ( Durood )</strong> and social contributions.
                </p>

                <p className="text-base text-gray-700 leading-relaxed">
                  At Anjuman Talaba-e-Islam (ATI), we believe in empowering students to thrive academically, spiritually, and socially. Our website serves as a gateway to a vibrant community where you can explore and strengthen your Islamic identity, connect with like-minded individuals, and positively impact society.
                </p>

                {/* Blessing & Journey Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-green-50 via-white to-brand-red-50 border-2 border-brand-green-200/80 shadow-sm">
                  <p className="text-sm sm:text-base font-semibold text-brand-black italic leading-relaxed">
                    &ldquo;May your experience on this website be enlightening, enriching, and transformative. We look forward to embarking on this journey of faith and learning together with you!&rdquo;
                  </p>
                  <p className="text-xs font-bold text-brand-green-800 mt-2.5 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-red-600" />
                    <span>Anjuman Talaba-e-Islam (ATI) — University of Agriculture Faisalabad</span>
                  </p>
                </div>
              </div>

              {/* Right Column: 3 Pillars Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-black">Love of Prophet Muhammad ( Durood )</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Anchored firmly on the spiritual model of Ishq-e-Rasool (PBUH), Durood-o-Salam, and selfless social contributions.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-brand-red-100 text-brand-red-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-black">Islamic & Student Rights Defense</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Leading student rights movements and institutional advocacy at UAF and nationwide since 1968.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-black">Thriving Academically, Spiritually & Socially</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      A welcoming gateway for students to cultivate Islamic identity, connect with peers, and create positive societal impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. VISION AND MISSION (DUAL PILLARS)
         ========================================================================= */}
      <section className="py-20 bg-white relative overflow-hidden border-y border-gray-100">
        <IslamicPattern opacity={0.04} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            title="Our Vision &"
            highlightText="Mission"
            highlightColor="green"
            subtitle="Anchored in Ishq-e-Mustafa ﷺ and resolute advocacy for student rights since 1968."
          />

          {/* Prominent Motto Showcase Card */}
          <div className="mt-8 sm:mt-10 p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-green-50 via-white to-brand-red-50 border-2 border-brand-green-300 shadow-md relative overflow-hidden">
            <IslamicPattern opacity={0.03} variant="dual" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-green-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <span className="inline-block text-xs font-black uppercase tracking-widest text-brand-green-800 bg-brand-green-100/80 px-3 py-1 rounded-full border border-brand-green-200 mb-1.5">
                    Our Official Motto
                  </span>
                  <h3 className="text-base sm:text-xl lg:text-2xl font-black text-brand-black italic leading-relaxed">
                    &ldquo;Awakening the true Islamic spirit among students is impossible without lighting the candle of Ishq-e-Mustafa ﷺ in their hearts.&rdquo;
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
            {/* Vision Card - Green Accent (5 Cols) */}
            <div className="lg:col-span-5 relative p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-brand-green-50/80 via-white to-brand-green-50/40 border-2 border-brand-green-200/90 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-green-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-green-700">Foundation of Ishq-e-Mustafa ﷺ</span>
                    <h3 className="text-2xl font-black text-brand-black">Our Vision</h3>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-brand-green-200 mb-6 shadow-sm">
                  <p className="text-base sm:text-lg font-bold text-brand-black leading-relaxed">
                    &ldquo;To prepare an awakened, conscious and well-mannered student on the foundation of the Love of Prophet Muhammad ﷺ, who plays a practical role for the glory of Islam, the development of Pakistan and the service of humanity.&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-green-100 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-green-800 border border-brand-green-200 shadow-sm">
                  Glory of Islam
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-green-800 border border-brand-green-200 shadow-sm">
                  Development of Pakistan
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-green-800 border border-brand-green-200 shadow-sm">
                  Service of Humanity
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-green-800 border border-brand-green-200 shadow-sm">
                  Awakened & Conscious Youth
                </span>
              </div>
            </div>

            {/* Mission Card - Red Accent (7 Cols) */}
            <div className="lg:col-span-7 relative p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-brand-red-50/80 via-white to-brand-red-50/40 border-2 border-brand-red-200/90 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-red-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-red-700">Since 1968 Advocacy</span>
                    <h3 className="text-2xl font-black text-brand-black">Our Mission — Work for Student Rights</h3>
                  </div>
                </div>

                <div className="space-y-3.5 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <p>
                    <strong className="text-brand-black">Anjuman Talaba-e-Islam has been struggling for the protection of student rights since 1968.</strong> We believe that every student has the full right to quality education, a safe educational environment, and education with dignity and respect.
                  </p>
                  <p>
                    ATI raises its voice against unjust fee increases, admission issues, lack of hostel facilities, irregularities in the examination system, and every injustice faced by students.
                  </p>
                  <p>
                    Through peaceful negotiations with university administration, legal methods, and positive struggle, we get students&apos; problems solved.
                  </p>
                  <div className="p-3.5 rounded-xl bg-white/90 border border-brand-red-200 font-semibold text-brand-red-950 text-xs sm:text-sm shadow-sm">
                    Our aim is not just protest, but a permanent solution to problems, so that no student is deprived of education and every student gets an equal opportunity to move forward.
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-brand-red-100 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-red-800 border border-brand-red-200 shadow-sm">
                  Quality Education with Dignity
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-red-800 border border-brand-red-200 shadow-sm">
                  Peaceful Negotiations & Legal Methods
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-red-800 border border-brand-red-200 shadow-sm">
                  Permanent Problem Solving
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. STUDENT ACTIVITIES & COMMUNITY ENGAGEMENT
         ========================================================================= */}
      <section id="activities" className="py-20 bg-brand-surface relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.04} variant="green" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            title="Student Activities &"
            highlightText="Community Action"
            highlightColor="red"
            subtitle="From vibrant university welcome camps to national relief convoys, Student Power is on the ground."
          />

          {latestActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {latestActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {act.images && act.images.length > 0 ? (
                      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={act.images[0]}
                          alt={act.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-brand-green-700/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                          {act.category || 'Campus Event'}
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 w-full bg-gradient-to-r from-brand-green-100/60 to-brand-red-100/40 p-4 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-green-800 bg-white/80 px-2.5 py-1 rounded-full shadow-sm">
                          {act.category || 'Campus Event'}
                        </span>
                        <Calendar className="w-5 h-5 text-brand-green-600" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-green-600" />
                          {act.date}
                        </span>
                        {act.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-brand-red-600 flex-shrink-0" />
                            <span className="truncate">{act.location}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-brand-black mb-2 line-clamp-2 group-hover:text-brand-green-700 transition-colors">
                        {act.title}
                      </h4>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href="/activities"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green-700 hover:text-brand-green-800"
                    >
                      <span>View Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm text-center max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-brand-black">Campus Activities & Drives</h4>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                Explore upcoming book fairs, voluntary blood camps, declamation contests, and campus relief convoys.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-md transition-all group"
            >
              <span>Explore All Campus Activities & Event Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MEMBERSHIP / PARTICIPATION CALL-TO-ACTION BANNER
         ========================================================================= */}
      <section className="py-20 relative bg-brand-black text-white overflow-hidden border-t-4 border-brand-green-600">
        <IslamicPattern opacity={0.06} variant="dual" />

        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-green-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wider uppercase text-brand-green-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-red-400" />
            <span>Join the Student Movement</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Be Part of Something Greater Than Yourself.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Stand for faith, knowledge, and student welfare. Whether you wish to lead on your campus, volunteer in disaster relief, or participate in leadership circles — Student Power is your platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/careers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-500 shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              <span>Apply for Membership</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white bg-brand-red-600 hover:bg-brand-red-500 shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4 text-white" />
              <span>Contact Central Secretariat</span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Open to all enrolled college and university students across Pakistan. Non-profit, merit-driven.
          </p>
        </div>
      </section>
    </div>
  );
}
