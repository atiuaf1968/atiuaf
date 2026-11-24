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
  Scale,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Flame,
  Globe2,
  Bookmark
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { IslamicPattern } from '@/components/IslamicPattern';
import { LEADERSHIP_TEAM, CORE_OBJECTIVES } from '@/lib/data';

export const metadata = {
  title: 'About Us — Student Power & Anjuman Talaba-e-Islam',
  description: 'Discover the history, organizational philosophy, central leadership, and strategic vision of Student Power, rooted in Islamic ethics and academic distinction since 1968.',
};

export default function AboutPage() {
  const coreValues = [
    {
      title: 'Imaan (Faith & Spiritual Purity)',
      arabic: 'إِيـمَان',
      description: 'Unwavering devotion to Allah Almighty and profound reverence for the Holy Prophet Muhammad (PBUH) as the supreme guide for personal ethics and societal harmony.',
      color: 'green',
    },
    {
      title: 'Ilm (Knowledge & Critical Thought)',
      arabic: 'عِلْـم',
      description: 'Pursuing academic mastery across modern sciences, technology, humanities, and Islamic jurisprudence without ideological compromise.',
      color: 'red',
    },
    {
      title: 'Akhlaq (Exemplary Moral Character)',
      arabic: 'أَخْـلَاق',
      description: 'Upholding honesty, humility, trustworthiness, and discipline on university campuses, in professional life, and in interpersonal conduct.',
      color: 'green',
    },
    {
      title: 'Ittehad (Brotherhood & Unity)',
      arabic: 'اِتِّـحَاد',
      description: 'Transcending linguistic, ethnic, and provincial fault lines to forge a cohesive, purposeful student fraternity across all territories.',
      color: 'red',
    },
    {
      title: 'Khidmat (Compassionate Service)',
      arabic: 'خِـدْمَة',
      description: 'Devoting student energy and collective resources to disaster relief, blood donation, tutoring underprivileged children, and community empowerment.',
      color: 'green',
    },
    {
      title: 'Adl (Justice & Student Rights)',
      arabic: 'عَـدْل',
      description: 'Courageously demanding transparent merit, equitable tuition structures, safe educational campuses, and constitutional student representation.',
      color: 'red',
    },
  ];

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
          CORE VALUES (6 PILLARS)
         ========================================================================= */}
      <section id="values" className="py-20 bg-brand-surface relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.04} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Ethical Framework"
            badgeColor="green"
            title="Six Foundational"
            highlightText="Core Values"
            highlightColor="red"
            subtitle="The moral compass guiding our members, campus councils, and community programs."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {coreValues.map((val, idx) => {
              const isGreen = val.color === 'green';
              return (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-gray-800 font-serif">
                        {val.arabic}
                      </span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          isGreen ? 'bg-brand-green-500' : 'bg-brand-red-500'
                        }`}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-brand-black mb-2">
                      {val.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>

                  <div
                    className={`mt-6 h-1 w-10 rounded-full ${
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
            badge="Executive Council"
            badgeColor="green"
            title="Central Leadership &"
            highlightText="Advisory Board"
            highlightColor="red"
            subtitle="Distinguished educationists, youth organizers, and academic mentors steering the organization's nationwide mandate."
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
            Note: Leadership profiles represent official appointed roles of the Central Secretariat. Editable placeholders are retained for chapter-specific customization.
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
