'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  GraduationCap,
  Heart,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  MapPin,
  Calendar,
  Send,
  Sparkles,
  ArrowRight,
  X,
  Filter
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { IslamicPattern } from '@/components/IslamicPattern';
import { CAREER_OPPORTUNITIES, CareerOpportunity } from '@/lib/data';

export default function CareersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOpportunity, setSelectedOpportunity] = useState<CareerOpportunity | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    position: '',
    opportunityType: 'Volunteer',
    linkedIn: '',
    introduction: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter opportunities
  const filteredOpportunities =
    selectedCategory === 'All'
      ? CAREER_OPPORTUNITIES
      : CAREER_OPPORTUNITIES.filter((opp) => opp.type === selectedCategory);

  const categories = ['All', 'Volunteer', 'Internship', 'Fellowship', 'Core Staff'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
        setFormError('Please upload a valid document (.pdf, .doc, or .docx).');
        setResumeFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('File size exceeds the 5MB limit.');
        setResumeFile(null);
        return;
      }
      setFormError(null);
      setResumeFile(file);
    }
  };

  const handleApplyClick = (opp: CareerOpportunity) => {
    setSelectedOpportunity(opp);
    setFormData((prev) => ({
      ...prev,
      position: opp.title,
      opportunityType: opp.type,
    }));
    // Smooth scroll down to application form
    const formElement = document.getElementById('application-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.education ||
      !formData.position ||
      !formData.introduction
    ) {
      setFormError('Please complete all mandatory fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('education', formData.education);
      payload.append('position', formData.position);
      payload.append('opportunityType', formData.opportunityType);
      payload.append('linkedIn', formData.linkedIn);
      payload.append('introduction', formData.introduction);
      if (resumeFile) {
        payload.append('resume', resumeFile);
      }

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSubmissionResult({
        success: true,
        message: data.message,
        applicationId: data.applicationId,
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        education: '',
        position: '',
        opportunityType: 'Volunteer',
        linkedIn: '',
        introduction: '',
      });
      setResumeFile(null);
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span>Opportunities & Civic Engagement</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-black tracking-tight leading-tight max-w-4xl mx-auto">
            Careers, Internships &{' '}
            <span className="text-brand-red-600">Volunteer Roles</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dedicate your skills to a higher cause at the University of Agriculture, Faisalabad (UAF). Join our teams in student welfare, academic mentoring, digital communications, and campus community development.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
            <span className="w-4 h-1 bg-brand-red-600 rounded-full" />
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          RECRUITMENT ROADMAP (4 STEPS)
         ========================================================================= */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green-700">Simple & Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black mt-1">
              Application & Onboarding Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 text-center relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-green-100 text-brand-green-700 font-black flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1">Submit Application</h4>
              <p className="text-xs text-gray-600">
                Complete the online form with your academic details, statement of purpose, and CV.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 text-center relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-red-100 text-brand-red-700 font-black flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1">Portfolio Screening</h4>
              <p className="text-xs text-gray-600">
                The UAF Chapter review board evaluates submissions based on merit and dedication.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 text-center relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-green-100 text-brand-green-700 font-black flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1">Interviews & Dialogue</h4>
              <p className="text-xs text-gray-600">
                A brief virtual or in-person session to discuss chapter vision, expectations, and role fit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 text-center relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-red-100 text-brand-red-700 font-black flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1">Official Induction</h4>
              <p className="text-xs text-gray-600">
                Welcome pack, digital credentials, orientation workshop, and mentorship matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OPPORTUNITIES DIRECTORY & FILTERS
         ========================================================================= */}
      <section className="py-20 bg-brand-surface relative overflow-hidden">
        <IslamicPattern opacity={0.03} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Current Openings"
            badgeColor="green"
            title="Active Positions &"
            highlightText="Volunteer Posts"
            highlightColor="red"
            subtitle="Explore verified vacancies across our digital, campus, and central teams. Filter by commitment type below."
          />

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-brand-green-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Opportunities List or Empty State */}
          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          opp.type === 'Volunteer'
                            ? 'bg-brand-green-50 text-brand-green-700 border border-brand-green-200'
                            : opp.type === 'Internship'
                            ? 'bg-brand-red-50 text-brand-red-700 border border-brand-red-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {opp.type}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {opp.commitment}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-brand-black mb-1 group-hover:text-brand-green-700 transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-xs font-semibold text-brand-red-600 mb-3">
                      {opp.department} • <span className="text-gray-500">{opp.location}</span>
                    </p>

                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      {opp.description}
                    </p>

                    {/* Requirements checklist */}
                    <div className="mb-6">
                      <h5 className="text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                        Key Requirements:
                      </h5>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {opp.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Deadline: <strong className="text-brand-black">{opp.deadline}</strong>
                    </span>
                    <button
                      onClick={() => handleApplyClick(opp)}
                      className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Graceful Empty State Component */
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 max-w-xl mx-auto shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-brand-black">No Openings in this Category</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                There are currently no active openings under &apos;{selectedCategory}&apos;. We update our vacancies at the start of each academic semester.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="mt-5 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-brand-green-700 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 transition-colors"
              >
                View All Opportunities
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          APPLICATION FORM SECTION
         ========================================================================= */}
      <section id="application-form-section" className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.04} variant="dual" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Official Application"
            badgeColor="red"
            title="Submit Your"
            highlightText="Candidacy"
            highlightColor="green"
            subtitle="Please complete all required fields accurately. Upload your latest CV/Resume for review by the Central Secretariat."
          />

          {/* Submission Result Modal / Banner */}
          {submissionResult && (
            <div className="mb-8 p-6 rounded-2xl bg-brand-green-50 border-2 border-brand-green-300 text-brand-green-900 shadow-md animate-fadeIn">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-brand-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-brand-green-950">
                    Application Submitted Successfully!
                  </h4>
                  <p className="text-sm mt-1 text-brand-green-800">
                    {submissionResult.message}
                  </p>
                  {submissionResult.applicationId && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-brand-green-200 inline-block text-xs font-mono font-bold text-brand-green-900">
                      Tracking Reference ID: {submissionResult.applicationId}
                    </div>
                  )}
                  <div className="mt-4">
                    <button
                      onClick={() => setSubmissionResult(null)}
                      className="text-xs font-bold text-brand-green-700 underline hover:text-brand-green-900"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Error Banner */}
          {formError && (
            <div className="mb-8 p-4 rounded-xl bg-brand-red-50 border border-brand-red-200 text-brand-red-800 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-brand-red-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Application Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-brand-surface p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-md space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Hamza Malik"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 transition-colors"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hamza@university.edu.pk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                  Phone Number (WhatsApp preferred) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 transition-colors"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                  University / College & Degree *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BS Computer Science, Quaid-i-Azam University"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 transition-colors"
                />
              </div>

              {/* Position Applying For */}
              <div>
                <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                  Position Applying For *
                </label>
                <select
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 transition-colors"
                >
                  <option value="">Select a position or track</option>
                  {CAREER_OPPORTUNITIES.map((opp) => (
                    <option key={opp.id} value={opp.title}>
                      {opp.title} ({opp.type})
                    </option>
                  ))}
                  <option value="General Volunteer / Campus Wing">General Volunteer / Campus Wing</option>
                  <option value="New Chapter Founder">New Chapter Founder</option>
                </select>
              </div>

              {/* Opportunity Type */}
              <div>
                <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                  Opportunity Type *
                </label>
                <select
                  required
                  value={formData.opportunityType}
                  onChange={(e) => setFormData({ ...formData, opportunityType: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 transition-colors"
                >
                  <option value="Volunteer">Volunteer</option>
                  <option value="Internship">Internship</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Core Staff">Core Staff</option>
                  <option value="Campus Membership">Campus Membership</option>
                </select>
              </div>
            </div>

            {/* LinkedIn Profile (Optional) */}
            <div>
              <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                LinkedIn or Portfolio URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 transition-colors"
              />
            </div>

            {/* Short Introduction */}
            <div>
              <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                Short Introduction & Statement of Purpose *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Briefly describe your academic background, motivations, and why you wish to contribute to Student Power..."
                value={formData.introduction}
                onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 transition-colors"
              />
            </div>

            {/* CV / Resume Upload */}
            <div>
              <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                Upload CV / Resume (PDF, DOC, DOCX up to 5MB)
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-brand-green-500 transition-colors bg-white">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-brand-green-600 mb-2" />
                  {resumeFile ? (
                    <div className="text-xs font-bold text-brand-green-800">
                      Selected: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-brand-black">
                        Drag and drop your resume here, or <span className="text-brand-green-700 underline">browse</span>
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Supported formats: PDF, DOCX (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
