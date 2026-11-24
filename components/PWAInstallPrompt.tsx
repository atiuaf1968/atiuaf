'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Download, X, Share2, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Default to true so it NEVER flashes or appears on admin panel
  const pathname = usePathname();

  useEffect(() => {
    // Check if current context is the admin portal
    if (typeof window !== 'undefined') {
      const isCurrentAdmin =
        window.location.hostname.startsWith('admin.') ||
        window.location.hostname.includes('admin.atiuaf.com') ||
        window.location.pathname.startsWith('/admin') ||
        window.location.pathname.includes('/admin') ||
        window.location.search.includes('admin');

      if (isCurrentAdmin) {
        setIsAdmin(true);
        return; // Strict early return: never register or show PWA on admin
      }
      setIsAdmin(false);
    }

    // 1. Register Service Worker on main public site only
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((err) => console.log('Service Worker registration skipped:', err));
      });
    }

    // 2. Check if already installed / standalone
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check if user dismissed recently
      const dismissedTime = localStorage.getItem('atiuaf_pwa_dismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }

      // Detect iOS Safari
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome|crios|firefox|fxios/.test(userAgent);
      if (isIPhoneOrIPad && isSafari && !isStandalone) {
        setIsIOS(true);
        setIsInstallable(true);
      }
    }

    // 3. Capture beforeinstallprompt (Chrome, Android, Edge, Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (err) {
      console.error('Error invoking PWA prompt:', err);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('atiuaf_pwa_dismissed', Date.now().toString());
    } catch {
      // Ignore localStorage errors
    }
  };

  // Do not render on admin panel, or if already installed or dismissed
  if (
    isAdmin ||
    pathname?.startsWith('/admin') ||
    pathname?.includes('/admin') ||
    isInstalled ||
    isDismissed ||
    !isInstallable
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[999] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-brand-green-500 shadow-2xl text-brand-black relative overflow-hidden">
        {/* Subtle decorative top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-green-600 via-brand-green-400 to-brand-red-600" />

        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 p-1 flex items-center justify-center flex-shrink-0 shadow-md">
              <Image
                src="/images/logo-192.png"
                alt="ATI UAF Logo"
                width={44}
                height={44}
                className="w-10 h-10 object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-brand-green-700 bg-brand-green-50 px-2 py-0.5 rounded-full border border-brand-green-200">
                  Official Web App
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green-500 animate-pulse" />
              </div>
              <h4 className="text-sm font-extrabold text-brand-black mt-1">
                Install ATI UAF App
              </h4>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss app install banner"
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
          Install on your phone or computer for instant access to student rights helpdesk, book bank, and campus event alerts.
        </p>

        {showIOSGuide && (
          <div className="mt-3 p-3 bg-brand-green-50 rounded-xl border border-brand-green-200 text-xs text-brand-black space-y-1.5 animate-in fade-in">
            <p className="font-bold flex items-center gap-1.5 text-brand-green-800">
              <Share2 className="w-3.5 h-3.5 text-brand-green-600" />
              How to install on iPhone / iPad:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-gray-700 font-medium text-[11px]">
              <li>Tap the <span className="font-bold">Share</span> button at the bottom of Safari.</li>
              <li>Scroll down and tap <span className="font-bold">&ldquo;Add to Home Screen&rdquo;</span>.</li>
              <li>Tap <span className="font-bold text-brand-green-700">&ldquo;Add&rdquo;</span> in the top right corner.</li>
            </ol>
          </div>
        )}

        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 active:scale-95 shadow-md shadow-brand-green-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>

          <button
            onClick={handleDismiss}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-brand-black hover:bg-gray-100 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
