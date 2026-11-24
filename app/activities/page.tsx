'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  BookOpen,
  Heart,
  ShieldCheck,
  Award,
  X,
  Share2,
  ExternalLink,
  ChevronRight,
  ImageIcon
} from 'lucide-react';
import { IslamicPattern } from '@/components/IslamicPattern';
import { SectionHeading } from '@/components/SectionHeading';
import { CAMPUS_ACTIVITIES, CampusActivity, SITE_METADATA, OFFICIAL_MOTTO } from '@/lib/data';

export default function CampusActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<CampusActivity | null>(null);

  const categories = [
    'All',
    'Conventions & Gatherings',
    'Study Halaqas & Seerah',
    'Student Rights & Rallies',
    'Blood Drives & Healthcare',
    'Book Banks & Academic Relief',
    'Workshops & Training',
  ];

  // Filter activities based on Category and Search Query
  const filteredActivities = CAMPUS_ACTIVITIES.filter((act) => {
    const matchesCategory =
      selectedCategory === 'All' || act.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredActivity = CAMPUS_ACTIVITIES.find((act) => act.featured);

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
            <span>Campus Activities & Event Gallery • ATI UAF</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-black tracking-tight leading-tight max-w-4xl mx-auto">
            Campus Life, Gatherings &{' '}
            <span className="text-brand-green-700">Student Events</span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Witness our on-ground activities across the University of Agriculture, Faisalabad. From conventions and study halaqas to blood donation camps and student welfare rallies.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
            <span className="w-4 h-1 bg-brand-red-600 rounded-full" />
            <span className="w-12 h-1 bg-brand-green-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED SPOTLIGHT ACTIVITY (If Available)
         ========================================================================= */}
      {featuredActivity && (
        <section className="py-12 bg-brand-surface border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Event Visual Placeholder / Cover */}
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-green-900 via-brand-green-800 to-brand-green-950 p-8 sm:p-12 flex flex-col justify-between text-white relative overflow-hidden min-h-[280px]">
                <IslamicPattern opacity={0.12} variant="green" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-brand-green-300" />
                    <span>Featured Landmark Event</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                    {featuredActivity.title}
                  </h3>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-white/15 text-xs text-brand-green-100 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-green-300" />
                    <span>{featuredActivity.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-green-300" />
                    <span>{featuredActivity.location}</span>
                  </div>
                </div>
              </div>

              {/* Event Story & Highlights */}
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-green-50 text-brand-green-700 border border-brand-green-200">
                      {featuredActivity.category}
                    </span>
                    {featuredActivity.attendees && (
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {featuredActivity.attendees}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
                    {featuredActivity.description}
                  </p>

                  {/* Highlights Bullet Points */}
                  {featuredActivity.highlights && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                      {featuredActivity.highlights.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-brand-surface p-3 rounded-xl border border-gray-100 text-xs font-semibold text-brand-black"
                        >
                          <span className="text-brand-green-600 font-bold mr-1.5">✓</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Organized by: <strong className="text-brand-black">{featuredActivity.organizer}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedActivity(featuredActivity)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-sm transition-colors flex items-center gap-2"
                  >
                    <span>View Event Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          FILTER BAR & SEARCH
         ========================================================================= */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events, venues, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-brand-surface border border-gray-200 rounded-xl text-xs text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-green-600 text-white shadow-sm'
                      : 'bg-brand-surface text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                  }`}
                >
                  {cat === 'All' ? 'All Activities' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CAMPUS ACTIVITIES DIRECTORY GRID
         ========================================================================= */}
      <section className="py-16 bg-brand-surface relative overflow-hidden">
        <IslamicPattern opacity={0.03} variant="dual" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green-700">
                Official Chapter Timeline
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black mt-0.5">
                {selectedCategory === 'All' ? 'All Campus Activities' : selectedCategory}
              </h2>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Showing {filteredActivities.length} {filteredActivities.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Visual Card Banner */}
                    <div className="h-44 bg-gradient-to-tr from-brand-green-800 to-brand-green-950 p-6 flex flex-col justify-between relative overflow-hidden text-white">
                      <IslamicPattern opacity={0.15} variant="green" />
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            act.badgeColor === 'red'
                              ? 'bg-brand-red-600/90 text-white'
                              : 'bg-white/20 text-white backdrop-blur-sm'
                          }`}
                        >
                          {act.category}
                        </span>
                        {act.attendees && (
                          <span className="text-[11px] font-semibold bg-black/30 px-2.5 py-0.5 rounded-full text-brand-green-100">
                            {act.attendees}
                          </span>
                        )}
                      </div>

                      <div className="relative z-10">
                        <h4 className="text-lg font-bold leading-snug group-hover:text-brand-green-200 transition-colors line-clamp-2">
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

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-5">
                        {act.description}
                      </p>

                      {/* Highlights Pill */}
                      {act.highlights && act.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {act.highlights.slice(0, 2).map((h, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100"
                            >
                              • {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setSelectedActivity(act)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-green-700 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Read Event Report & Photos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 max-w-lg mx-auto shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-full bg-brand-green-50 flex items-center justify-center text-brand-green-600 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-brand-black">No Activities Found</h3>
              <p className="text-xs text-gray-500 mt-1">
                No campus activities matched your search filter &apos;{searchQuery || selectedCategory}&apos;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SUBMIT EVENT PHOTOS & COVERAGE CALLOUT
         ========================================================================= */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-green-900 to-brand-green-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <IslamicPattern opacity={0.12} variant="green" />

            <div className="relative z-10 max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                Media & Chapter Publicity Wing
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Have Photos or an Event to Add?
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 mt-2 leading-relaxed">
                If you have event photographs, videos, or want to coordinate a student study halaqah or blood donation camp in your hostel or department, contact the UAF Press Secretary.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-green-900 bg-white hover:bg-gray-100 shadow transition-colors text-center"
              >
                Send Event Photos
              </Link>
              <Link
                href="/careers"
                className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-700 hover:bg-brand-green-600 border border-white/20 transition-colors text-center"
              >
                Voluntarily Join ATI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FULL ACTIVITY DETAIL MODAL
         ========================================================================= */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Header Cover */}
            <div className="bg-gradient-to-r from-brand-green-900 to-brand-green-950 p-6 sm:p-8 text-white relative">
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 mb-3">
                {selectedActivity.category}
              </span>

              <h3 className="text-xl sm:text-2xl font-black leading-snug">
                {selectedActivity.title}
              </h3>

              <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap gap-4 text-xs text-brand-green-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-green-300" />
                  <span>{selectedActivity.date}</span>
                </div>
                {selectedActivity.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-green-300" />
                    <span>{selectedActivity.time}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-green-300" />
                  <span>{selectedActivity.location}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Event Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green-700 mb-2">
                  Event Overview
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Detailed Story Paragraphs */}
              {selectedActivity.detailedStory && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green-700 mb-2">
                    Event Proceedings & Detailed Report
                  </h4>
                  <div className="space-y-3">
                    {selectedActivity.detailedStory.map((para, i) => (
                      <p key={i} className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Highlights */}
              {selectedActivity.highlights && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green-700 mb-2">
                    Key Accomplishments & Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedActivity.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="bg-brand-surface p-3 rounded-xl border border-gray-100 text-xs font-semibold text-brand-black flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green-600" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organization Metadata */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs text-gray-600">
                <span>
                  Organizing Wing: <strong className="text-brand-black">{selectedActivity.organizer}</strong>
                </span>
                {selectedActivity.attendees && (
                  <span>
                    Participation: <strong className="text-brand-green-700">{selectedActivity.attendees}</strong>
                  </span>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <Link
                  href="/careers"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 transition-colors"
                >
                  Join Next Activity
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
