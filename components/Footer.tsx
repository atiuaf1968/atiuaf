'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Heart, ArrowUpRight, Send, CheckCircle2, AlertCircle, RefreshCw, Facebook, Instagram, Youtube, Lock } from 'lucide-react';
import { SITE_METADATA } from '@/lib/data';
import { IslamicPattern } from './IslamicPattern';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [socials, setSocials] = useState(SITE_METADATA.socials);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.socialLinks) {
          setSocials(data.socialLinks);
        }
      })
      .catch(() => {});
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setStatusMessage(data.message || 'Subscribed successfully! Confirmation email sent.');
        setEmail('');
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Network error. Please try again.');
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <footer className="relative bg-brand-black text-gray-300 pt-16 pb-8 border-t-4 border-t-brand-green-600 overflow-hidden">
      {/* Background subtle Islamic pattern */}
      <IslamicPattern opacity={0.04} variant="dual" />

      {/* Red accent glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Organization Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 relative flex-shrink-0">
                <Image
                  src="/images/student-power-logo.png"
                  alt="Student Power Emblem"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-wide">
                  STUDENT <span className="text-brand-red-500">POWER</span>
                </h3>
                <p className="text-xs font-semibold text-brand-green-400 tracking-wider uppercase">
                  انجمن طلبہ اسلام — یونیورسٹی آف ایگریکلچر فیصل آباد
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Student Power is the student empowerment and welfare movement of Anjuman Talaba-e-Islam at the University of Agriculture, Faisalabad (UAF). Fostering Islamic character, academic excellence, leadership development, and campus welfare across all faculties and hostels.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green-950/80 text-brand-green-400 border border-brand-green-800">
                <span className="w-2 h-2 rounded-full bg-brand-green-500" />
                Faith & Character
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-red-950/80 text-brand-red-400 border border-brand-red-800">
                <span className="w-2 h-2 rounded-full bg-brand-red-500" />
                Student Rights
              </span>
            </div>

            {/* Small Glassy Social Corner */}
            <div className="pt-3 border-t border-gray-800/80">
              <p className="text-xs font-bold text-white tracking-wide">
                Follow Student Power UAF
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 mb-2.5">
                Stay updated with campus rallies, conventions, and exam guidance on social media.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Page"
                  aria-label="Facebook Page"
                  className="w-8 h-8 rounded-xl bg-white/[0.07] hover:bg-blue-600/30 backdrop-blur-md border border-white/15 hover:border-blue-400/50 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 shadow-sm hover:scale-105"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter / X"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-xl bg-white/[0.07] hover:bg-white/20 backdrop-blur-md border border-white/15 hover:border-white/40 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 shadow-sm hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-xl bg-white/[0.07] hover:bg-pink-600/30 backdrop-blur-md border border-white/15 hover:border-pink-400/50 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 shadow-sm hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-xl bg-white/[0.07] hover:bg-red-600/30 backdrop-blur-md border border-white/15 hover:border-red-400/50 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 shadow-sm hover:scale-105"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Newsletter Signup */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-green-400" />
              Subscribe to Student Power Dispatch
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              Receive notifications about student conventions, merit scholarships, campus welfare updates, and new campus activities.
            </p>

            {status === 'success' ? (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{statusMessage}</span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="mt-4 flex flex-col sm:flex-row gap-2.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your student or university email"
                  className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-green-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-6 py-2.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                >
                  {subscribing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{statusMessage}</span>
              </p>
            )}
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-gray-800 text-sm">
          {/* Col 1 */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-brand-green-500 pl-2.5 mb-4">
              Organization
            </h5>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Student Power</Link>
              </li>
              <li>
                <Link href="/about#history" className="hover:text-white transition-colors">History & Heritage</Link>
              </li>
              <li>
                <Link href="/about#leadership" className="hover:text-white transition-colors">Central Leadership</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">Join Movement / Volunteer</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white text-gray-500 text-xs flex items-center gap-1 pt-1 transition-colors">
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-brand-red-500 pl-2.5 mb-4">
              Student Initiatives
            </h5>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link href="/activities" className="hover:text-white transition-colors">Campus Activities</Link>
              </li>
              <li>
                <Link href="/about#history" className="hover:text-white transition-colors">Historical Movements</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">Student Welfare & Aid</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">Volunteer Induction</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-brand-green-500 pl-2.5 mb-4">
              Student Resources
            </h5>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link href="/activities" className="hover:text-white transition-colors">Events & Photo Gallery</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Campus Chapter Directory</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Student Legal Aid Helpdesk</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Media & Press Inquiries</Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-brand-red-500 pl-2.5 mb-4">
              UAF Chapter Office
            </h5>
            <ul className="space-y-3 text-gray-400 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-red-400 flex-shrink-0 mt-0.5" />
                <span>Jinnah Hall, UAF, Jail Road, Faisalabad</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-green-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+923172011968" className="hover:text-white font-semibold">
                    +92 317 2011968
                  </a>
                  <a href="tel:03148015678" className="hover:text-white">
                    0314 8015678
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-red-400 flex-shrink-0" />
                <a href="mailto:atiuafpak@gmail.com" className="hover:text-white">
                  atiuafpak@gmail.com
                </a>
              </li>
              <li className="pt-1 text-[11px] text-gray-400 border-t border-gray-800">
                <span>Mon – Fri: 8:00 AM – 6:00 PM</span>
                <span className="block text-brand-red-400">Sat – Sun: OFF</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Corner */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} {SITE_METADATA.name} — Anjuman Talaba-e-Islam. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-[11px] hidden sm:inline">Follow UAF:</span>
            <div className="flex items-center gap-1.5">
              <a
                href={socials.facebook}
                target="_blank"
                rel="noreferrer"
                title="Facebook Page"
                aria-label="Facebook Page"
                className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-blue-600/30 backdrop-blur-md border border-white/10 hover:border-blue-400/50 flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-sm"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                title="Twitter / X"
                aria-label="Twitter / X"
                className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/40 flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-sm"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={socials.instagram}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-pink-600/30 backdrop-blur-md border border-white/10 hover:border-pink-400/50 flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-sm"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={socials.youtube}
                target="_blank"
                rel="noreferrer"
                title="YouTube"
                aria-label="YouTube"
                className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-red-600/30 backdrop-blur-md border border-white/10 hover:border-red-400/50 flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-sm"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

