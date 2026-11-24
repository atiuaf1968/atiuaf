import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Compass,
  Target,
  Users,
  Award,
  BookOpen,
  HeartHandshake,
  Heart,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { IslamicPattern } from '@/components/IslamicPattern';
import { LEADERSHIP_TEAM, CORE_OBJECTIVES } from '@/lib/data';

export const metadata = {
  title: 'About Us — Student Power & Anjuman Talaba-e-Islam',
  description: 'Discover the history, organizational philosophy, central leadership, and strategic vision of Student Power, rooted in Islamic ethics and academic distinction since 1968.',
};

export default function AboutPage() {
  const milestones = [
    {
      year: '1968',
      title: 'Historical Foundation in Karachi',
      description: 'Founded on 20th January 1968 (20th Shawwal 1387 A.H.) by Jameel Ahmed Naeemi, Haji Hanif Tayyab, and dedicated student companions to foster prophetic love (Ishq-e-Rasool) and defend students rights.',
    },
    {
      year: '1974',
      title: 'Nationwide Campus Expansion',
      description: 'Chapters established in Lahore, Rawalpindi, Multan, and Peshawar, championing peaceful campus governance and moral activism.',
    },
    {
      year: '1985',
      title: 'Establishment of Bait-ul-Ilm Book Banks',
      description: 'Pioneered free curriculum book exchanges and subsidized academic notes across medical colleges and polytechnic institutes.',
    },
    {
      year: '2005',
      title: 'Khoon-e-Hayat National Blood Society',
      description: 'Mobilized tens of thousands of student donors during the 2005 Kashmir earthquake, establishing an institutional voluntary blood donation network.',
    },
    {
      year: '2020',
      title: 'Digital Literacy & Mustaqbil Hub',
      description: 'Launched technical mentorship bootcamps, freelance training, and entry test preparation portals for intermediate and university entrants.',
    },
    {
      year: 'Present',
      title: 'Modern Student Power Movement',
      description: 'Operating in 120+ colleges and universities, uniting tens of thousands of students under modern intellectual and moral leadership.',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-brand-surface">
      {/* =========================================================================
          HERO BANNER
         ========================================================================= */}
      <section className="relative bg-white pt-16 pb-20 border-b border-gray-100 overflow-hidden">
        <IslamicPattern opacity={0.05} variant="dual" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green-50 border border-brand-green-200 text-xs font-bold uppercase tracking-wider text-brand-green-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-green-600 animate-pulse" />
            <span>Organizational Heritage & Philosophy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-black tracking-tight leading-tight max-w-4xl mx-auto">
            About <span className="text-brand-green-700">Student Power UAF</span> &{' '}
            <span className="text-brand-red-600">Our Heritage</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Rooted in the venerable tradition of Anjuman Talaba-e-Islam since 1968, Student Power at the University of Agriculture, Faisalabad (UAF) is the campus voice of educated, principled youth committed to academic distinction, student welfare, and Islamic values.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
            <span className="w-4 h-1 bg-brand-red-600 rounded-full" />
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          ORGANIZATIONAL BACKGROUND & HISTORY
         ========================================================================= */}
      <section id="history" className="py-20 bg-white relative overflow-hidden">
        <IslamicPattern opacity={0.03} variant="green" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-brand-red-50 text-brand-red-700 border border-brand-red-200">
                <span>Since 1968</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-brand-black tracking-tight leading-tight">
                A Legacy of Prophetic Devotion and Student Leadership
              </h2>

              <p className="text-base text-gray-700 leading-relaxed">
                Student Power traces its foundational roots to **January 20, 1968 (20th Shawwal 1387 A.H.)**, when pioneering student leaders assembled in Karachi to establish an ideological, democratic, and moral movement for Muslim youth: **Anjuman Talaba-e-Islam (ATI)**.
              </p>

              <p className="text-base text-gray-700 leading-relaxed">
                Unlike student bodies driven by partisan political interests, Student Power was built on two non-negotiable pillars: **Ishq-e-Rasool (Love and Reverence for the Holy Prophet Muhammad PBUH)** and the **Defense of Student Rights & Academic Dignity**. Over more than half a century, the movement has educated generations of scholars, doctors, engineers, civil servants, and thinkers who serve society with unyielding ethical rectitude.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-brand-green-50/60 border border-brand-green-100">
                  <h4 className="font-bold text-brand-green-900 text-sm">Non-Violent Advocacy</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Committed to peaceful dialogic discourse, constitutional rights, and academic harmony on campuses.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-brand-red-50/60 border border-brand-red-100">
                  <h4 className="font-bold text-brand-red-900 text-sm">Merit & Welfare Focus</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Interest-free education loans, book exchanges, and disaster relief mobilize thousands of volunteers.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Emblem Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md p-8 rounded-2xl bg-white border-2 border-brand-green-600/20 shadow-xl relative overflow-hidden text-center">
                <IslamicPattern opacity={0.06} variant="dual" />
                
                <div className="w-40 h-40 mx-auto relative mb-6">
                  <Image
                    src="/images/student-power-logo.png"
                    alt="Official Student Power Emblem"
                    width={160}
                    height={160}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>

                <h3 className="text-xl font-black text-brand-black">The Official Seal</h3>
                <p className="text-xs text-brand-green-700 font-bold uppercase tracking-wider mt-1">
                  Symbol of Faith, Unity & Dignity
                </p>

                <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                  The green and red stripes, anchored by the sacred calligraphy &apos;یا رسول اللہ&apos;, represent the harmonious synthesis of divine prophetic love with passionate, vigorous youth action.
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-around text-xs font-bold">
                  <span className="text-brand-green-700">Green: Peace & Islam</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-brand-red-600">Red: Courage & Zeal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MOTTO, VISION & MISSION
         ========================================================================= */}
      <section id="vision" className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.04} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Strategic Foundation"
            badgeColor="red"
            title="Our Vision &"
            highlightText="Mission"
            highlightColor="green"
            subtitle="Anchored in Ishq-e-Mustafa ﷺ and resolute advocacy for student rights since 1968."
          />

          {/* Prominent Motto Showcase Card */}
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-green-50 via-white to-brand-red-50 border-2 border-brand-green-300 shadow-md relative overflow-hidden">
            <IslamicPattern opacity={0.03} variant="dual" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-green-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <span className="inline-block text-xs font-black uppercase tracking-widest text-brand-green-800 bg-brand-green-100/80 px-3 py-1 rounded-full border border-brand-green-200 mb-1.5">
                    Our Official Motto
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-brand-black italic leading-relaxed">
                    &ldquo;Awakening the true Islamic spirit among students is impossible without lighting the candle of Ishq-e-Mustafa ﷺ in their hearts.&rdquo;
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
            {/* Vision Card */}
            <div className="lg:col-span-5 relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-green-50/80 via-white to-brand-green-50/40 border-2 border-brand-green-200/90 shadow-md flex flex-col justify-between">
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
              </div>
            </div>

            {/* Mission Card */}
            <div className="lg:col-span-7 relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-red-50/80 via-white to-brand-red-50/40 border-2 border-brand-red-200/90 shadow-md flex flex-col justify-between">
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
          HISTORICAL MILESTONES (TIMELINE)
         ========================================================================= */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.03} variant="red" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Chronology"
            badgeColor="red"
            title="Historic Milestones of"
            highlightText="The Movement"
            highlightColor="green"
            subtitle="Over five decades of consistent advocacy, student leadership, and social development across Pakistan."
          />

          <div className="mt-12 relative border-l-2 border-brand-green-600/30 ml-4 md:ml-32 space-y-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-10 group">
                {/* Timeline Node */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-brand-green-600 group-hover:border-brand-red-600 transition-colors" />

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 mb-1">
                  <span className="text-lg font-black text-brand-red-600 tracking-wider">
                    {m.year}
                  </span>
                  <h3 className="text-xl font-bold text-brand-black">
                    {m.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CENTRAL LEADERSHIP & ADVISORY
         ========================================================================= */}
      <section id="leadership" className="py-20 bg-brand-surface relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.04} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Executive Cabinet"
            badgeColor="green"
            title="UAF Chapter Executive Cabinet &"
            highlightText="Student Leadership"
            highlightColor="red"
            subtitle="The dedicated student leaders steering Anjuman Talaba-e-Islam across all faculties, institutes, and hostel halls at the University of Agriculture, Faisalabad."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {LEADERSHIP_TEAM.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {/* Placeholder Avatar with Initials */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-green-700 to-brand-green-900 text-white flex items-center justify-center font-black text-base tracking-wider shadow">
                      {leader.imagePlaceholder}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-brand-black leading-snug">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-brand-red-600 mt-0.5">
                        {leader.role}
                      </p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {leader.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                  <span>Central Secretariat Verified</span>
                  <ShieldCheck className="w-4 h-4 text-brand-green-600" />
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-10">
            Official appointed executive cabinet of Anjuman Talaba-e-Islam (ATI) University of Agriculture, Faisalabad (UAF) Chapter and Central Leadership.
          </p>
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION
         ========================================================================= */}
      <section className="py-16 bg-white border-t border-gray-100 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
            Ready to Stand With Us?
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Discover opportunities to volunteer, intern in research and policy, or start a chartered Student Power chapter on your campus.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/careers"
              className="px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-md transition-colors"
            >
              Explore Opportunities
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider text-brand-red-700 bg-brand-red-50 hover:bg-brand-red-100 border border-brand-red-200 transition-colors"
            >
              Contact Secretariat
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
