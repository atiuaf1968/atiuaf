'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Building2,
  MessageSquare
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { IslamicPattern } from '@/components/IslamicPattern';
import { SITE_METADATA, FAQS } from '@/lib/data';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    referenceId?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg('Please complete all mandatory fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to deliver message.');
      }

      setResult({
        success: true,
        message: data.message,
        referenceId: data.referenceId,
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'General Inquiry',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-brand-surface">
      {/* =========================================================================
          HERO BANNER
         ========================================================================= */}
      <section className="relative bg-white pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-gray-100 overflow-hidden">
        <IslamicPattern opacity={0.05} variant="dual" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-black tracking-tight leading-tight max-w-4xl mx-auto">
            Contact <span className="text-brand-green-700">Student Power UAF</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have a question regarding campus membership, semester book banks, hostel student rights, or voluntary blood donation? Reach our campus team directly at Jinnah Hall.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
            <span className="w-4 h-1 bg-brand-red-600 rounded-full" />
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          CAMPUS CONTACT INFO CARDS
         ========================================================================= */}
      <section className="py-8 sm:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Campus Office */}
            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1">Campus Location</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Jinnah Hall, University of Agriculture (UAF), Jail Road, Faisalabad
              </p>
              <span className="text-[11px] font-bold text-brand-green-700">Main Campus Chapter Desk</span>
            </div>

            {/* Card 2: Official Email */}
            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-red-100 text-brand-red-700 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1">Official Email</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-1">
                Direct: <a href="mailto:atiuafpak@gmail.com" className="font-bold text-brand-black hover:underline">atiuafpak@gmail.com</a>
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                For official notices, applications & inquiries
              </p>
              <span className="text-[11px] font-bold text-brand-red-600">Monitored Daily</span>
            </div>

            {/* Card 3: Phone Numbers */}
            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1">Helplines & WhatsApp</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-0.5">
                Primary: <a href="tel:+923172011968" className="font-bold text-brand-black hover:underline">+92 317 2011968</a>
              </p>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                Secondary: <a href="tel:03148015678" className="font-bold text-brand-black hover:underline">0314 8015678</a>
              </p>
              <a
                href="https://wa.me/923172011968"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-brand-green-700 underline"
              >
                Chat directly on WhatsApp
              </a>
            </div>

            {/* Card 4: Working Hours */}
            <div className="p-6 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-red-100 text-brand-red-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-brand-black mb-1">Working Hours</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-1">
                Mon – Fri: <strong className="text-brand-black">8:00 AM – 6:00 PM</strong>
              </p>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Saturday & Sunday: <span className="font-bold text-brand-red-600">OFF</span>
              </p>
              <span className="text-[11px] font-bold text-brand-green-700">Emergency Desk Available 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CONTACT FORM & UAF CAMPUS DESK
         ========================================================================= */}
      <section className="py-10 sm:py-14 bg-brand-surface relative overflow-hidden">
        <IslamicPattern opacity={0.03} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-md">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-green-700">UAF Student Desk</span>
                  <h3 className="text-2xl font-black text-brand-black mt-1">Send a Message to UAF Chapter</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Fill out the form below. Your message will be answered directly by the UAF student council coordinators.
                  </p>
                </div>

                {result && (
                  <div className="mb-6 p-5 rounded-xl bg-brand-green-50 border border-brand-green-300 text-brand-green-900 text-sm">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-brand-green-600" />
                      <span>Message Delivered Successfully</span>
                    </div>
                    <p className="text-xs mt-1 text-brand-green-800">{result.message}</p>
                    {result.referenceId && (
                      <p className="mt-2 text-[11px] font-mono text-brand-green-950 font-bold">
                        Tracking Reference ID: {result.referenceId}
                      </p>
                    )}
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-brand-red-50 border border-brand-red-200 text-brand-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-brand-red-600 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Usama Tariq"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. usama@uaf.edu.pk"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Book Bank / Welfare Query"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-brand-surface border border-gray-300 rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 transition-colors"
                      >
                        <option value="General Inquiry">General Campus Inquiry</option>
                        <option value="Membership & Induction">Membership & Induction</option>
                        <option value="Book Bank & Notes">Book Bank & Practical Notes</option>
                        <option value="Student Welfare Aid">Student Welfare Aid</option>
                        <option value="Hostel & Facilities Issue">Hostel & Facilities Issue</option>
                        <option value="Emergency Blood Request">Emergency Blood Request</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your detailed inquiry, department, hostel, or concern here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-brand-surface border border-gray-300 rounded-xl p-4 text-sm text-brand-black focus:outline-none focus:border-brand-green-600 transition-colors"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Delivering...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side: UAF Campus Desk Info & Direct Contact */}
            <div className="lg:col-span-5 space-y-6">
              {/* UAF Chapter Secretariat Details */}
              <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-black">UAF Chapter Office</h4>
                    <p className="text-xs text-brand-green-700 font-semibold">Anjuman Talaba-e-Islam (ATI)</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-gray-600">
                  <div className="pb-3 border-b border-gray-100">
                    <strong className="text-brand-black block mb-0.5">Physical Campus Address:</strong>
                    <span>Jinnah Hall, University of Agriculture (UAF), Jail Road, Faisalabad, Punjab, Pakistan.</span>
                  </div>

                  <div className="pb-3 border-b border-gray-100">
                    <strong className="text-brand-black block mb-0.5">Direct Phone Numbers:</strong>
                    <div className="space-y-1 mt-1">
                      <p>
                        Helpline: <a href="tel:+923172011968" className="font-bold text-brand-green-700 hover:underline">+92 317 2011968</a>
                      </p>
                      <p>
                        Secondary: <a href="tel:03148015678" className="font-bold text-brand-red-600 hover:underline">0314 8015678</a>
                      </p>
                    </div>
                  </div>

                  <div className="pb-3 border-b border-gray-100">
                    <strong className="text-brand-black block mb-0.5">Office Timings:</strong>
                    <p className="text-gray-700">Monday to Friday: <strong>8:00 AM – 6:00 PM</strong></p>
                    <p className="text-brand-red-600 font-semibold mt-0.5">Saturday & Sunday: OFF</p>
                  </div>

                  <div>
                    <strong className="text-brand-black block mb-0.5">Official Inquiries Email:</strong>
                    <a href="mailto:atiuafpak@gmail.com" className="font-bold text-brand-green-700 hover:underline">
                      atiuafpak@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-green-50 to-white border-2 border-brand-green-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-brand-green-600 text-white flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-brand-black">Emergency WhatsApp Support</h4>
                </div>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  For urgent blood requirements for Allied/DHQ hospital patients or emergency student queries, message our coordinators on WhatsApp directly.
                </p>
                <a
                  href="https://wa.me/923172011968"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 transition-colors shadow-sm"
                >
                  <span>Chat on WhatsApp (+92 317 2011968)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION SECTION
         ========================================================================= */}
      <section id="faq" className="py-10 sm:py-14 bg-white relative overflow-hidden border-t border-gray-100">
        <IslamicPattern opacity={0.04} variant="dual" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            title="Questions &"
            highlightText="Clarifications"
            highlightColor="red"
            subtitle="Common questions from UAF students regarding our UAF Desk Chapter, activities, and membership."
          />

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-brand-surface overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-brand-black hover:text-brand-green-700 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-brand-green-600 flex-shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-brand-green-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
