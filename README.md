# Student Power — Official Website
> **Official Islamic Student Movement Web Platform**  
> *Anjuman Talaba-e-Islam (ATI) — Established 1968*

![Student Power Brand](public/images/student-power-logo.png)

A modern, responsive, full-stack website built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed according to the authentic brand identity of **Student Power**, balancing **Primary Red (#C62828)** and **Primary Green (#087A43)** with crisp Islamic geometry, professional typography, and responsive UX across mobile, tablet, and desktop devices.

---

## 1. Brand Identity & Color System

The website strictly follows the official logo color identity:

| Element | Hex Color | Role in Design System |
| :--- | :--- | :--- |
| **Primary Green** | `#087A43` | Primary action buttons, active navigation indicators, institutional badges, Islamic accents, trust badges |
| **Primary Red** | `#C62828` | Secondary CTAs, urgency highlights, section badges, metric counters, blood society indicators |
| **Clean White** | `#FFFFFF` | Core content cards, main section backgrounds, high-contrast readability |
| **Brand Black** | `#171717` | High-contrast typography, top bar, executive footer, grounding elements |
| **Surface Off-White** | `#FAFAFA` | Subtle alternating background tint for visual depth |

Subtle Islamic 8-point geometric star lattices (`components/IslamicPattern.tsx`) provide authentic cultural dignity without visual clutter.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (React 18, App Router)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS with custom brand extension
- **Icons**: Lucide React
- **Animations & Transitions**: Framer Motion & CSS hardware-accelerated animations
- **Backend**: Next.js Serverless Route Handlers (`app/api/*`)
- **Deployment**: Vercel Production Ready

---

## 3. Website Structure & Pages

1. **Homepage (`/`)**:
   - Modern Navbar with official emblem and mobile drawer
   - Hero section with dual Red & Green CTAs and live impact counters
   - About Student Power introduction
   - Vision & Mission dual pillars
   - 6 Core Institutional Objectives
   - Flagship Programs & Initiatives directory (Talaba Rahnuma, Bait-ul-Ilm, Noor-e-Ilm, etc.)
   - Student Activities & Community Action showcase
   - Latest Announcements & News feed
   - High-impact Membership banner
   - Executive Footer

2. **About Us (`/about`)**:
   - Organizational background & heritage dating back to 1968 in Karachi
   - Comprehensive Vision & Mission statements
   - Six Core Values: *Imaan* (Faith), *Ilm* (Knowledge), *Akhlaq* (Character), *Ittehad* (Unity), *Khidmat* (Service), *Adl* (Justice)
   - Historic Milestones timeline (1968 to Present)
   - Central Leadership & Advisory Board profiles (with customizable placeholders)
   - Non-violent student advocacy philosophy

3. **Careers & Opportunities (`/careers`)**:
   - Real opportunities directory (Volunteer, Internship, Fellowship, Core Staff)
   - Category filtering with graceful empty state component
   - 4-step recruitment and onboarding roadmap
   - Interactive, production-ready Application Form:
     - Full Name, Email, Phone, Education, Position, Opportunity Type, LinkedIn, Introduction
     - CV / Resume Upload (PDF / DOC / DOCX client & server validation up to 5MB)
     - Real-time client feedback and tracking reference IDs

4. **Contact Central Secretariat (`/contact`)**:
   - Central Headquarters & 5 Regional Chapter Secretariats
   - Official email, phone, helpline, and office working hours
   - Interactive Contact Form with validation and serverless backend
   - Social media directory (Facebook, Twitter/X, Instagram, YouTube, WhatsApp)
   - Interactive FAQ accordion for immediate student inquiries

5. **Custom 404 Page (`/not-found.tsx`)**:
   - Branded error state with official seal and quick recovery links

---

## 4. Backend API Architecture

- **`POST /api/contact`**:
  - Validates contact form data (name, email, subject, category, message).
  - Generates tracking ID (`SP-MSG-XXXXXX`).
  - Stores submissions in persistent `.data/contact_submissions.json`.
  - Ready for SMTP / SendGrid / Resend email integration.

- **`POST /api/careers/apply`**:
  - Handles `multipart/form-data` applications.
  - Validates file type and 5MB size limit.
  - Generates application tracking ID (`SP-APP-XXXXXX`).
  - Saves resume file and metadata in `.data/resumes/` and `.data/career_applications.json`.
  - Production-ready for Vercel Blob / AWS S3 persistent storage.

- **`GET /api/news`**:
  - Serves announcements and press dispatches with optional category and featured filtering.

---

## 5. Local Development Setup

### Prerequisites
- Node.js (version 18.17+ or 20+)
- npm, pnpm, or yarn

### Installation
```bash
# Clone or navigate to the repository
cd /path/to/ATI

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Vercel Deployment Guide

The project is structured to deploy smoothly to Vercel without manual configuration.

### Deploying via Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Deploying via GitHub / Git Integration
1. Push this repository to GitHub or GitLab.
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the repository.
4. Framework Preset will auto-detect as **Next.js**.
5. Click **"Deploy"**.

### Persistent File Storage on Vercel
In a serverless environment (such as Vercel), the local filesystem is ephemeral and read-only outside of `/tmp`. For persistent CV/resume storage in production:
1. Integrate **Vercel Blob** (`@vercel/blob`) or **AWS S3** / **Cloudinary**.
2. Set the environment variables in the Vercel Project Dashboard:
   - `BLOB_READ_WRITE_TOKEN`: Token from Vercel Blob storage
   - `CONTACT_RECEIVER_EMAIL`: Notification recipient email (e.g., `info@studentpower.org.pk`)

---

## 7. Build Verification

To verify that the production build compiles cleanly without errors:

```bash
npm run build
npm run start
```
