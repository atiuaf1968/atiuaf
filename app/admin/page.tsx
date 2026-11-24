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
  ExternalLink,
  LogOut,
  ShieldCheck,
  Users,
  Sparkles,
  X,
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
  UserCheck,
  MessageSquare,
  Edit3,
  Search,
  Filter,
  Save,
  BookOpen,
  Home,
  FileText,
} from 'lucide-react';
import { IslamicPattern } from '@/components/IslamicPattern';
import {
  ActivityItem,
  SubscriberItem,
  SocialLinks,
  DEFAULT_SOCIAL_LINKS,
  VolunteerApplication,
  ContactSubmission,
} from '@/lib/types';

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

export default function StandaloneAdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin@atiuaf.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'volunteers' | 'contacts' | 'activities' | 'new-activity' | 'subscribers' | 'settings'
  >('volunteers');

  // Dashboard Data State (from PostgreSQL)
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalContacts: 0,
    totalActivities: 0,
    totalSubscribers: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Search & Filter
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // Editing Volunteer State
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerApplication | null>(null);
  const [isSavingVolunteer, setIsSavingVolunteer] = useState(false);
  const [editVolSuccess, setEditVolSuccess] = useState('');
  const [editVolError, setEditVolError] = useState('');

  // Editing Contact Submission State
  const [editingContact, setEditingContact] = useState<ContactSubmission | null>(null);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [editContactSuccess, setEditContactSuccess] = useState('');
  const [editContactError, setEditContactError] = useState('');

  // Social Media & DB Settings State
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

  // Upload & Action States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Auth Check
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/me');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }

  async function loadAllData() {
    setIsLoadingData(true);
    try {
      // 1. Load volunteers & contact inquiries from PostgreSQL
      const subRes = await fetch('/api/admin/submissions');
      if (subRes.ok) {
        const subData = await subRes.json();
        setVolunteers(subData.volunteers || []);
        setContacts(subData.contacts || []);
        setStats((prev) => ({
          ...prev,
          totalVolunteers: (subData.volunteers || []).length,
          totalContacts: (subData.contacts || []).length,
        }));
      }

      // 2. Load activities & subscribers
      const actRes = await fetch('/api/admin/activities');
      if (actRes.ok) {
        const actData = await actRes.json();
        setActivities(actData.activities || []);
        setSubscribers(actData.subscribers || []);
        setStats((prev) => ({
          ...prev,
          totalActivities: (actData.activities || []).length,
          totalSubscribers: (actData.subscribers || []).length,
        }));
      }

      // 3. Load social media settings
      const setRes = await fetch('/api/admin/settings');
      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData.socialLinks) {
          setSocials(setData.socialLinks);
        }
      }
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setIsLoadingData(false);
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
        loadAllData();
      } else {
        setLoginError(data.error || 'Invalid admin credentials.');
      }
    } catch {
      setLoginError('Network connection error.');
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

  // ---------------------------------------------------------------------------
  // VOLUNTEER USER DATA EDITING
  // ---------------------------------------------------------------------------

  async function handleSaveVolunteerEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVolunteer) return;

    setIsSavingVolunteer(true);
    setEditVolSuccess('');
    setEditVolError('');

    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'volunteer',
          id: editingVolunteer.id,
          updates: editingVolunteer,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEditVolSuccess('User data saved successfully to PostgreSQL database!');
        setVolunteers((prev) =>
          prev.map((v) => (v.id === editingVolunteer.id ? editingVolunteer : v))
        );
        setTimeout(() => {
          setEditingVolunteer(null);
          setEditVolSuccess('');
        }, 1200);
      } else {
        setEditVolError(data.error || 'Failed to save changes.');
      }
    } catch {
      setEditVolError('Network error while saving user data.');
    } finally {
      setIsSavingVolunteer(false);
    }
  }

  async function handleDeleteVolunteer(id: string) {
    if (!confirm('Are you sure you want to delete this voluntary membership application?')) return;
    try {
      const res = await fetch(`/api/admin/submissions?type=volunteer&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
        setStats((prev) => ({ ...prev, totalVolunteers: Math.max(0, prev.totalVolunteers - 1) }));
      }
    } catch {
      alert('Failed to delete volunteer record.');
    }
  }

  // ---------------------------------------------------------------------------
  // CONTACT SUBMISSION DATA EDITING
  // ---------------------------------------------------------------------------

  async function handleSaveContactEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingContact) return;

    setIsSavingContact(true);
    setEditContactSuccess('');
    setEditContactError('');

    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          id: editingContact.id,
          updates: editingContact,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEditContactSuccess('Contact inquiry saved successfully to PostgreSQL!');
        setContacts((prev) =>
          prev.map((c) => (c.id === editingContact.id ? editingContact : c))
        );
        setTimeout(() => {
          setEditingContact(null);
          setEditContactSuccess('');
        }, 1200);
      } else {
        setEditContactError(data.error || 'Failed to save inquiry changes.');
      }
    } catch {
      setEditContactError('Network error while saving inquiry data.');
    } finally {
      setIsSavingContact(false);
    }
  }

  async function handleDeleteContact(id: string) {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    try {
      const res = await fetch(`/api/admin/submissions?type=contact&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        setStats((prev) => ({ ...prev, totalContacts: Math.max(0, prev.totalContacts - 1) }));
      }
    } catch {
      alert('Failed to delete contact record.');
    }
  }

  // ---------------------------------------------------------------------------
  // SETTINGS & PASSWORD UPDATE (BCRYPT HASHED)
  // ---------------------------------------------------------------------------

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (newAdminPassword && newAdminPassword !== confirmAdminPassword) {
      setSettingsError('New passwords do not match.');
      return;
    }

    setIsSavingSettings(true);

    try {
      const payload: any = { socialLinks: socials };
      if (newAdminPassword) {
        payload.newAdminPassword = newAdminPassword;
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
            ? 'Social media links and bcrypt hashed password updated in PostgreSQL!'
            : 'Social media links updated successfully in PostgreSQL!'
        );
        setNewAdminPassword('');
        setConfirmAdminPassword('');
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
  // ACTIVITY SUBMIT (UP TO 5 IMAGES VIA VERCEL BLOB)
  // ---------------------------------------------------------------------------

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError('');

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      setUploadError('Maximum of 5 images allowed per activity.');
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmitActivity(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
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
        setSubmitSuccess('Campus activity published successfully to PostgreSQL database!');
        setTitle('');
        setDescription('');
        setImages([]);
        loadAllData();
        setActiveTab('activities');
      } else {
        setSubmitError(data.error || 'Failed to publish activity.');
      }
    } catch {
      setSubmitError('Failed to publish activity.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteActivity(id: string) {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/activities?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setActivities((prev) => prev.filter((a) => a.id !== id));
        setStats((prev) => ({ ...prev, totalActivities: Math.max(0, prev.totalActivities - 1) }));
      }
    } finally {
      setDeletingId(null);
    }
  }

  // Filtered lists
  const filteredVolunteers = volunteers.filter((v) => {
    if (!volunteerSearch.trim()) return true;
    const q = volunteerSearch.toLowerCase();
    return (
      v.fullName.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.phone.includes(q) ||
      (v.cnic && v.cnic.includes(q)) ||
      (v.hostel && v.hostel.toLowerCase().includes(q)) ||
      (v.degree && v.degree.toLowerCase().includes(q))
    );
  });

  const filteredContacts = contacts.filter((c) => {
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q)
    );
  });

  // ---------------------------------------------------------------------------
  // AUTH CHECK LOADING VIEW
  // ---------------------------------------------------------------------------
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold tracking-wide">Loading ATI Admin Application...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STANDALONE LOGIN SCREEN (No public website navbar or footer)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-7 sm:p-9 relative">
          <div className="text-center mb-7">
            <div className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 p-2 shadow-inner">
              <Image
                src="/images/student-power-logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Application</span>
            </div>

            <h1 className="text-2xl font-black text-white">ATI UAF Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct access for authorized administrators to manage members, events, and PostgreSQL database records.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@atiuaf.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Authorized Personnel: </span>
              <span className="text-slate-400">Restricted portal for ATI UAF Chapter Executive Cabinet and Administrators.</span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Admin Application</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STANDALONE APPLICATION LAYOUT (Brand new web application interface)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex-shrink-0 bg-white/10 p-1 rounded-xl">
            <Image
              src="/images/student-power-logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-black text-white tracking-wide truncate">
                ATI UAF <span className="text-emerald-400">Admin</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate hidden sm:block">
              admin@atiuaf.com • admin.atiuaf.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-900 border border-red-800/80 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Sticky Horizontal Tab Navigation (Mobile Only) */}
      <div className="md:hidden bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3 py-2 sticky top-[49px] z-30 overflow-x-auto no-scrollbar flex items-center gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
            activeTab === 'volunteers'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Members ({volunteers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
            activeTab === 'contacts'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Inquiries ({contacts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
            activeTab === 'activities'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Activities ({activities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new-activity')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
            activeTab === 'new-activity'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Event</span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
            activeTab === 'subscribers'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Subscribers ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar (Desktop Only) */}
        <aside className="hidden md:block w-64 bg-slate-950/60 border-r border-slate-800 p-4 space-y-1.5 flex-shrink-0">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            User Records & Management
          </div>

          {/* Tab: Voluntary Members */}
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'volunteers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4" />
              <span>Voluntary Members</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'volunteers' ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {volunteers.length}
            </span>
          </button>

          {/* Tab: Contact Inquiries */}
          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'contacts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Contact Inquiries</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'contacts' ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {contacts.length}
            </span>
          </button>

          <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Campus Content & Media
          </div>

          {/* Tab: Campus Activities */}
          <button
            onClick={() => setActiveTab('activities')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'activities'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>Campus Activities</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'activities' ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {activities.length}
            </span>
          </button>

          {/* Tab: Publish New Activity */}
          <button
            onClick={() => setActiveTab('new-activity')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'new-activity'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Event</span>
          </button>

          {/* Tab: Subscribers */}
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subscribers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Subscribers Registry</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'subscribers' ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {subscribers.length}
            </span>
          </button>

          <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System & Settings
          </div>

          {/* Tab: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Social Links & Password</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {/* =====================================================================
              TAB 1: VOLUNTARY MEMBERS LIST (USER WHO VOLUNTARILY JOINED)
             ===================================================================== */}
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>PostgreSQL Table: volunteer_applications</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Voluntary Joined Members</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Students who registered via the online joining form. Click &quot;Edit User Data&quot; to view or update their profile anytime.
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={volunteerSearch}
                    onChange={(e) => setVolunteerSearch(e.target.value)}
                    placeholder="Search by name, CNIC, hostel..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Table & Cards */}
              {volunteers.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-8">
                  <UserCheck className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">No Voluntary Applications Yet</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    When students apply on atiuaf.com/careers, their records will appear here in real-time.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-slate-800/40 rounded-2xl border border-slate-700/70 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-950/60 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="py-3 px-4">Applicant</th>
                            <th className="py-3 px-4">Contact Info</th>
                            <th className="py-3 px-4">Academic & Hostel</th>
                            <th className="py-3 px-4">CNIC / ID</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/60 font-medium">
                          {filteredVolunteers.map((vol) => (
                            <tr key={vol.id} className="hover:bg-slate-800/80 transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-white text-sm">{vol.fullName}</p>
                                <span className="text-[10px] font-mono text-slate-400">{vol.id}</span>
                              </td>
                              <td className="py-3.5 px-4 space-y-0.5">
                                <p className="text-slate-200 font-mono">{vol.phone}</p>
                                <p className="text-slate-400 text-[11px] font-mono">{vol.email}</p>
                              </td>
                              <td className="py-3.5 px-4 space-y-0.5">
                                <p className="text-emerald-300 font-semibold">{vol.degree || 'Degree N/A'}</p>
                                <p className="text-slate-400 text-[11px]">
                                  {vol.hostel} • {vol.semester}
                                </p>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-300">{vol.cnic || 'N/A'}</td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    vol.status === 'Approved'
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                      : vol.status === 'Contacted'
                                      ? 'bg-blue-950 text-blue-300 border border-blue-700'
                                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                                  }`}
                                >
                                  {vol.status || 'Under Review'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                                {vol.createdAt ? new Date(vol.createdAt).toLocaleDateString() : 'Recent'}
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setEditingVolunteer({ ...vol })}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit User</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteVolunteer(vol.id)}
                                  className="px-2 py-1 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 transition-colors inline-flex items-center text-[11px]"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-3">
                    {filteredVolunteers.map((vol) => (
                      <div
                        key={vol.id}
                        className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{vol.fullName}</h4>
                            <span className="text-[10px] font-mono text-slate-400">
                              {vol.id} • {vol.createdAt ? new Date(vol.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                              vol.status === 'Approved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : vol.status === 'Contacted'
                                ? 'bg-blue-950 text-blue-300 border border-blue-700'
                                : 'bg-amber-950 text-amber-300 border border-amber-700'
                            }`}
                          >
                            {vol.status || 'Under Review'}
                          </span>
                        </div>

                        <div className="p-2.5 bg-slate-900/60 rounded-xl text-xs space-y-1 border border-slate-800">
                          <div className="text-emerald-300 font-semibold">{vol.degree || 'Degree N/A'}</div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1.5 flex-wrap">
                            <span>Hostel: {vol.hostel || 'Day Scholar'}</span>
                            <span>•</span>
                            <span>Sem: {vol.semester || 'N/A'}</span>
                            {vol.cnic && (
                              <>
                                <span>•</span>
                                <span className="font-mono">CNIC: {vol.cnic}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {vol.phone && (
                            <a
                              href={`tel:${vol.phone}`}
                              className="flex-1 py-1.5 px-2 bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-lg text-center font-mono text-slate-200 truncate"
                            >
                              📞 {vol.phone}
                            </a>
                          )}
                          {vol.email && (
                            <a
                              href={`mailto:${vol.email}`}
                              className="flex-1 py-1.5 px-2 bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-lg text-center font-mono text-slate-200 truncate text-[11px]"
                            >
                              ✉️ {vol.email}
                            </a>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setEditingVolunteer({ ...vol })}
                            className="flex-1 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit User Data</span>
                          </button>
                          <button
                            onClick={() => handleDeleteVolunteer(vol.id)}
                            className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 text-xs font-bold transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 2: CONTACT INQUIRIES LIST
             ===================================================================== */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>PostgreSQL Table: contact_submissions</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Contact Form Inquiries</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Messages received through the Contact Secretariat form. You can view, update status, add notes, or edit details.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search by name, subject, message..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-8">
                  <MessageSquare className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">No Contact Inquiries Yet</h3>
                  <p className="text-xs text-slate-400 mt-1">Inquiries from atiuaf.com/contact will appear here.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-slate-800/40 rounded-2xl border border-slate-700/70 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-950/60 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="py-3 px-4">Inquirer</th>
                            <th className="py-3 px-4">Subject & Message</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/60 font-medium">
                          {filteredContacts.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-800/80 transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-white text-sm">{c.name}</p>
                                <p className="text-slate-400 font-mono text-[11px]">{c.email}</p>
                                {c.phone && <p className="text-slate-500 font-mono text-[10px]">{c.phone}</p>}
                              </td>
                              <td className="py-3.5 px-4 max-w-xs">
                                <p className="font-semibold text-slate-200 line-clamp-1">{c.subject}</p>
                                <p className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">{c.message}</p>
                              </td>
                              <td className="py-3.5 px-4 text-slate-300">{c.category || 'General'}</td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    c.status === 'Resolved'
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                      : c.status === 'Contacted'
                                      ? 'bg-blue-950 text-blue-300 border border-blue-700'
                                      : 'bg-slate-700 text-slate-200'
                                  }`}
                                >
                                  {c.status || 'Received'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setEditingContact({ ...c })}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteContact(c.id)}
                                  className="px-2 py-1 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 transition-colors inline-flex items-center text-[11px]"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-3">
                    {filteredContacts.map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{c.name}</h4>
                            <span className="text-[10px] font-mono text-slate-400">
                              {c.id} • {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                              c.status === 'Resolved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : c.status === 'Contacted' || c.status === 'In Progress'
                                ? 'bg-blue-950 text-blue-300 border border-blue-700'
                                : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {c.status || 'Received'}
                          </span>
                        </div>

                        <div className="p-2.5 bg-slate-900/60 rounded-xl text-xs space-y-1.5 border border-slate-800">
                          <div className="text-white font-semibold">{c.subject}</div>
                          <div className="text-slate-300 text-[11px] line-clamp-3 leading-relaxed">
                            &quot;{c.message}&quot;
                          </div>
                          <div className="text-[10px] text-slate-400 pt-0.5">
                            Category: <span className="text-slate-300">{c.category || 'General'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="flex-1 py-1.5 px-2 bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg text-center font-mono text-slate-200 truncate"
                            >
                              📞 {c.phone}
                            </a>
                          )}
                          {c.email && (
                            <a
                              href={`mailto:${c.email}`}
                              className="flex-1 py-1.5 px-2 bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg text-center font-mono text-slate-200 truncate text-[11px]"
                            >
                              ✉️ {c.email}
                            </a>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setEditingContact({ ...c })}
                            className="flex-1 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Inquiry</span>
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 text-xs font-bold transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 3: CAMPUS ACTIVITIES LIST & MANAGER
             ===================================================================== */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80">
                <div>
                  <h2 className="text-xl font-black text-white">Campus Activities</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Published events showing on atiuaf.com/activities with full photo galleries.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('new-activity')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Activity</span>
                </button>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-8">
                  <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">No Campus Activities Added Yet</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Click &quot;Publish New Activity&quot; above to add an event with up to 5 photos!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {act.images && act.images.length > 0 ? (
                          <div className="h-40 relative bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={act.images[0]} alt={act.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                              📷 {act.images.length} photos
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 bg-emerald-950 p-4 flex items-end text-xs font-bold text-emerald-300">
                            {act.category}
                          </div>
                        )}

                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{act.date}</span>
                            {act.time && <span>• {act.time}</span>}
                          </div>
                          <h4 className="text-sm font-bold text-white line-clamp-2">{act.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{act.description}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                            <span className="truncate">{act.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-slate-700/60 flex items-center justify-between mt-3">
                        <Link
                          href="/activities"
                          target="_blank"
                          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>View Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDeleteActivity(act.id)}
                          disabled={deletingId === act.id}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-red-400 hover:text-white hover:bg-red-600 border border-red-800 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 4: PUBLISH NEW ACTIVITY FORM
             ===================================================================== */}
          {activeTab === 'new-activity' && (
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-9 max-w-3xl mx-auto space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h2 className="text-xl font-black text-white">Publish New Campus Activity</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Stored directly in PostgreSQL. You can upload up to 5 photos stored on Vercel Blob.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitActivity} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Activity Name / Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Seerah Conference & Quranic Recitation 2026"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. Nov 24, 2026"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Timing (Optional)
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 11:00 AM – 02:00 PM"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Venue / Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Jinnah Auditorium, UAF Main Campus"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Activity Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide event details, student participation, and highlights..."
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                {/* Image Upload Box */}
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">
                      Event Photos (Up to 5 images • Stored on Vercel Blob)
                    </span>
                    <span className="text-xs font-mono text-emerald-400">{images.length}/5 photos</span>
                  </div>

                  {uploadError && <p className="text-xs text-red-400 mb-2">{uploadError}</p>}

                  {images.length < 5 && (
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="new-event-photos"
                      />
                      <label
                        htmlFor="new-event-photos"
                        className="cursor-pointer border border-dashed border-slate-600 hover:border-emerald-500 p-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/40 hover:bg-slate-800 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>{isUploading ? 'Uploading to Vercel Blob...' : 'Click to Upload Photos'}</span>
                      </label>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="notify-subscribers"
                    checked={notifySubscribers}
                    onChange={(e) => setNotifySubscribers(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
                  />
                  <label htmlFor="notify-subscribers" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Broadcast email notification to all subscribed students upon publishing
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing Activity...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Publish Activity</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* =====================================================================
              TAB 5: SUBSCRIBERS REGISTRY
             ===================================================================== */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80">
                <h2 className="text-xl font-black text-white">Subscribers Registry</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Subscribed student emails stored in PostgreSQL. They receive automatic updates whenever an activity is published.
                </p>
              </div>

              {subscribers.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-8">
                  <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No subscribers registered yet.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-slate-800/40 rounded-2xl border border-slate-700/70 overflow-hidden shadow-xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Subscribed Date</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {subscribers.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/80">
                            <td className="py-3 px-4 text-slate-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-mono font-bold text-white">{s.email}</td>
                            <td className="py-3 px-4 text-slate-400">
                              {new Date(s.subscribedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-2.5">
                    {subscribers.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-mono font-bold text-white truncate">{s.email}</p>
                          <p className="text-[11px] text-slate-400">
                            Subscribed: {new Date(s.subscribedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex-shrink-0">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 6: SOCIAL MEDIA LINKS & BCRYPT PASSWORD SETTINGS
             ===================================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80">
                <h2 className="text-xl font-black text-white">Social Links & Database Password</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update footer social media links and your admin password. Stored in PostgreSQL with bcrypt hashing.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {settingsError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-700 pb-2 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Footer Social Links (PostgreSQL site_settings)</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      value={socials.facebook}
                      onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Twitter / X URL</label>
                    <input
                      type="url"
                      value={socials.twitter}
                      onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={socials.instagram}
                      onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">YouTube URL</label>
                    <input
                      type="url"
                      value={socials.youtube}
                      onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">WhatsApp / Contact</label>
                    <input
                      type="text"
                      value={socials.whatsapp || ''}
                      onChange={(e) => setSocials({ ...socials, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-700 pb-2 pt-4 flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Update Admin Password (bcrypt Hash)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Leave blank to keep"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm Password</label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow flex items-center justify-center gap-2"
                  >
                    {isSavingSettings ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
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

      {/* =======================================================================
          EDIT VOLUNTEER USER DATA MODAL
         ======================================================================= */}
      {editingVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setEditingVolunteer(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5 pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                {editingVolunteer.id}
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">Edit Voluntary Member Data</h3>
              <p className="text-xs text-slate-400">
                You can view or update any of the user&apos;s details stored in PostgreSQL.
              </p>
            </div>

            {editVolSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{editVolSuccess}</span>
              </div>
            )}

            {editVolError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{editVolError}</span>
              </div>
            )}

            <form onSubmit={handleSaveVolunteerEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingVolunteer.fullName}
                  onChange={(e) => setEditingVolunteer({ ...editingVolunteer, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editingVolunteer.phone}
                    onChange={(e) => setEditingVolunteer({ ...editingVolunteer, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingVolunteer.email}
                    onChange={(e) => setEditingVolunteer({ ...editingVolunteer, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">CNIC / B-Form</label>
                  <input
                    type="text"
                    value={editingVolunteer.cnic || ''}
                    onChange={(e) => setEditingVolunteer({ ...editingVolunteer, cnic: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Status</label>
                  <select
                    value={editingVolunteer.status || 'Under Review'}
                    onChange={(e) => setEditingVolunteer({ ...editingVolunteer, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Degree Program</label>
                  <input
                    type="text"
                    value={editingVolunteer.degree || ''}
                    onChange={(e) => setEditingVolunteer({ ...editingVolunteer, degree: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Hostel / Hall</label>
                  <input
                    type="text"
                    value={editingVolunteer.hostel || ''}
                    onChange={(e) => setEditingVolunteer({ ...editingVolunteer, hostel: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Address / Permanent Location</label>
                <input
                  type="text"
                  value={editingVolunteer.address || ''}
                  onChange={(e) => setEditingVolunteer({ ...editingVolunteer, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Admin Internal Notes</label>
                <textarea
                  rows={2}
                  value={editingVolunteer.notes || ''}
                  onChange={(e) => setEditingVolunteer({ ...editingVolunteer, notes: e.target.value })}
                  placeholder="e.g. Verified enrollment at Jinnah Hall desk on Nov 24..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingVolunteer(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-wider text-[11px] text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingVolunteer}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[11px] shadow flex items-center justify-center gap-1.5"
                >
                  {isSavingVolunteer ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
          EDIT CONTACT INQUIRER DATA MODAL
         ======================================================================= */}
      {editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setEditingContact(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5 pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                {editingContact.id}
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">Edit Contact Inquiry Data</h3>
              <p className="text-xs text-slate-400">
                Update inquirer contact details, inquiry message, status, or notes in PostgreSQL.
              </p>
            </div>

            {editContactSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{editContactSuccess}</span>
              </div>
            )}

            {editContactError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{editContactError}</span>
              </div>
            )}

            <form onSubmit={handleSaveContactEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Inquirer Name</label>
                  <input
                    type="text"
                    required
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingContact.email}
                    onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={editingContact.phone || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Status</label>
                  <select
                    value={editingContact.status || 'Received'}
                    onChange={(e) => setEditingContact({ ...editingContact, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="Received">Received</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={editingContact.subject}
                  onChange={(e) => setEditingContact({ ...editingContact, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  value={editingContact.message}
                  onChange={(e) => setEditingContact({ ...editingContact, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Admin Resolution Notes</label>
                <textarea
                  rows={2}
                  value={editingContact.notes || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, notes: e.target.value })}
                  placeholder="e.g. Contacted applicant via WhatsApp and provided guidance..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingContact(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-wider text-[11px] text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingContact}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider text-[11px] shadow flex items-center justify-center gap-1.5"
                >
                  {isSavingContact ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
