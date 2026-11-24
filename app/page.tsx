import React from 'react';
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
  Calendar,
  Clock,
  Target,
  ChevronRight,
  Share2
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { IslamicPattern } from '@/components/IslamicPattern';
import {
  SITE_METADATA,
  CORE_OBJECTIVES,
  NEWS_ANNOUNCEMENTS
} from '@/lib/data';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative bg-white pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-gray-100">
        {/* Subtle dual-color Islamic geometric lattice */}
        <IslamicPattern opacity={0.05} variant="dual" />

        {/* Ambient atmospheric lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-green-100/40 via-brand-red-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Official Organization Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-green-50 border border-brand-green-200/80 shadow-sm text-xs font-bold text-brand-green-800 tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-brand-green-600 animate-ping" />
                <span>ANJUMAN TALABA-E-ISLAM (ATI)</span>
                <span className="text-gray-300">•</span>
                <span className="text-brand-red-600 font-extrabold">UAF Chapter (Est. 1968)</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-black tracking-tight leading-[1.12]">
                ANJUMAN TALABA-E-ISLAM <br className="hidden sm:inline" />
                <span className="text-brand-green-700">ATI </span>
                <span className="text-brand-red-600">UAF</span>
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Welcome to the official website of <strong className="text-brand-black font-extrabold">Anjuman Talaba-e-Islam UAF</strong>, the esteemed Non-Political Student Association of Islam in Pakistan! We are delighted to have you here and share the rich tapestry of opportunities and resources our organization offers students.
              </p>

              {/* Call to Action Buttons: Green Primary & Red Secondary */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/careers"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-lg shadow-brand-green-600/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Become a Member</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="#activities"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-brand-red-700 bg-brand-red-50 hover:bg-brand-red-100 border-2 border-brand-red-300 shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-brand-red-600" />
                  <span>Campus Activities</span>
                </Link>
              </div>

              {/* Institutional Trust Highlights */}
              <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-600 flex-shrink-0" />
                  <span>Jinnah Hall Chapter Desk</span>
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
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Decorative Circular Halo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-green-500/20 via-brand-red-500/20 to-brand-green-500/20 blur-2xl transform group-hover:scale-105 transition-transform duration-500" />

                {/* Rotating Geometric Border Ring */}
                <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 rounded-full p-2 bg-gradient-to-tr from-brand-green-600 via-white to-brand-red-600 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white p-4 flex items-center justify-center relative overflow-hidden">
                    <IslamicPattern opacity={0.08} variant="dual" />
                    
                    {/* Official Brand Logo Emblem */}
                    <div className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
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
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-brand-green-200 shadow-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-green-100 flex items-center justify-center text-brand-green-700">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-brand-black">15,000+ Students</p>
                    <p className="text-[10px] text-gray-500">Mentored Annually</p>
                  </div>
                </div>

                {/* Floating Badge 2: Red */}
                <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-brand-red-200 shadow-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-red-100 flex items-center justify-center text-brand-red-700">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-brand-black">58+ Years Heritage</p>
                    <p className="text-[10px] text-gray-500">Founded 1968</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Impact Metrics Bar */}
          <div className="mt-16 pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
              <p className="text-3xl sm:text-4xl font-black text-brand-green-700">25+</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">UAF Faculties & Hostels</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
              <p className="text-3xl sm:text-4xl font-black text-brand-red-600">₨ 3.2M+</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">UAF Student Welfare Grants</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
              <p className="text-3xl sm:text-4xl font-black text-brand-green-700">3,800+</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Faisalabad Blood Pints</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
              <p className="text-3xl sm:text-4xl font-black text-brand-red-600">1,800+</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Tech & Skills Certified</p>
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

          {/* 3 Concrete Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-brand-green-50 flex items-center justify-center text-brand-green-700 mb-6 group-hover:bg-brand-green-600 group-hover:text-white transition-colors duration-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-3">
                Uncompromising Islamic Ethics
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Grounding student youth in deep reverence for the Messenger of Allah (PBUH), steadfast moral character, and spiritual contemplation amidst modern societal challenges.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1.5 text-xs font-bold text-brand-green-700">
                <span>Core Islamic Values</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-brand-red-50 flex items-center justify-center text-brand-red-700 mb-6 group-hover:bg-brand-red-600 group-hover:text-white transition-colors duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-3">
                Academic & Intellectual Rigor
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Empowering students to lead in STEM, agriculture, sciences, and research through scholarships, study resources, and peer guidance circles.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1.5 text-xs font-bold text-brand-red-600">
                <span>Knowledge & Research</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-brand-green-50 flex items-center justify-center text-brand-green-700 mb-6 group-hover:bg-brand-green-600 group-hover:text-white transition-colors duration-200">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-3">
                Student Welfare & Campus Rights
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Standing resolutely alongside students facing unjust fee hikes, hostile administration barriers, hostel shortages, and lack of merit transparency.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1.5 text-xs font-bold text-brand-green-700">
                <span>Advocacy & Protection</span>
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
            badge="Strategic Foundation"
            badgeColor="red"
            title="Our Vision &"
            highlightText="Mission"
            highlightColor="green"
            subtitle="Anchored in prophetic wisdom and forward-looking action to build a just, learned, and united society."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Vision Card - Green Accent */}
            <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-brand-green-50/70 via-white to-brand-green-50/30 border-2 border-brand-green-200/80 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-green-600 text-white flex items-center justify-center shadow-md">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-green-700">Strategic Horizon</span>
                  <h3 className="text-2xl font-black text-brand-black">Our Vision</h3>
                </div>
              </div>
              <p className="text-base text-gray-700 leading-relaxed">
                To realize a vibrant generation of educated, morally upright, and intellectually formidable Muslim youth who lead academic progress, champion social equity, and serve as beacons of unity and prophetic character in Pakistan and the global Islamic community.
              </p>
              <div className="mt-6 pt-6 border-t border-brand-green-100 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-green-800 border border-brand-green-200">
                  Moral Excellence
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-green-800 border border-brand-green-200">
                  Academic Preeminence
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-green-800 border border-brand-green-200">
                  Social Justice
                </span>
              </div>
            </div>

            {/* Mission Card - Red Accent */}
            <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-brand-red-50/70 via-white to-brand-red-50/30 border-2 border-brand-red-200/80 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-red-600 text-white flex items-center justify-center shadow-md">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-red-700">Daily Commitment</span>
                  <h3 className="text-2xl font-black text-brand-black">Our Mission</h3>
                </div>
              </div>
              <p className="text-base text-gray-700 leading-relaxed">
                To mobilize, mentor, and defend students through structured academic guidance, interest-free welfare funds, ethical leadership incubators, and fearless advocacy for student rights, while instilling timeless Islamic spiritual teachings in educational halls.
              </p>
              <div className="mt-6 pt-6 border-t border-brand-red-100 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-red-800 border border-brand-red-200">
                  Student Rights Defense
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-red-800 border border-brand-red-200">
                  Bait-ul-Ilm Grants
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-red-800 border border-brand-red-200">
                  Ethical Leadership
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CORE OBJECTIVES (6 PILLARS)
         ========================================================================= */}
      <section className="py-20 bg-brand-surface relative overflow-hidden">
        <IslamicPattern opacity={0.03} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Institutional Pillars"
            badgeColor="green"
            title="Six Guiding Objectives of"
            highlightText="Student Power"
            highlightColor="red"
            subtitle="Every program, campaign, and chapter initiative aligns with these foundational commitments."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {CORE_OBJECTIVES.map((obj) => {
              const isGreen = obj.accent === 'green';
              return (
                <div
                  key={obj.number}
                  className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Number & Tag */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-2xl font-black ${
                          isGreen ? 'text-brand-green-600' : 'text-brand-red-600'
                        }`}
                      >
                        {obj.number}
                      </span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          isGreen ? 'bg-brand-green-500' : 'bg-brand-red-500'
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-brand-black mb-3">
                      {obj.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {obj.description}
                    </p>
                  </div>

                  {/* Bottom Accent Bar */}
                  <div
                    className={`mt-6 h-1 w-12 rounded-full ${
                      isGreen ? 'bg-brand-green-600' : 'bg-brand-red-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. STUDENT ACTIVITIES & COMMUNITY ENGAGEMENT
         ========================================================================= */}
      <section id="activities" className="py-20 bg-brand-surface relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.04} variant="green" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Campus Life & Activism"
            badgeColor="green"
            title="Student Activities &"
            highlightText="Community Action"
            highlightColor="red"
            subtitle="From vibrant university welcome camps to national relief convoys, Student Power is on the ground."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Activity 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-2">Campus Book Fairs</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Subsidized academic textbook fairs offering up to 50% discount on medical, engineering, and law reference literature.
              </p>
              <span className="mt-4 inline-block text-[11px] font-bold text-brand-green-700">45+ Campus Drives</span>
            </div>

            {/* Activity 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-red-100 text-brand-red-700 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-2">Emergency Blood Camps</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Rapid emergency student donor mobilizations for hospitals and Thalassemia patients across all provinces.
              </p>
              <span className="mt-4 inline-block text-[11px] font-bold text-brand-red-600">24/7 Helpline Active</span>
            </div>

            {/* Activity 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-2">All-Pakistan Debates</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                National bilingual declamation contests fostering eloquent articulation, parliamentary decorum, and critical inquiry.
              </p>
              <span className="mt-4 inline-block text-[11px] font-bold text-brand-green-700">Annual Trophy Series</span>
            </div>

            {/* Activity 4 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-red-100 text-brand-red-700 flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-2">Flood & Winter Relief</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Student volunteer teams assembling and distributing ration bags, winter warm packs, and reconstructed school tents.
              </p>
              <span className="mt-4 inline-block text-[11px] font-bold text-brand-red-600">100% Student Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. LATEST ANNOUNCEMENTS & NEWS
         ========================================================================= */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.04} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Press & Dispatches"
            badgeColor="red"
            title="Latest Announcements &"
            highlightText="Student News"
            highlightColor="green"
            subtitle="Stay informed with official statements, convention schedules, and campus policy developments."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {NEWS_ANNOUNCEMENTS.map((item) => (
              <article
                key={item.id}
                className="p-7 rounded-2xl bg-brand-surface border border-gray-100 hover:border-brand-green-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-brand-green-100 text-brand-green-800">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-black mb-3 leading-snug hover:text-brand-green-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-gray-200/60 flex items-center justify-between text-xs font-bold text-brand-green-700">
                  <Link href="/contact" className="hover:text-brand-green-900 flex items-center gap-1">
                    <span>Read Full Statement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-gray-400 font-normal">Official Release</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. MEMBERSHIP / PARTICIPATION CALL-TO-ACTION BANNER
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
