import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft, Mail } from 'lucide-react';
import { IslamicPattern } from '@/components/IslamicPattern';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center relative bg-brand-surface px-4 py-20 overflow-hidden">
      <IslamicPattern opacity={0.06} variant="dual" />

      <div className="relative max-w-lg mx-auto text-center bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl">
        <div className="w-24 h-24 mx-auto relative mb-6">
          <Image
            src="/images/student-power-logo.png"
            alt="Student Power Emblem"
            width={96}
            height={96}
            className="w-full h-full object-contain drop-shadow"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-red-50 text-brand-red-700 border border-brand-red-200 mb-3">
          Error 404 — Page Not Found
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-brand-black tracking-tight">
          Destination Uncharted
        </h1>

        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          The page or document you are attempting to access does not exist or has been relocated to another section of the Student Power portal.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-red-700 bg-brand-red-50 hover:bg-brand-red-100 border border-brand-red-200 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Secretariat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
