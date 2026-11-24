'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, ArrowUpRight, Send, CheckCircle2, AlertCircle, RefreshCw, Facebook, Instagram, Youtube, Clock } from 'lucide-react';
import { SITE_METADATA } from '@/lib/data';
import { IslamicPattern } from './IslamicPattern';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [socials, setSocials] = useState(SITE_METADATA.socials);

  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSub =
        window.location.hostname.startsWith('admin.') ||
        window.location.hostname.includes('admin.atiuaf.com') ||
        window.location.pathname.startsWith('/admin');
      if (isSub) {
        setIsAdminRoute(true);
      }
    }
  }, []);

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

  if (pathname?.startsWith('/admin') || isAdminRoute) {
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

      {/* Glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section: 2 Columns (Brand & UAF Chapter Office with Compact Subscribe) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info (Left - 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
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

            <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
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
          </div>

          {/* UAF Chapter Office & Small Subscribe Box (Right - 5 cols) */}
          <div className="lg:col-span-5 bg-gray-900/40 p-6 rounded-2xl border border-gray-800/80 space-y-4">
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-brand-red-500 pl-2.5 mb-3">
                UAF Chapter Office
              </h5>
              <ul className="space-y-2.5 text-gray-300 text-xs">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-red-400 flex-shrink-0 mt-0.5" />
                  <span>Jinnah Hall, UAF, Jail Road, Faisalabad</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-green-400 flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <a href="tel:+923172011968" className="hover:text-white font-semibold">
                      +92 317 2011968
                    </a>
                    <span className="text-gray-600">•</span>
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
                <li className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
                  <Clock className="w-3.5 h-3.5 text-brand-green-400 flex-shrink-0" />
                  <span>Mon – Fri: 8:00 AM – 6:00 PM</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-brand-red-400 font-medium">Sat – Sun: OFF</span>
                </li>
              </ul>
            </div>

            {/* Small Email Subscribe Box */}
            <div className="pt-3 border-t border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-brand-green-400" />
                  Subscribe for Updates
                </span>
                <span className="text-[10px] text-gray-500">New campus activities</span>
              </div>

              {status === 'success' ? (
                <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter student email"
                    className="flex-1 min-w-0 bg-black/60 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-green-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-3.5 py-1.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm disabled:opacity-60 flex-shrink-0"
                  >
                    {subscribing ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <span>Join</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {status === 'error' && (
                <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{statusMessage}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Single Social Icons */}
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
