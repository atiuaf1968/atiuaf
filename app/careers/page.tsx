'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Heart,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Send,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Building,
  CreditCard,
  Phone,
  Mail,
  User,
  BookOpen,
  Award,
  Flame,
  Check
} from 'lucide-react';
import { IslamicPattern } from '@/components/IslamicPattern';
import { OFFICIAL_MOTTO, OFFICIAL_VISION, SITE_METADATA } from '@/lib/data';

export default function VoluntaryJoinPage() {
  // Form State with the 8 requested fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    cnic: '',
    hostel: '',
    degree: '',
    semester: '',
    address: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const uafHostels = [
    'Jinnah Hall',
    'Iqbal Hall',
    'Qasim Hall',
    'Sir Syed Hall',
    'Liaquat Hall',
    'Tariq Hall',
    'Fateh Hall',
    'Babar Hall',
    'Tipu Hall',
    'Ayub Hall',
    'Afzal Hall',
    'Fatima Jinnah Hall (Girls Hostel)',
    'Ayesha Hall (Girls Hostel)',
    'Khadija Hall (Girls Hostel)',
    'Zainab Hall (Girls Hostel)',
    'Day Scholar (Off-Campus / Faisalabad Resident)',
    'Other Private Hostel / Residence',
  ];

  const semesters = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester',
    'Postgraduate / MSc (Hons) / MPhil',
    'PhD Scholar',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate all 8 mandatory fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.number.trim() ||
      !formData.cnic.trim() ||
      !formData.hostel.trim() ||
      !formData.degree.trim() ||
      !formData.semester.trim() ||
      !formData.address.trim()
    ) {
      setFormError('Please complete all 8 required fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.number,
          cnic: formData.cnic,
          hostel: formData.hostel,
          degree: formData.degree,
          semester: formData.semester,
          address: formData.address,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit registration.');
      }

      setSubmissionResult({
        success: true,
        message: data.message,
        applicationId: data.applicationId,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        number: '',
        cnic: '',
        hostel: '',
        degree: '',
        semester: '',
        address: '',
      });
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-brand-surface min-h-screen">
      {/* =========================================================================
          HERO BANNER
         ========================================================================= */}
      <section className="relative bg-white pt-14 pb-16 border-b border-gray-100 overflow-hidden">
        <IslamicPattern opacity={0.05} variant="dual" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green-50 border border-brand-green-200 text-xs font-bold uppercase tracking-wider text-brand-green-800 mb-5">
            <span className="w-2 h-2 rounded-full bg-brand-green-600 animate-pulse" />
            <span>Voluntary Student Registration • UAF Chapter</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-black tracking-tight leading-tight max-w-4xl mx-auto">
            Voluntarily Join{' '}
            <span className="text-brand-green-700">Anjuman Talaba-e-Islam</span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stand with the esteemed non-political student movement at the University of Agriculture, Faisalabad. Dedicated to the protection of student rights, academic excellence, and the love of Prophet Muhammad ﷺ since 1968.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
            <span className="w-4 h-1 bg-brand-red-600 rounded-full" />
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOUR PILLARS OF VOLUNTARY MEMBERSHIP
         ========================================================================= */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-green-50 text-brand-green-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1.5">
                Defense of Student Rights
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Firm and peaceful struggle against unjust fee hikes, hostel amenities shortage, exam irregularities, and transport issues.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-red-50 text-brand-red-700 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1.5">
                Ishq-e-Mustafa ﷺ Spirit
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Awakening the prophetic spirit, moral refinement, and weekly study halaqas across UAF hostel halls and departments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-green-50 text-brand-green-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1.5">
                Academic & Welfare Aid
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Free book bank at Jinnah Hall, semester guidance, emergency student welfare grants, and 24/7 blood donation network.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-red-50 text-brand-red-700 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1.5">
                Leadership Development
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Parliamentary debates, public speaking workshops, community organizing, and campus event coordination experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SINGLE VOLUNTARY JOIN BOX / FORM
         ========================================================================= */}
      <section id="join-box" className="py-16 sm:py-20 relative overflow-hidden">
        <IslamicPattern opacity={0.03} variant="dual" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Box Header Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-brand-green-800 to-brand-green-950 px-8 py-8 text-white text-center relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider mb-3">
                <UserCheck className="w-3.5 h-3.5 text-brand-green-300" />
                <span>Voluntary Membership Form</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Voluntarily Join ATI UAF
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 mt-2 max-w-xl mx-auto leading-relaxed">
                Fill out the required student information below. All UAF undergraduates, postgraduates, day scholars, and hostel residents are welcome to join.
              </p>
            </div>

            <div className="p-8 sm:p-10">
              {/* Submission Result Banner */}
              {submissionResult && (
                <div className="mb-8 p-6 rounded-2xl bg-brand-green-50 border-2 border-brand-green-300 text-brand-green-900 shadow-md">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-7 h-7 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-brand-green-950">
                        Registration Completed Successfully!
                      </h4>
                      <p className="text-sm mt-1 text-brand-green-800 leading-relaxed">
                        {submissionResult.message}
                      </p>
                      {submissionResult.applicationId && (
                        <div className="mt-3 p-3 bg-white rounded-xl border border-brand-green-200 inline-block text-xs font-mono font-bold text-brand-green-900 shadow-sm">
                          Membership Tracking ID: {submissionResult.applicationId}
                        </div>
                      )}
                      <p className="text-xs text-brand-green-700 mt-3">
                        A confirmation notification has been dispatched to your email address with your tracking credentials.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setSubmissionResult(null)}
                          className="text-xs font-bold text-brand-green-800 underline hover:text-brand-green-950"
                        >
                          Submit Another Registration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Error Banner */}
              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-brand-red-50 border border-brand-red-200 text-brand-red-800 flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-brand-red-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* The 8-Field Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Muhammad Abdullah"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* 2. Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. student@uaf.edu.pk or gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 transition-all"
                    />
                  </div>

                  {/* 3. Phone / WhatsApp Number */}
                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0317 2011968"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 transition-all"
                    />
                  </div>

                  {/* 4. CNIC / B-Form Number */}
                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      CNIC / B-Form Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 33100-1234567-1"
                      value={formData.cnic}
                      onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                      className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 transition-all"
                    />
                  </div>

                  {/* 5. Hostel / Residence */}
                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      Hostel / Residential Hall *
                    </label>
                    <select
                      required
                      value={formData.hostel}
                      onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                      className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 transition-all"
                    >
                      <option value="">Select Hostel or Residence</option>
                      {uafHostels.map((hostel) => (
                        <option key={hostel} value={hostel}>
                          {hostel}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 6. Degree Program & Faculty */}
                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      Degree Program & Faculty *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BSc (Hons) Agriculture / DVM / BSCS"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 transition-all"
                    />
                  </div>

                  {/* 7. Current Semester */}
                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      Current Semester *
                    </label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 transition-all"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 8. Permanent / Current Address */}
                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      Permanent / Current Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Village/Tehsil, District, City"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 transition-all"
                    />
                  </div>

                </div>

                {/* Islamic Character & Loyalty Note */}
                <div className="p-4 rounded-xl bg-brand-green-50/70 border border-brand-green-200 text-xs text-brand-green-900 leading-relaxed">
                  <p className="font-semibold text-brand-green-950 mb-1">
                    Student Pledge & Voluntary Commitment:
                  </p>
                  <p>
                    By voluntarily joining Anjuman Talaba-e-Islam UAF, I pledge to uphold Islamic values, respect teachers and university discipline, and actively work for student welfare, brotherhood, and the defense of student rights.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Registering Your Membership...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-5 h-5" />
                        <span>Voluntarily Join ATI UAF</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">
                    Questions or queries? Visit our UAF Desk Chapter (Jinnah Hall) or call <span className="font-bold text-brand-black">+92 317 2011968</span>.
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
