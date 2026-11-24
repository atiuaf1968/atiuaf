'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  X,
  ChevronRight,
  ChevronLeft,
  ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { ActivityItem } from '@/lib/types';

export default function CampusActivitiesPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

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

  function openActivityModal(act: ActivityItem, initialIdx = 0) {
    setSelectedActivity(act);
    setActiveImageIdx(initialIdx);
  }

  return (
    <div className="flex flex-col w-full bg-brand-surface min-h-screen">
      {/* Clean Header */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand-green-50 text-brand-green-800 text-xs font-bold uppercase tracking-wider mb-3">
            Anjuman Talaba-e-Islam • UAF
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-black tracking-tight">
            Campus Activities
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
            Official photographic coverage and event proceedings at the University of Agriculture, Faisalabad.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-7 h-7 text-brand-green-600 animate-spin" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Loading Activities...
            </p>
          </div>
        ) : activities.length > 0 ? (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Photo Cover */}
                  <div
                    onClick={() => openActivityModal(act, 0)}
                    className="h-48 relative overflow-hidden bg-black cursor-pointer group"
                  >
                    {act.images && act.images.length > 0 ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={act.images[0]}
                          alt={act.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-brand-green-400" />
                          <span>{act.images.length} {act.images.length === 1 ? 'Photo' : 'Photos'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="h-full bg-gradient-to-r from-brand-green-900 to-brand-green-800 p-4 flex items-end text-white text-xs font-bold">
                        {act.category}
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-green-700 text-white">
                        {act.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 z-10">
                      <h4 className="text-sm font-bold text-white line-clamp-2 drop-shadow">
                        {act.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex flex-col gap-1 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-1.5 font-semibold text-brand-black">
                        <Calendar className="w-3.5 h-3.5 text-brand-green-600" />
                        <span>{act.date}</span>
                        {act.time && <span className="text-gray-400 font-normal">• {act.time}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-brand-red-600" />
                        <span className="truncate">{act.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {act.description}
                    </p>

                    {/* Thumbnail previews */}
                    {act.images && act.images.length > 1 && (
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                        {act.images.slice(0, 5).map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => openActivityModal(act, idx)}
                            className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:border-brand-green-600 transition-colors"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`Photo ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => openActivityModal(act, 0)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-green-700 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Event Photos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-md mx-auto py-16 text-center bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-green-50 flex items-center justify-center text-brand-green-600 mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-brand-black">No Campus Activities Published Yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Events and photo galleries will appear here once published by the UAF chapter administration.
            </p>
          </div>
        )}
      </main>

      {/* Lightbox Gallery Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute right-4 top-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Photo Gallery Viewer */}
            {selectedActivity.images && selectedActivity.images.length > 0 ? (
              <div className="bg-black">
                <div className="relative h-72 sm:h-96 w-full flex items-center justify-center bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedActivity.images[activeImageIdx]}
                    alt={`${selectedActivity.title} - photo ${activeImageIdx + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />

                  {selectedActivity.images.length > 1 && (
                    <button
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === 0 ? selectedActivity.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {selectedActivity.images.length > 1 && (
                    <button
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === selectedActivity.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-bold">
                    {activeImageIdx + 1} / {selectedActivity.images.length}
                  </div>
                </div>

                {selectedActivity.images.length > 1 && (
                  <div className="bg-gray-950 p-2.5 flex items-center justify-center gap-2 overflow-x-auto">
                    {selectedActivity.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activeImageIdx === idx ? 'border-brand-green-500 scale-105' : 'border-transparent opacity-60'
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
            ) : null}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-green-50 text-brand-green-800 mb-2">
                  {selectedActivity.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-brand-black leading-snug">
                  {selectedActivity.title}
                </h3>

                <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1 font-semibold text-brand-black">
                    <Calendar className="w-3.5 h-3.5 text-brand-green-600" />
                    <span>{selectedActivity.date}</span>
                  </div>
                  {selectedActivity.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-green-600" />
                      <span>{selectedActivity.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-red-600" />
                    <span>{selectedActivity.location}</span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-surface p-4 rounded-xl border border-gray-100">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedActivity.description}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
