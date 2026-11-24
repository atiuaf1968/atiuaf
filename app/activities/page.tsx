'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  ImageIcon,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { IslamicPattern } from '@/components/IslamicPattern';
import { ActivityItem } from '@/lib/types';

export default function CampusActivitiesPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe Box State
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeMsg, setSubscribeMsg] = useState('');

  // Fetch activities from API
  useEffect(() => {
    async function loadActivities() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/activities', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadActivities();
  }, []);

  const filteredActivities = activities.filter((act) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      act.title.toLowerCase().includes(q) ||
      act.location.toLowerCase().includes(q) ||
      act.category.toLowerCase().includes(q) ||
      act.description.toLowerCase().includes(q)
    );
  });

  function openActivityModal(act: ActivityItem, initialIdx = 0) {
    setSelectedActivity(act);
    setActiveImageIdx(initialIdx);
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!subscribeEmail) return;

    setSubscribing(true);
    setSubscribeStatus('idle');
    setSubscribeMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubscribeStatus('success');
        setSubscribeMsg(data.message || 'Subscribed! You will receive an email whenever a new activity is published.');
        setSubscribeEmail('');
      } else {
        setSubscribeStatus('error');
        setSubscribeMsg(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setSubscribeStatus('error');
      setSubscribeMsg('Network error. Please try again.');
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <div className="flex flex-col w-full bg-brand-surface min-h-screen">
      {/* =========================================================================
          CLEAN HERO HEADER
         ========================================================================= */}
      <section className="relative bg-white pt-12 pb-14 border-b border-gray-100 overflow-hidden">
        <IslamicPattern opacity={0.05} variant="dual" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green-50 border border-brand-green-200 text-xs font-bold uppercase tracking-wider text-brand-green-800 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-green-600 animate-pulse" />
            <span>ATI UAF • Campus Activities & Events</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight leading-tight max-w-4xl mx-auto">
            Campus Activities & <span className="text-brand-green-700">Event Gallery</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Official photographic coverage, reports, and proceedings of gatherings, conferences, study halaqas, and student welfare initiatives at the University of Agriculture, Faisalabad.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="w-10 h-1 bg-brand-green-600 rounded-full" />
            <span className="w-3 h-1 bg-brand-red-600 rounded-full" />
            <span className="w-10 h-1 bg-brand-green-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          ACTIVITIES SECTION
         ========================================================================= */}
      <section className="py-12 bg-brand-surface flex-1 relative overflow-hidden">
        <IslamicPattern opacity={0.03} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Top Bar with Search & Counter (when activities exist) */}
          {activities.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-brand-black">Published Activities</h2>
                <p className="text-xs text-gray-500">
                  Showing {filteredActivities.length} {filteredActivities.length === 1 ? 'event' : 'events'}
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events or venues..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-green-600 transition-colors shadow-xs"
                />
              </div>
            </div>
          )}

          {isLoading ? (
            /* Loading State */
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-brand-green-600 animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Loading Campus Activities...
              </p>
            </div>
          ) : filteredActivities.length > 0 ? (
            /* Activities Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Event Image Banner / Cover */}
                    <div
                      onClick={() => openActivityModal(act, 0)}
                      className="h-52 relative overflow-hidden text-white cursor-pointer group/img bg-brand-black"
                    >
                      {act.images && act.images.length > 0 ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={act.images[0]}
                            alt={act.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                            <ImageIcon className="w-3.5 h-3.5 text-brand-green-400" />
                            <span>{act.images.length} {act.images.length === 1 ? 'Photo' : 'Photos'}</span>
                          </div>
                        </>
                      ) : (
                        <div className="h-full bg-gradient-to-tr from-brand-green-900 to-brand-green-950 p-6 flex flex-col justify-between relative">
                          <IslamicPattern opacity={0.15} variant="green" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-green-700/90 text-white backdrop-blur-sm">
                          {act.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <h4 className="text-base font-bold leading-snug text-white drop-shadow group-hover:text-brand-green-200 transition-colors line-clamp-2">
                          {act.title}
                        </h4>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Meta Tags */}
                      <div className="flex flex-col gap-1.5 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-brand-green-600 flex-shrink-0" />
                          <span className="font-semibold text-brand-black">{act.date}</span>
                          {act.time && <span className="text-gray-400">• {act.time}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-brand-red-600 flex-shrink-0" />
                          <span className="line-clamp-1">{act.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {act.description}
                      </p>

                      {/* Photo Thumbnails Strip (up to 4 thumbnails preview) */}
                      {act.images && act.images.length > 1 && (
                        <div className="flex items-center gap-2 mb-2">
                          {act.images.slice(0, 4).map((imgUrl, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                openActivityModal(act, idx);
                              }}
                              className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 hover:border-brand-green-600 hover:scale-105 transition-transform"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imgUrl}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                          {act.images.length > 4 && (
                            <button
                              onClick={() => openActivityModal(act, 4)}
                              className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-bold flex items-center justify-center hover:bg-gray-200"
                            >
                              +{act.images.length - 4}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => openActivityModal(act, 0)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-green-700 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View Photos & Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ===================================================================
                CLEAN, INVITING EMPTY STATE
               =================================================================== */
            <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12 text-center relative overflow-hidden">
              <IslamicPattern opacity={0.06} variant="dual" />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-green-50 border border-brand-green-200 flex items-center justify-center text-brand-green-600 mb-4">
                  <Calendar className="w-8 h-8" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-50 text-brand-green-800 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Session 2025–2026 Activities</span>
                </div>

                <h3 className="text-2xl font-black text-brand-black">
                  No Campus Activities Published Yet
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                  Our UAF chapter is preparing upcoming conventions, Seerah study circles, and blood donation drives. Subscribe below to be notified by email the moment our first event is published!
                </p>

                {/* Newsletter Subscription Box */}
                <div className="mt-6 p-5 bg-brand-surface rounded-2xl border border-gray-200 text-left">
                  <div className="flex items-center gap-2 mb-2 text-brand-green-800 font-bold text-xs uppercase tracking-wider">
                    <Send className="w-3.5 h-3.5" />
                    <span>Get Email Alerts</span>
                  </div>

                  {subscribeStatus === 'success' ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{subscribeMsg}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-2">
                      <input
                        type="email"
                        required
                        value={subscribeEmail}
                        onChange={(e) => setSubscribeEmail(e.target.value)}
                        placeholder="Enter your student or university email"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-green-600"
                      />
                      {subscribeStatus === 'error' && (
                        <p className="text-[11px] text-red-600 font-medium">{subscribeMsg}</p>
                      )}
                      <button
                        type="submit"
                        disabled={subscribing}
                        className="w-full py-2.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {subscribing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Subscribe for Event Notifications</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE PHOTO GALLERY LIGHTBOX MODAL (UP TO 5 PHOTOS)
         ========================================================================= */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute right-4 top-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-lg"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Gallery Viewer */}
            {selectedActivity.images && selectedActivity.images.length > 0 ? (
              <div className="relative bg-black">
                {/* Main Large Image Display */}
                <div className="relative h-72 sm:h-96 w-full flex items-center justify-center bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedActivity.images[activeImageIdx]}
                    alt={`${selectedActivity.title} - photo ${activeImageIdx + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* Previous Button */}
                  {selectedActivity.images.length > 1 && (
                    <button
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === 0 ? selectedActivity.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {/* Next Button */}
                  {selectedActivity.images.length > 1 && (
                    <button
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === selectedActivity.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow"
                      title="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {/* Image Counter Indicator */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold backdrop-blur-sm">
                    Photo {activeImageIdx + 1} of {selectedActivity.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip (Click to switch directly between images) */}
                {selectedActivity.images.length > 1 && (
                  <div className="bg-gray-900 p-3 flex items-center justify-center gap-2 overflow-x-auto">
                    {selectedActivity.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activeImageIdx === idx
                            ? 'border-brand-green-500 scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-brand-green-900 to-brand-green-950 p-6 sm:p-8 text-white relative">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 mb-3">
                  {selectedActivity.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-snug">
                  {selectedActivity.title}
                </h3>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-green-50 text-brand-green-800 border border-brand-green-200 mb-2">
                  {selectedActivity.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-brand-black leading-snug">
                  {selectedActivity.title}
                </h3>

                {/* Metadata Pills */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-green-600" />
                    <span className="font-semibold text-brand-black">{selectedActivity.date}</span>
                  </div>
                  {selectedActivity.time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-green-600" />
                      <span>{selectedActivity.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-red-600" />
                    <span>{selectedActivity.location}</span>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="bg-brand-surface p-5 rounded-2xl border border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green-700 mb-2">
                  Event Description & Summary
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Organizing Wing */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs text-gray-600">
                <span>
                  Organizing Wing: <strong className="text-brand-black">{selectedActivity.organizer}</strong>
                </span>
                <span className="text-[11px] text-gray-400">
                  UAF Chapter
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <Link
                  href="/careers"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Join Next Event</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
