'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, ChevronRight, ShieldCheck, Heart } from 'lucide-react';
import { SITE_METADATA } from '@/lib/data';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Programs & Impact', href: '/#programs' },
    { name: 'Careers & Join', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Institutional Notification Bar */}
      <div className="bg-brand-black text-gray-200 text-xs py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-brand-green-400 font-semibold tracking-wide">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="hidden md:inline text-gray-500">•</span>
            <span className="hidden md:inline text-gray-300">Anjuman Talaba-e-Islam — University of Agriculture, Faisalabad (UAF)</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <a
              href={`mailto:${SITE_METADATA.contactEmail}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-brand-red-400" />
              <span className="hidden sm:inline">{SITE_METADATA.contactEmail}</span>
            </a>
            <span className="text-gray-600">|</span>
            <a
              href={`tel:${SITE_METADATA.contactPhone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-green-400" />
              <span>{SITE_METADATA.contactPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5'
            : 'bg-white py-3.5 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand Lockup */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
                <Image
                  src="/images/student-power-logo.png"
                  alt="Student Power Official Logo"
                  width={56}
                  height={56}
                  priority
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-black">
                    STUDENT
                  </span>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-red-600">
                    POWER
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-green-700 tracking-wider uppercase">
                  <span>انجمن طلبہ اسلام</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-brand-green-800 font-bold">UAF Chapter</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative py-1 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'text-brand-green-700'
                        : 'text-gray-700 hover:text-brand-green-600'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Dual Red & Green Action CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-red-700 bg-brand-red-50 hover:bg-brand-red-100 border border-brand-red-200 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 text-brand-red-600" />
                <span>Join Movement</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-lg shadow-sm hover:shadow transition-all duration-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Secretariat</span>
              </Link>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-brand-green-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white shadow-xl animate-fadeIn">
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold ${
                    pathname === link.href
                      ? 'bg-brand-green-50 text-brand-green-700 border-l-4 border-brand-green-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green-600'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}

              <div className="pt-4 mt-3 border-t border-gray-100 flex flex-col gap-2.5">
                <Link
                  href="/careers"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-lg shadow-sm"
                >
                  Join Student Power
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-bold uppercase tracking-wider text-brand-red-700 bg-brand-red-50 hover:bg-brand-red-100 border border-brand-red-200 rounded-lg"
                >
                  Contact Secretariat
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
