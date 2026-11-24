'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  Tag,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Users,
  Sparkles,
  X,
  FileText,
  ImageIcon,
  Send,
  Check,
  Settings,
  Share2,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Phone,
} from 'lucide-react';
import { IslamicPattern } from '@/components/IslamicPattern';
import { ActivityItem, SubscriberItem, SocialLinks, DEFAULT_SOCIAL_LINKS } from '@/lib/types';

const CATEGORIES = [
  'Conventions & Gatherings',
  'Study Halaqas & Seerah',
  'Student Rights & Rallies',
  'Blood Drives & Healthcare',
  'Book Banks & Academic Relief',
  'Workshops & Training',
  'Sports & Youth Festivals',
  'Campus Life & Activities',
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin@atiuaf.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'new' | 'list' | 'subscribers' | 'settings'>('new');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [stats, setStats] = useState({ totalActivities: 0, totalSubscribers: 0, activeSubscribers: 0 });
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Social Media & Settings State (Stored in PostgreSQL)
  const [socials, setSocials] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // New Activity Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });
  const [time, setTime] = useState('11:00 AM – 02:00 PM');
  const [location, setLocation] = useState('University of Agriculture Faisalabad (UAF)');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('Anjuman Talaba-e-Islam (ATI UAF)');
  const [featured, setFeatured] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState('');

  // Upload & Submit States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [broadcastInfo, setBroadcastInfo] = useState<{ sentCount: number; totalSubscribers: number } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check login status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/me');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchDashboardData();
        fetchSettings();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }

  async function fetchDashboardData() {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/admin/activities');
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
        setSubscribers(data.subscribers || []);
        setStats(data.stats || { totalActivities: 0, totalSubscribers: 0, activeSubscribers: 0 });
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }

  async function fetchSettings() {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.socialLinks) {
          setSocials(data.socialLinks);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchDashboardData();
        fetchSettings();
      } else {
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch {
      setLoginError('Network error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setIsAuthenticated(false);
    }
  }

  // Handle uploading files (up to 5 images total)
  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError('');

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      setUploadError('You have already added the maximum of 5 images.');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);

    try {
      const formData = new FormData();
      filesToUpload.forEach((f) => formData.append('images', f));

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.urls)) {
        setImages((prev) => [...prev, ...data.urls].slice(0, 5));
      } else {
        setUploadError(data.error || 'Image upload failed.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload images.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleAddManualImage() {
    const trimmed = manualImageUrl.trim();
    if (!trimmed) return;
    if (images.length >= 5) {
      setUploadError('Maximum of 5 images allowed per activity.');
      return;
    }
    setImages((prev) => [...prev, trimmed].slice(0, 5));
    setManualImageUrl('');
    setUploadError('');
  }

  function handleRemoveImage(indexToRemove: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  async function handleSubmitActivity(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setBroadcastInfo(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        category,
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        organizer: organizer.trim(),
        featured,
        images,
        notifySubscribers,
      };

      const res = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess('Activity published successfully to database!');
        if (data.broadcast) {
          setBroadcastInfo(data.broadcast);
        }

        // Reset form
        setTitle('');
        setDescription('');
        setImages([]);
        setFeatured(false);

        // Refresh data
        fetchDashboardData();
        setActiveTab('list');
      } else {
        setSubmitError(data.error || 'Failed to publish activity.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit activity.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteActivity(id: string) {
    if (!confirm('Are you sure you want to delete this campus activity? This cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/activities?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActivities((prev) => prev.filter((a) => a.id !== id));
        setStats((prev) => ({ ...prev, totalActivities: Math.max(0, prev.totalActivities - 1) }));
      } else {
        alert(data.error || 'Failed to delete activity.');
      }
    } catch {
      alert('Network error while deleting activity.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (newAdminPassword && newAdminPassword !== confirmAdminPassword) {
      setSettingsError('New password and confirmation do not match.');
      return;
    }

    setIsSavingSettings(true);

    try {
      const payload: any = {
        socialLinks: socials,
      };

      if (newAdminPassword) {
        payload.newAdminPassword = newAdminPassword;
        payload.adminEmail = 'admin@atiuaf.com';
      }

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSettingsSuccess(
          newAdminPassword
            ? 'Social media links and Admin password updated in PostgreSQL!'
            : 'Social media links updated successfully in PostgreSQL!'
        );
        setNewAdminPassword('');
        setConfirmAdminPassword('');
        if (data.socialLinks) {
          setSocials(data.socialLinks);
        }
      } else {
        setSettingsError(data.error || 'Failed to update settings.');
      }
    } catch {
      setSettingsError('Network error while saving settings.');
    } finally {
      setIsSavingSettings(false);
    }
  }

  // ---------------------------------------------------------------------------
  // AUTH CHECK LOADING VIEW
  // ---------------------------------------------------------------------------
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-brand-green-600 animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-surface relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <IslamicPattern opacity={0.06} variant="dual" />

        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8">
          {/* Header & Logo */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 relative flex items-center justify-center rounded-2xl bg-brand-green-50 border border-brand-green-200">
              <Image
                src="/images/student-power-logo.png"
                alt="Student Power Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-red-50 border border-brand-red-200 text-brand-red-700 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal • admin.atiuaf.com</span>
            </div>
            <h1 className="text-2xl font-black text-brand-black">ATI UAF Admin Portal</h1>
            <p className="text-xs text-gray-500 mt-1">
              Authorized access to publish campus activities, upload event galleries, update social links, and broadcast student updates.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@atiuaf.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-brand-black font-medium focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-brand-black font-medium focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-brand-surface rounded-xl border border-gray-200/80 text-[11px] text-gray-600 space-y-0.5">
              <p className="font-bold text-brand-black">Default Credentials:</p>
              <p>Email: <span className="font-mono text-brand-green-700 font-bold">admin@atiuaf.com</span></p>
              <p>Password: <span className="font-mono text-brand-green-700 font-bold">atiuaf1968</span></p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Log In to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-gray-500 hover:text-brand-green-700 transition-colors"
            >
              ← Return to ATI UAF Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-brand-surface text-brand-black">
      {/* Top Admin Header Bar */}
      <header className="bg-brand-black text-white border-b-4 border-b-brand-green-600 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex-shrink-0 bg-white/10 p-1 rounded-xl">
              <Image
                src="/images/student-power-logo.png"
                alt="Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wide text-white">ATI UAF Admin Desk</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green-600 text-white">
                  PostgreSQL Connected
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Logged in as <span className="text-brand-green-400 font-mono">admin@atiuaf.com</span> • <span className="text-gray-300">admin.atiuaf.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/activities"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span>View Activities Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-900 border border-red-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Published Activities</p>
              <h3 className="text-2xl font-black text-brand-black mt-1">{stats.totalActivities}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-green-50 text-brand-green-700 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Subscribers</p>
              <h3 className="text-2xl font-black text-brand-black mt-1">{stats.totalSubscribers}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Email Broadcasts</p>
              <h3 className="text-2xl font-black text-brand-red-600 mt-1">{stats.activeSubscribers}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-brand-red-700 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Subdomain Access</p>
              <h3 className="text-sm font-black text-brand-green-700 mt-1">admin.atiuaf.com</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'new'
                ? 'bg-brand-green-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'list'
                ? 'bg-brand-green-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Activities ({activities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'subscribers'
                ? 'bg-brand-green-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Subscribers Registry ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-brand-green-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Social Links & DB Settings</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: PUBLISH NEW ACTIVITY FORM
           ========================================================================= */}
        {activeTab === 'new' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="border-b border-gray-100 pb-5 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-50 text-brand-green-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Publish & Broadcast Event (PostgreSQL Storage)</span>
              </div>
              <h2 className="text-2xl font-black text-brand-black">Add New Campus Activity</h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill out the activity details and upload up to 5 photos. If email broadcast is enabled, all subscribed students will receive an instant notification with full event details!
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{submitSuccess}</p>
                  {broadcastInfo && (
                    <p className="text-xs text-emerald-700 mt-1">
                      Email broadcast sent to {broadcastInfo.sentCount} of {broadcastInfo.totalSubscribers} active subscribers.
                    </p>
                  )}
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitActivity} className="space-y-6">
              {/* Activity Name / Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Activity Name / Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Seerah Conference & Quranic Recitation 2026"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Grid: Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Nov 24, 2026"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Grid: Time & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Timing (Optional)
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 11:00 AM – 02:00 PM"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Venue / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Iqbal Hall / Jinnah Auditorium, UAF"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Activity Description & Proceedings *
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of the event, chief guests, student participation, resolutions passed, or blood donation achievements..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors leading-relaxed"
                />
              </div>

              {/* Organizing Wing */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Organizing Wing / Desk
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. Anjuman Talaba-e-Islam (ATI UAF) • Blood Society"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                />
              </div>

              {/* =============================================================
                  IMAGE UPLOAD (UP TO 5 IMAGES VIA VERCEL BLOB)
                 ============================================================= */}
              <div className="p-6 bg-brand-surface rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-brand-black flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-brand-green-600" />
                      <span>Event Images (Up to 5 Photos)</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Uploaded photos will be stored on Vercel Blob and viewable in full resolution by students clicking on the activity.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-brand-black">
                    {images.length} / 5 Images Added
                  </span>
                </div>

                {uploadError && (
                  <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Upload Action Area */}
                {images.length < 5 && (
                  <div className="mb-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      disabled={isUploading}
                      className="hidden"
                      id="activity-images-input"
                    />
                    <label
                      htmlFor="activity-images-input"
                      className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-brand-green-500 rounded-2xl p-6 flex flex-col items-center justify-center bg-white transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brand-green-50 group-hover:bg-brand-green-100 text-brand-green-600 flex items-center justify-center mb-2 transition-colors">
                        {isUploading ? (
                          <RefreshCw className="w-6 h-6 animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6" />
                        )}
                      </div>
                      <p className="text-xs font-bold text-brand-black">
                        {isUploading ? 'Uploading to Vercel Blob...' : 'Click or Drag to Upload Photos'}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        PNG, JPG, or WebP up to 10MB each ({5 - images.length} slots remaining)
                      </p>
                    </label>

                    {/* Or paste direct URL */}
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="url"
                        value={manualImageUrl}
                        onChange={(e) => setManualImageUrl(e.target.value)}
                        placeholder="Or paste external image URL directly..."
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-brand-black focus:outline-none focus:border-brand-green-600"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualImage}
                        className="px-4 py-2 bg-gray-800 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                )}

                {/* Thumbnail Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white aspect-video shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                          #{idx + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Options: Featured & Notify Subscribers */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifySubscribers}
                    onChange={(e) => setNotifySubscribers(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-green-600 focus:ring-brand-green-500 border-gray-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-brand-black flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-brand-red-600" />
                      Broadcast email to all registered subscribers upon publishing
                    </span>
                    <p className="text-[11px] text-gray-500">
                      Currently notifies {stats.activeSubscribers} active student subscribers via Mailtrap SMTP.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-gray-200">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-green-600 focus:ring-brand-green-500 border-gray-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-brand-black flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-green-600" />
                      Feature this activity prominently at the top of the campus page
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing Activity & Sending Notifications...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Publish Campus Activity</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PUBLISHED ACTIVITIES LIST
           ========================================================================= */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5 mb-6">
              <div>
                <h2 className="text-xl font-black text-brand-black">Published Campus Activities</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Stored in PostgreSQL database and displayed live on atiuaf.com/activities.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('new')}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-12 px-4 max-w-md mx-auto">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-green-50 flex items-center justify-center text-brand-green-600 mb-3">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-brand-black">No Activities Published Yet</h3>
                <p className="text-xs text-gray-500 mt-1">
                  You haven&apos;t added any campus events yet. Click &quot;Add Activity&quot; above to publish your first event!
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-brand-green-600 hover:bg-brand-green-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish First Activity</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="border border-gray-200 rounded-2xl overflow-hidden bg-brand-surface flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Image Preview / Header */}
                      {act.images && act.images.length > 0 ? (
                        <div className="h-40 relative bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={act.images[0]}
                            alt={act.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold">
                            📷 {act.images.length} {act.images.length === 1 ? 'photo' : 'photos'}
                          </div>
                        </div>
                      ) : (
                        <div className="h-28 bg-gradient-to-r from-brand-green-900 to-brand-green-800 p-4 flex items-end text-white">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                            {act.category}
                          </span>
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                          <Calendar className="w-3 h-3 text-brand-green-600" />
                          <span>{act.date}</span>
                          {act.time && <span>• {act.time}</span>}
                        </div>

                        <h4 className="text-sm font-bold text-brand-black line-clamp-2 mb-2">
                          {act.title}
                        </h4>

                        <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                          {act.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                          <MapPin className="w-3 h-3 text-brand-red-600 flex-shrink-0" />
                          <span className="truncate">{act.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between mt-3">
                      <Link
                        href="/activities"
                        target="_blank"
                        className="text-xs font-bold text-brand-green-700 hover:underline flex items-center gap-1"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        disabled={deletingId === act.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 transition-colors flex items-center gap-1"
                      >
                        {deletingId === act.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: SUBSCRIBERS REGISTRY
           ========================================================================= */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-xl font-black text-brand-black">Subscribers Registry (PostgreSQL)</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Students and members who subscribed to campus notifications. They will receive automated emails whenever you publish an activity.
              </p>
            </div>

            {subscribers.length === 0 ? (
              <div className="text-center py-12 px-4 max-w-md mx-auto">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-brand-black">No Subscribers Yet</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Students can subscribe using the newsletter boxes on the website or activities page.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Subscribed Date</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {subscribers.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-brand-black">{sub.email}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(sub.subscribedAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              sub.active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${sub.active ? 'bg-emerald-500' : 'bg-gray-400'}`}
                            />
                            {sub.active ? 'Active' : 'Unsubscribed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: SOCIAL MEDIA LINKS & DATABASE SETTINGS
           ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Notification Alerts */}
            {settingsSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            {settingsError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{settingsError}</span>
              </div>
            )}

            {/* Subdomain Card */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-500/20 text-brand-green-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Subdomain Routing Active</span>
                </div>
                <h3 className="text-xl font-black">admin.atiuaf.com</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-lg">
                  This admin panel can be accessed either at <span className="text-white font-mono font-bold">admin.atiuaf.com</span> or at <span className="text-white font-mono font-bold">atiuaf.com/admin</span>.
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-gray-300">
                Host: <strong className="text-brand-green-400">admin.atiuaf.com</strong>
              </div>
            </div>

            {/* Form: Social Media Links (Stored in PostgreSQL site_settings) */}
            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 space-y-8">
              {/* Header */}
              <div className="border-b border-gray-100 pb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Footer & Global Social Media Links</span>
                </div>
                <h2 className="text-2xl font-black text-brand-black">Update Social Media Links</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Modifying these URLs updates the official social buttons across the entire website and footer in real-time. Stored directly in PostgreSQL.
                </p>
              </div>

              {/* Social Links Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook Page URL</span>
                  </label>
                  <input
                    type="url"
                    value={socials.facebook}
                    onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 fill-current text-black" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter / X Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={socials.twitter}
                    onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Instagram Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={socials.instagram}
                    onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span>YouTube Channel URL</span>
                  </label>
                  <input
                    type="url"
                    value={socials.youtube}
                    onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-green-600" />
                    <span>WhatsApp / Contact Helpline</span>
                  </label>
                  <input
                    type="text"
                    value={socials.whatsapp || ''}
                    onChange={(e) => setSocials({ ...socials, whatsapp: e.target.value })}
                    placeholder="+923172011968"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-brand-black focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Password Management Section (Stored in PostgreSQL admin_users) */}
              <div className="pt-8 border-t border-gray-100">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-brand-red-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Key className="w-3.5 h-3.5" />
                    <span>PostgreSQL Password Storage</span>
                  </div>
                  <h3 className="text-lg font-black text-brand-black">Update Admin Password</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Leave blank if you do not want to change your current admin password.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      New Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Enter new password (optional)"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-brand-black font-medium focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-brand-black font-medium focus:outline-none focus:border-brand-green-600 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full py-3.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSavingSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to PostgreSQL...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Social Links & Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
