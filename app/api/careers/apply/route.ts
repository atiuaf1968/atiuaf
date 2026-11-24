import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveVolunteerApplication } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = {
        name: formData.get('name') || formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone') || formData.get('number'),
        cnic: formData.get('cnic'),
        hostel: formData.get('hostel'),
        degree: formData.get('degree') || formData.get('education'),
        semester: formData.get('semester'),
        address: formData.get('address'),
      };
    }

    const fullName = (body.name || body.fullName || '').toString().trim();
    const email = (body.email || '').toString().trim();
    const phone = (body.phone || body.number || '').toString().trim();
    const cnic = (body.cnic || '').toString().trim();
    const hostel = (body.hostel || '').toString().trim();
    const degree = (body.degree || body.education || '').toString().trim();
    const semester = (body.semester || '').toString().trim();
    const address = (body.address || '').toString().trim();

    // Required fields validation
    if (!fullName || !email || !phone || !cnic || !hostel || !degree || !semester || !address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please fill in all mandatory fields: Full Name, Email, WhatsApp Number, CNIC, Hostel, Degree, Semester, and Address.',
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const applicationId = `ATI-VOL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;

    const memberRecord = {
      id: applicationId,
      fullName,
      email,
      phone,
      cnic,
      hostel,
      degree,
      semester,
      address,
      status: 'Under Review',
      notes: '',
    };

    // 1. Save directly into PostgreSQL database
    try {
      await saveVolunteerApplication(memberRecord);
      console.log(`[Voluntary Membership] Saved ${applicationId} to PostgreSQL: ${fullName}`);
    } catch (dbErr) {
      console.error('Failed to save voluntary membership to PostgreSQL:', dbErr);
    }

    // 2. Local fallback sync
    try {
      const storageDir = path.join(process.cwd(), '.data');
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      const logFile = path.join(storageDir, 'voluntary_memberships.json');
      let existingMembers = [];
      if (fs.existsSync(logFile)) {
        try {
          existingMembers = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
        } catch {
          existingMembers = [];
        }
      }
      existingMembers.push({ ...memberRecord, submittedAt: new Date().toISOString() });
      fs.writeFileSync(logFile, JSON.stringify(existingMembers, null, 2));
    } catch (fsErr) {
      console.error('Failed to sync voluntary membership locally:', fsErr);
    }

    // 3. Dispatch dual emails via Mailtrap SMTP:
    try {
      const { sendCareerApplicationEmails } = await import('@/lib/mail');
      await sendCareerApplicationEmails({
        fullName,
        email,
        phone,
        cnic,
        hostel,
        degree,
        semester,
        address,
        applicationId,
      });
    } catch (mailError) {
      console.warn('Volunteer email dispatch warning:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Your voluntary membership registration has been received! Welcome to Anjuman Talaba-e-Islam UAF.',
      applicationId,
    });
  } catch (error) {
    console.error('Volunteer Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process registration. Please check your connection and try again.' },
      { status: 500 }
    );
  }
}
